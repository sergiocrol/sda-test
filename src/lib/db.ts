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
          user: "postgres",
          password: "D0stoievski1821",
          host: "0.0.0.0",
          port: 5432,
          database: "qr_codes",
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
          control_image TEXT
        )
      `;
      await client.query(createTableQuery);
    }

    const result: QueryResult<T> = await client.query(query, params);
    process.env.ENV === "development"
      ? (await localConnection)?.release()
      : (client as VercelPoolClient).release();
    return result.rows;
  } catch (err) {
    throw new Error(`Error executing query: ${err}`);
  }
}
