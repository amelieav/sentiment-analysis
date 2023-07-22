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

// Function to check for bad words in the message
function containsBadWord(message) {
    const badWords = process.env.BAD_WORDS.split(',').map(word => word.trim().toLowerCase());
    const lowerCaseMessage = message.content.toLowerCase();
  
    return badWords.some(badWord => lowerCaseMessage.includes(badWord));
}




client.on("ready", () =>{
    console.log('logged in as ', client.user.tag,'!')
})

client.on("messageCreate", (message) => {
    if (message.author.bot) return; // Ignore messages sent by bots

    console.log(`Message from ${message.author.username}: ${message.content}`);

    if (message.content === "ping") {
        message.reply("pong");
    }

    // Check for specific mentions of the bot
    const botMentionPattern = /sentiment\s*bot/i;
    if (botMentionPattern.test(message.content)) {
        // Check if the message also contains a bad word
        if (containsBadWord(message)) {
            message.reply("Hi I am Sentiment Bot, my purpose is to tell you if your message has a negative sentiment (i.e. it's a mean message), and this message definitely has a negative sentiment :)");
        } else {
            message.reply("Hello, I am Sentiment Bot! Nice to meet you! I can tell you if your message has a negative sentiment (i.e. it's a mean message).");
        }
        return; // Exit the function early to avoid further processing
    }

    if (containsBadWord(message)) {
        message.reply("I think this message has a negative sentiment.");
    }
});

client.login(process.env.TOKEN)