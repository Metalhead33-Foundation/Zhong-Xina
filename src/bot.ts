import axios from 'axios';
import { Client, CommandInteraction, Intents, Message, PartialMessage, Permissions, User, Guild, Channel, GuildChannel, ThreadChannel } from 'discord.js';
import { SlashCommandBuilder} from '@discordjs/builders';
import { REST} from '@discordjs/rest';
import { Routes} from 'discord-api-types/v9';
import { token, guildId, clientId, RestHttp } from './constants'
import { GuildFunctions, SOCIAL_CREDIT_WRITE_INTERVAL } from './guild'
import { randomItem, passCommands, zhongSongs } from './commands'

const socialGood = 'https://i.imgur.com/PtGG2kM.png';
const socialBad = 'https://i.imgur.com/QhxWTbd.png';
const noCaps = 'Whoa, easy with the all-caps, comrade!';
const noSlurs = 'Please don\' use racial slurs, comrade. They\'re harmful to the server\'s existence.';
const noDeathThreats = 'Issuing death threats on this server is the quickest way to get banned, comrade.'
const commandMap = new Map<string, (interaction: CommandInteraction) => Promise<void>>();

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

// HELPER FUNCTIONS

function sendToSteph(msg: any) {
    const user = client.users.cache.get('894820658461175809');
    user?.send(msg);
}

async function socialPlus20(msg: Message | PartialMessage) : Promise<void> {
    if (msg.author == null) {
        console.log("socialPlus20: Message had no author")
        return;
    }
	if(msg.guild) {
    await GuildFunctions.increaseSocialCredit(msg.author, msg.guild, 20);
    await msg.reply({files: [socialGood]}).then(msg => {
        setTimeout(() => msg.delete(), 20000)
    });
	}
}

async function socialMinus20(msg: Message | PartialMessage) : Promise<void> {
    if (msg.author == null) {
        console.log("socialMinus20: Message had no author")
        return;
    }
	if(msg.guild) {
    await GuildFunctions.decreaseSocialCredit(msg.author, msg.guild, 20);
    const msgResponse = await msg.reply({files: [socialBad]});
    setTimeout(() => msgResponse.delete(), 20000);
	}
}



// When the client is ready, run this code (only once)
client.once('ready', () => {
	passCommands();
    console.log('Ready!');
    setInterval(GuildFunctions.saveSocialCredits, SOCIAL_CREDIT_WRITE_INTERVAL);
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
	try {
		const str = reaction.emoji.toString();
		// <@!906261693775093821>
		if (str === '🇨🇳') {
			await socialPlus20(reaction.message);
		} else if (str === '🇹🇼') {
			await socialMinus20(reaction.message);
		}
	}
	catch(e) {
		console.log(e);
	}
});
client.on('messageReactionRemove', async (reaction) => {
	try {
		const str = reaction.emoji.toString();
		if (reaction.message.author == null) {
			console.log("messageReactionRemove: Message had no author")
			return;
		}
		if(reaction.message.guild) {
			if (str === '🇨🇳') {
				await GuildFunctions.decreaseSocialCredit(reaction.message.author, reaction.message.guild, 20);
			} else if (str === '🇹🇼') {
				await GuildFunctions.increaseSocialCredit(reaction.message.author, reaction.message.guild, 20);
			}
		}
	}
	catch(e) {
		console.log(e);
	}
});

function addMessage(cost: number, reply: string, prev: { deductions: number, replies: string[] }): { deductions: number, replies: string[] } {
    const {deductions, replies} = prev;

    return {deductions: deductions + cost, replies: [...replies, reply]}
}

function validateMessage(str: string, words: string[], reply: string, costFn: (str: string) => number, prev: { deductions: number, replies: string[] }): { deductions: number, replies: string[] } {
    const lower = str.toLowerCase();

    const deduction = words.reduce((total, item) => total + (lower.includes(item) ? costFn(str) : 0), 0)
    if (deduction > 0) {
        return addMessage(deduction, reply, prev)
    }
    return prev
}

client.on('messageCreate', async msg => {
	try {
		if(!msg.guild) return;
		const str = msg.content;
		const lower = str.toLowerCase();
		const upper = str.toUpperCase();
		let validations: { deductions: number, replies: string[] } = {deductions: 0, replies: []};
		for(const channelId in (await GuildFunctions.getApoliticalChannels(msg.guild)) ) {
			if (msg.channelId === channelId) {
				if(!msg.guild) return;
				validations = validateMessage(str, await GuildFunctions.getPoliticalWords(msg.guild), 
				await GuildFunctions.generateNoPolitickString(msg.channelId, await GuildFunctions.getPoliticalChannel(msg.guild)),
				(str) => 10 + str.length, validations)
			}
		}
		validations = validateMessage(str, await GuildFunctions.getRacialSlurs(msg.guild), noSlurs, (str) => 10 + str.length, validations)
		validations = validateMessage(str, await GuildFunctions.getDeathThreats(msg.guild), noDeathThreats, (str) => 200 + str.length * 2, validations);
		if (upper === str && !(lower === str) && str.length >= 2) {
			validations = addMessage(5 + str.length, noCaps, validations)
		}
		(await GuildFunctions.getTrolledMembers(msg.guild)).forEach(badMember => {
			if (msg.author.id ===  badMember) {
				validations = addMessage(1 + str.length, randomItem(zhongSongs), validations)
			}
		});
		if (validations.deductions > 0) {
			await GuildFunctions.decreaseSocialCredit(msg.author, msg.guild, validations.deductions);
			if (validations.replies.length > 0) {
				await msg.reply(validations.replies.join("\n"));
			}
			return;
		}
		if (str === '🇨🇳') {
			await socialPlus20(msg);
			return;
		} else if (str === '🇹🇼') {
			await socialMinus20(msg);
			return;
		}
		await GuildFunctions.increaseSocialCredit(msg.author, msg.guild, 1 + Math.round(Math.sqrt(str.length)));
	}
	catch(e) {
		console.log(e);
	}
})

// Login to Discord with your client's token
client.login(token).then(() => console.log("Finished")).catch((e) => console.log("Error: " + e));