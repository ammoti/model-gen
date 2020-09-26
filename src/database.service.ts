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
        let isSuccess = false;
        await conn
          .connect()
          .then(() => {
            log(chalk.magenta("naber", isSuccess));
            isSuccess = true;
          })
          .catch((err) => {
            isSuccess = false;
          });
        log("con", conn.connected);
        return isSuccess;
    }
  }
}
