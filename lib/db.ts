import pg from "pg";

const { Pool } = pg;

type GlobalWithPool = typeof globalThis & {
  postgresPool?: pg.Pool;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const globalForPool = globalThis as GlobalWithPool;

  if (!globalForPool.postgresPool) {
    globalForPool.postgresPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: process.env.DATABASE_URL.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return globalForPool.postgresPool;
}

export function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}

export async function getRegistrationCount() {
  const result = await query<{ count: string }>("select count(*)::text as count from party_registrations");
  return Number(result.rows[0]?.count ?? 0);
}

