import { Client, Collection } from "discord.js";
import { getActiveProposalsCommand } from "./commands/activeProposals";
import { config } from "dotenv";

config();

const prefix = process.env.PREFIX || "!";

const client = new Client();
const commands: Collection<string, any> = new Collection();
commands.set(getActiveProposalsCommand.name, getActiveProposalsCommand);
commands.set("test", getActiveProposalsCommand);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  
  if (!commands.has(command)) {
    return
  };

  try {
    commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.TOKEN);
