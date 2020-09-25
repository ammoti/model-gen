/* eslint-disable no-case-declarations */
import { DatabaseType } from "./model/enum/databaseType";
import mssql from "mssql";
import chalk from "chalk";
import { log } from 'console';

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
        conn.connect(function (err: any) {
          if (err != null) {
           log(chalk.redBright(err));
          } else {
            conn.query`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='test-npm'`.then(
              async (res) => {
                res.recordset.forEach(async (value) => {
                  await log(chalk.bgMagenta(value.TABLE_NAME));
                });
                conn.close();
              }
            );
          }
        });
    }
  }
}
