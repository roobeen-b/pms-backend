import { Pool } from "pg";
import { config } from "../db/config";
const pool = new Pool(config);

interface ICreateTable {
  (schema: string): Promise<any>;
}

interface ICheckRecordExists {
  (tableName: string, column: string, value: any): Promise<any>;
}

interface IInsertRecord {
  (tableName: string, record: Record<string, any>): Promise<any>;
}

export const createTable: ICreateTable = async (schema) => {
  const client = await pool.connect();
  try {
    const results = await client.query(schema);
    return results;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export const checkRecordExists: ICheckRecordExists = async (
  tableName,
  column,
  value
) => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = $1`;
    const result = await client.query(query, [value]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export const insertRecord: IInsertRecord = async (tableName, record) => {
  const client = await pool.connect();
  try {
    const columns = Object.keys(record).join(", ");
    const values = Object.keys(record)
      .map((_, idx) => `$${idx + 1}`)
      .join(", ");
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values}) RETURNING *`;
    const valuesArray = Object.values(record);

    const result = await client.query(query, valuesArray);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
