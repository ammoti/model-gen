import { Command, flags } from "@oclif/command";
import clear from "clear";
import figlet from "figlet";
import chalk from "chalk";
/**
 * model generator
 */
class ModelGenerator extends Command {
  static description = "describe the command here";

  static flags = {
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
    this.log(
      chalk.greenBright(
        figlet.textSync("model-gen", { horizontalLayout: "full" })
      )
    );
    this.log(chalk.red(flags.conStr));
    const name = flags.conStr ?? "world";
    if (args.conStr) {
      this.log(`you input --force and --file: ${name}`);
    }
  }
}

export = ModelGenerator;
