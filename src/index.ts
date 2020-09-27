import { Command, flags } from "@oclif/command";
import clear from "clear";
import * as inquirer from "inquirer";
import figlet from "figlet";
import chalk from "chalk";
import { DatabaseService } from "./database.service";
import { DatabaseType } from "./model/enum/databaseType";
import { string } from "@oclif/command/lib/flags";
import { ConnectionPool } from "mssql";
/**
 * model generator
 */
class ModelGenerator extends Command {
  static description = "describe the command here";

  static flags = {
    database: flags.string({
      options: ["MSSQL", "PostgreSQL", "MongoDB", "MySql"],
    }),
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    conStr: flags.string({
      char: "s",
      description: "Connection String for connect to database",
    }),
    // flag with no value (-f, --force)
  };
  /**
   *
   */
  async run() {
    const { args, flags } = this.parse(ModelGenerator);
    clear();
    const response: any = await inquirer.prompt([
      {
        name: "database",
        message: "Select a database",
        type: "list",
        choices: [{ name: "MSSQL" }, { name: "PostgreSQL" }],
      },
    ]);
    this.log(
      chalk.greenBright(
        figlet.textSync("model-gen", { horizontalLayout: "full" })
      )
    );
    this.log(chalk.bgYellowBright("You choose", response.database));
    if (flags.conStr) {
      this.connectDb(flags.conStr);
      this.log(chalk.red(flags.conStr));
      const name = flags.conStr ?? "world";
      if (args.conStr) {
        this.log(`you input --force and --file: ${name}`);
      }
    }
  }

  /**
   *@param {string} connectionString
   */
  async connectDb(connectionString: string) {
    try {
      const service: DatabaseService = new DatabaseService();
      const result = await service
        .connectToDb(connectionString, DatabaseType.MSSQL)
        .then((value) => {
          return value;
        });
      if (result) {
        this.log(chalk.italic("Congrats Bro"));
        const tableNames = await service.getDatabaseTables(
          new ConnectionPool(connectionString),
          "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='test-npm'"
        );
        this.log(chalk.cyanBright(tableNames));
      } else {
        this.log(chalk.redBright("Something went wrong!!!"));
      }
    } catch (error) {
      this.log(error);
    }
  }
}

export = ModelGenerator;
