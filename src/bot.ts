import { Client, Intents } from 'discord.js';
import { token } from './constants'
import * as GuildFunctions from './guild'
import { passCommands, commandMap } from './commands'
import { checkupMsg, onReactCreate, onReactDestroy } from './message'
import * as http from 'http';

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	GuildFunctions.refreshEiko();
	GuildFunctions.refreshTifa();
	passCommands();
    console.log('Ready!');
    setInterval(GuildFunctions.saveSocialCredits, GuildFunctions.SOCIAL_CREDIT_WRITE_INTERVAL);
    setInterval(GuildFunctions.refreshEiko, GuildFunctions.SOCIAL_CREDIT_WRITE_INTERVAL);
    setInterval(GuildFunctions.refreshTifa, GuildFunctions.SOCIAL_CREDIT_WRITE_INTERVAL);
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const {commandName} = interaction;
	try {
		const command = commandMap.get(commandName)
		if (command) {
			await command(interaction);
		}
	}
	catch(e) {
		await interaction.reply({
			ephemeral: true,
			content: `Something went wrong!\n${e}`
		});
		console.log(e);
	}
});
client.on('messageReactionAdd', async (reaction) => {
	await onReactCreate(reaction);
});
client.on('messageReactionRemove', async (reaction) => {
	await onReactDestroy(reaction);
});

client.on('messageCreate', async msg => {
	await checkupMsg(msg);
})

// Login to Discord with your client's token
client.login(token).then(() => console.log("Finished")).catch((e) => console.log("Error: " + e));
http.createServer(function (request, response) {
    console.log('request starting for ');
    console.log(request);
	response.writeHead(200, { 'Content-Type': "text/txt" });
	response.end("Zhong Xina is online!", 'utf-8');
 }).listen(process.env.PORT || 5000)