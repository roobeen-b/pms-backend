import * as sql from "mssql";
import { config } from "../db/config";
const poolPromise = new sql.ConnectionPool(config).connect();

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
  const pool = await poolPromise;
  try {
    const results = await pool.query(schema);
    return results;
  } catch (err) {
    throw err;
  }
};

export const checkRecordExists: ICheckRecordExists = async (
  tableName,
  column,
  value
) => {
  const pool = await poolPromise;
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = @value`;
    const request = pool.request();
    request.input("value", value);
    request.query(query, (err: Error | undefined, results: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.recordset.length ? results.recordset[0] : null);
      }
    });
  });
};

export const insertRecord: IInsertRecord = async (tableName, record) => {
  const pool = await poolPromise;
  return new Promise((resolve, reject) => {
    console.log(tableName, record);

    const columns = Object.keys(record).join(", ");
    const values = Object.keys(record)
      .map((key) => `@${key}`)
      .join(", ");
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

    const request = pool.request();
    Object.keys(record).forEach((key) => {
      request.input(key, record[key]);
    });

    request.query(query, (err: Error | undefined, results: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
