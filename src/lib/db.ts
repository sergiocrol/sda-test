import {
  db,
  QueryResult,
  QueryResultRow,
  VercelPoolClient,
} from "@vercel/postgres";
import { Pool } from "pg";

export default async function requestHandler<T extends QueryResultRow>(
  query: string,
  params?: any[]
): Promise<T[]> {
  try {
    let client;
    let localConnection;

    if (!client) {
      if (process.env.ENV === "development") {
        client = new Pool({
          user: process.env.POSTGRES_LOCAL_USER,
          password: process.env.POSTGRES_LOCAL_PASSWORD,
          host: process.env.POSTGRES_LOCAL_HOST,
          port: process.env.POSTGRES_LOCAL_PORT as unknown as number,
          database: process.env.POSTGRES_LOCAL_DB,
        });

        localConnection = client.connect();
      } else {
        client = await db.connect();
      }
    }

    const tableExistsQuery = `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'qr_codes'
        )
      `;
    const tableExistsResult = await client.query<{ exists: boolean }>(
      tableExistsQuery
    );

    if (!tableExistsResult.rows[0].exists) {
      const createTableQuery = `
        CREATE TABLE qr_codes (
          id SERIAL PRIMARY KEY,
          output TEXT[],
          prompt TEXT,
          init_image TEXT,
          control_image TEXT,
          negative_prompt TEXT,
          controlnet_model TEXT,
          controlnet_type TEXT,
          model_id TEXT,
          auto_hint TEXT,
          guess_mode TEXT,
          width SMALLINT,
          height SMALLINT,
          controlnet_conditioning_scale NUMERIC,
          samples SMALLINT,
          scheduler TEXT NULL,
          num_inference_steps SMALLINT,
          safety_checker TEXT,
          base64 TEXT,
          enhance_prompt TEXT,
          guidance_scale NUMERIC,
          strength NUMERIC,
          use_karras_sigmas TEXT,
          mask_image TEXT,
          tomesd TEXT,
          vae TEXT NULL,
          lora_strength NUMERIC NULL,
          lora_model TEXT NULL,
          embeddings_model TEXT NULL,
          multi_lingual TEXT,
          seed BIGINT NULL,
          upscale TEXT,
          clip_skip SMALLINT,
          temp TEXT
        )
      `;
      try {
        await client.query(createTableQuery);
      } catch (error) {
        console.log({ error });
      }
    }

    const result: QueryResult<T> = await client.query(query, params);

    process.env.ENV === "development"
      ? (await localConnection)?.release()
      : (client as VercelPoolClient).release();
    return result.rows;
  } catch (err) {
    console.log({ err });
    throw new Error(`Error executing query: ${err}`);
  }
}
