/* eslint-disable no-case-declarations */
import { DatabaseType } from "./model/enum/databaseType";
import mssql from "mssql";
import chalk from "chalk";
import { log } from "console";

/**
 * Database Service Responsible for the connection, commands
 */
export class DatabaseService {
  /**
   * connectToDb
   * @param {string} connectionString  checking db is ok or not
   * @param {DatabaseType} type is a enum for determine which db will use
   * @return {boolean} true mean is work
   */
  public async connectToDb(connectionString: string, type: DatabaseType) {
    switch (type) {
      case DatabaseType.MSSQL:
        const conn: mssql.ConnectionPool = new mssql.ConnectionPool(
          connectionString
        );
        await conn
          .connect()
          .then(() => {})
          .catch((err) => {
            log(chalk.red("Error :", err));
          });
        const state = conn.connected;
        conn.close();
        return state;
    }
  }
  /**
   * This method will return all db tables for generator
   * @param {mssql.ConnectionPool} conn Connection pool
   * @param {string} query Query for run connection poll
   */
  public async getDatabaseTables(conn: mssql.ConnectionPool, query: string) {
    const tableList: string[] = [];
    await conn.connect();
    await conn.query(query).then((value) => {
      value.recordset.forEach((catName) => {
        tableList.push(catName.TABLE_NAME);
      });
    });
    conn.close();
    return tableList;
  }
}
