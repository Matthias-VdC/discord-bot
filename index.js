import { Client } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { Player } from "discord-player";
dotenv.config();



const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
})
const player = new Player(client);

const commandPrefix = "!";

const commands = fs.readdirSync("./commands");

for (let i = 0; i < commands.length; i++) {
    commands[i] = commands[i].substring(0, commands[i].length - 3);
}

console.log(commands);

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

player.on("trackStart", (queue, track) =>
    queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))

client.on("messageCreate", async message => {
    if (message.content.startsWith(commandPrefix)) {
        let commandCounter = 0;
        for (let i = 0; i < commands.length; i++) {
            if (message.content.includes(`${commands[i]}`, 1)) {
                commandCounter = 1;
                let { default: command } = await import(`./commands/${commands[i]}.js`)
                command(message);
            }
        }
        if (commandCounter == 0) {
            message.reply("Command not found!");
        }
    }
});



if (process.env.TOKEN) {
    client.login(process.env.TOKEN)
} else {
    console.log("Create a file called .env and put your bot's token in there.");
    process.exit(1);
}