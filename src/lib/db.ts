import { db, QueryResult, QueryResultRow } from "@vercel/postgres";

export default async function requestHandler<T extends QueryResultRow>(
  query: string,
  params?: any[]
): Promise<T[]> {
  try {
    const client = await db.connect();

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
    client.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Error executing query: ${err}`);
  }
}
