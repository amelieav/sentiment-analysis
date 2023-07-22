require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});



client.on("ready", () =>{
    console.log('logged in as ', client.user.tag,'!')
})

client.on("messageCreate", (message) => {
    if (message.author.bot) return; // Ignore messages sent by bots

    console.log(`Message from ${message.author.username}: ${message.content}`);

    if (message.content === "ping") {
        message.reply("pong");
    }
});

client.login(process.env.TOKEN)