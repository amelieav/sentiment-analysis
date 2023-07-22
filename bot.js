require('dotenv').config()
// https://www.npmjs.com/package/sentiment


/*
 * Sentiment analysis
 */


var Sentiment = require('sentiment');
var sentiment = new Sentiment();

function getScoreAsString(score) {
    if (score <= -5) {
        return "Yikes! This message is extremely negative. 😱😡👎";
    } else if (score > -5 && score < -3) {
        return "Oh no! This message is very negative. 😔👎";
    } else if (score >= -3 && score < -1) {
        return "Hmm, this message seems negative. 🙁";
    } else if (score >= -1 && score < 0) {
        return "A bit negative, but not too bad. 😕";
    } else if (score === 0) {
        return "Neutral message. 🤔";
    } else if (score > 0 && score <= 1) {
        return "A touch of positivity! 😊";
    } else if (score > 1 && score <= 3) {
        return "Hey, this message is quite positive! 😄👍";
    } else if (score > 3 && score <= 5) {
        return "Woo-hoo! This message is very positive! 🎉😃👍";
    } else {
        return "Wowza! This message is extremely positive! 🌟😍👍";
    }
}




function getAnalysis(message){
    var result = sentiment.analyze(message);
    return getScoreAsString(result.score)
}


/**
 * Discord bot implementation
 */

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const botMentionPattern = /sentiment\s*bot/i;


// Function to check for bad words in the message
function containsBadWord(message) {
    const badWords = process.env.BAD_WORDS.split(',').map(word => word.trim().toLowerCase());
    const lowerCaseMessage = message.content.toLowerCase();
  
    return badWords.some(badWord => lowerCaseMessage.includes(badWord));
}




client.on("ready", () => {
    console.log('Logged in as', client.user.tag, '!');
    client.user.setPresence({
        status: "online",
    });
});

client.on("messageCreate", async (message) => {
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
            message.reply("Hi, I am Sentiment Bot. My purpose is to tell you if your message has a negative sentiment (i.e., it's a mean message), and this message definitely has a negative sentiment :)");
        } else {
            message.reply("Hello, I am Sentiment Bot! Nice to meet you! I can tell you if your message has a negative sentiment (i.e., it's a mean message).");
        }
        return; // Exit the function early to avoid further processing
    }

    if (containsBadWord(message)) {
        message.reply("Uh oh, I think this is a rude message...");
    }






    
   // Check if the message is a reply and if the original message contains the bot's ID
   if (message.reference && message.content.includes(client.user.id)) {
    try {
        // Fetch the original message
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        var sentimentResult = getAnalysis(referencedMessage.content);
        message.channel.send(sentimentResult);
    } catch (error) {
        console.error('Error fetching the referenced message:', error);
        message.reply('There was an error while fetching the referenced message.');
    }
} 

});


client.login(process.env.TOKEN)