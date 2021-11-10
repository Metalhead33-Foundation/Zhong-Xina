import fetch from 'node-fetch';
import {Client, CommandInteraction, Intents, Message, PartialMessage, Permissions, User} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const { token, guildId, clientId, RestHttp } = require(process.env.AUTHLOC ? process.env.AUTHLOC : './auth.json' );

const socialGood = 'https://i.imgur.com/PtGG2kM.png';
const socialBad = 'https://i.imgur.com/QhxWTbd.png';
const zhongSongs = [ 'https://www.youtube.com/watch?v=QiqmbbrNW6k',
					'https://www.youtube.com/watch?v=LB1P8IAiDwk',
					'https://www.youtube.com/watch?v=10cPXoKjRKI',
					'https://www.youtube.com/watch?v=EzApQy2DcSg',
					'https://www.youtube.com/watch?v=nOG76Pszuog',
					'https://www.youtube.com/watch?v=_KOJJ5IoEvo',
					'https://www.youtube.com/watch?v=v8nQIFKrKXA',
   				];
const hohols = [
	'https://www.youtube.com/watch?v=w0eq30gJV2U', 'https://tenor.com/view/hohol-ukrainian-dance-pigs-gif-20883345',
	'https://tenor.com/view/hohol-gif-20476649', 'https://tenor.com/view/rei-ayanami-ukraine-hohol-evangelion-gif-22605880',
	'https://tenor.com/view/%D1%81%D0%BB%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BB%D0%B4-%D0%B6%D0%BE%D0%B6%D0%BE-%D1%84%D0%BB%D0%B5%D0%BA%D1%81-%D0%BC%D1%83%D1%85%D0%B0%D0%BC%D0%BC%D0%B5%D0%B4-%D0%BA%D1%83%D0%B4%D0%B6%D0%BE-gif-16553377', 'https://tenor.com/view/%D1%85%D0%BE%D1%85%D0%BB%D0%B0-%D0%B7%D0%B0%D0%B1%D1%8B%D0%BB%D0%B8-moonphobia-gif-20381443', 'https://tenor.com/view/hohol-gif-20486476', 'https://tenor.com/view/ukraine-ukrainian-animation-scared-scary-aaaah-gif-12499590', 'https://tenor.com/view/azerbaycan-ukrayna-flag-bayra%C4%9F-%D0%B0%D0%B7%D0%B5%D1%80%D0%B1%D0%B0%D0%B9%D0%B4%D0%B6%D0%B0%D0%BD-gif-18215874', 'https://tenor.com/view/ukraine-flag-ukraine-flag-flag-ukraine-ukraine-map-gif-14339705', 'https://tenor.com/view/pig-piggy-hohol-hohlinka-cute-gif-20598787', 'https://tenor.com/view/hohol-gif-23566318', 'https://tenor.com/view/nikocado-avocado-mental-breakdown-mukbang-rage-angry-food-eating-gif-17940312'
];
const inchenHanchi = 'https://youtu.be/3J6m2xwqLnY';
const noCaps = 'Whoa, easy with the all-caps bro!';
const noSlurs = 'Please don\' use racial slurs, comrade. They\'re harmful to the server\'s existence.';
const noDeathThreats = 'Issuing death threats on this server is the quickest way to get banned, comrade.'
const noPolitick = 'Getting awfully political for <#795737593923895337>, comrade! Mind taking it to <#795737668654071818>?';
const politicalWords = [ 'globohomo', 'globalist', 'nazi', 'communist', 'communism', 'racism', 'racist', 'transgender', 'commie', 'leftist', 'left-wing', 'right-wing', 'far-right', 'jew', 'joos', 'jooz', 'jude', 'jewish', 'kike', 'skype', 'judish', 'judisch', 'yiddish', 'żyd', 'jevrej', 'jevrei', 'yevrey', 'yevrei', 'long-nose tribe', 'holocaust' ]; 
const racialSlurs = [ 'nigger', 'knee-grow', 'nignog', 'nig-nog' ];
const deathThreats = [ 'll kill you', 'll kill u' ];
var socialCredits = new Map();
var commandMap = new Map();
const DEFAULT_SOCIAL_CREDITS = 1000;
const SOCIAL_CREDIT_BATCH_WRITES = 250;
const SOCIAL_CREDIT_WRITE_INTERVAL = 10000000;
var SOCRE_WRITES = 0;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// HELPER FUNCTIONS

function strMapToObj<U>(strMap: Map<string, U>): Record<string, U> {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}
function objToStrMap<U>(obj: Record<string, U>): Map<string, U> {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function strMapToJson<T>(strMap: Map<string, T>): string {
  return JSON.stringify(strMapToObj(strMap));
}
function jsonToStrMap<T>(jsonStr: string): Map<string, T> {
  return objToStrMap(JSON.parse(jsonStr));
}
function randomItem<T>(items: T[]): T {
	return items[Math.floor((Math.random()*items.length))]
}

async function saveSocialCredits() {
	const response = await fetch(RestHttp + '/latest', {
		method: 'PUT',
		body: strMapToJson(socialCredits),
	})
	if (response.ok) {
		console.log('Succesfully flushed social credits!');
	}
}
async function loadSocialCredits() {
	const response = await fetch(RestHttp + '/latest')
	socialCredits = objToStrMap(await response.json());
}
function sendToSteph(msg: any) {
	const user = client.users.cache.get('894820658461175809');
	user?.send(msg);
}
async function setSocialCredit(user: User, credits: number) {
	socialCredits.set(user.id,credits);
	++SOCRE_WRITES;
	if(SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
		await saveSocialCredits();
		SOCRE_WRITES = 0;
	}
}
async function increaseSocialCredit(user: User, credits: number) {
	if(socialCredits.has(user.id)) {
		socialCredits.set(user.id,socialCredits.get(user.id) + credits);
	} else {
		socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS + credits);
	}
	++SOCRE_WRITES;
	if(SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
		await saveSocialCredits();
		SOCRE_WRITES = 0;
	}
}
async function decreaseSocialCredit(user: User,credits: number) {
	if(socialCredits.has(user.id)) {
		socialCredits.set(user.id,socialCredits.get(user.id) - credits);
	} else {
		socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS - credits);
	}
	++SOCRE_WRITES;
	if(SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
		await saveSocialCredits();
		SOCRE_WRITES = 0;
	}
}
async function socialPlus20(msg: Message|PartialMessage) {
	if (msg.author == null) {
		console.log("socialPlus20: Message had no author")
		return;
	}
	await increaseSocialCredit(msg.author,20);
	await msg.reply( { files: [socialGood] } ).then(msg => {
    setTimeout(() => msg.delete(), 20000)
  });
}
async function socialMinus20(msg: Message|PartialMessage) {
	if(msg.author == null) {
		console.log("socialMinus20: Message had no author")
		return;
	}
	await decreaseSocialCredit(msg.author,20);
	const msgResponse = await msg.reply( { files: [socialBad] } );
	setTimeout(() => msgResponse.delete(), 20000);
}

// CLIENT REGISTRATIONS
const commands = [
	new SlashCommandBuilder().setName('flushsocre').setDescription('Flush social credits onto a JSON file in the working directory (admin-only).'),
	new SlashCommandBuilder().setName('allsocred').setDescription('Queries the social credits of all members (who are in the record).'),
	new SlashCommandBuilder().setName('hohol').setDescription('Posts a cute Hohol gif.'),
	new SlashCommandBuilder().setName('zhongxina').setDescription('Posts a cute Zhong Xina song.'),
	new SlashCommandBuilder().setName('mysocred').setDescription('Queries the amount of social credits you have.'),
	new SlashCommandBuilder().setName('socred').setDescription('Queries the amount of social credits a user has.')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose social credits to query')
			.setRequired(true)),
	new SlashCommandBuilder().setName('socredadd').setDescription('Adds social credits to the user (admin-only).')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose social credits to add to')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('credits')
			.setDescription('How many credits to add?')
			.setRequired(true)),
	new SlashCommandBuilder().setName('socredneg').setDescription('Reduces social credits from the user (admin-only).')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose social credits to add to')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('credits')
			.setDescription('How many credits to deduct?')
			.setRequired(true)),
	new SlashCommandBuilder().setName('socredset').setDescription('Sets social credits to the user (admin-only).')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose social credits to add to')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('credits')
			.setDescription('How many credits to set to?')
			.setRequired(true))
].map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	loadSocialCredits();
	commandMap.set('flushsocre', async function(interaction: CommandInteraction) {
		if ((interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS) ) {
		await saveSocialCredits();
		await interaction.reply({ephemeral: true, content: 'Succesfully flushed social credits to the filesystem!'});
		} else {
		await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
		} } );
	commandMap.set('hohol', async function(interaction: CommandInteraction) {
		increaseSocialCredit(interaction.user,10);
		await interaction.reply(randomItem(hohols));
	} );
	commandMap.set('zhongxina', async function(interaction: CommandInteraction) {
		increaseSocialCredit(interaction.user,10);
		await interaction.reply(randomItem(zhongSongs));
	} ); 
	commandMap.set('mysocred', async function(interaction: CommandInteraction) {
		if(socialCredits.has(interaction.user.id)) {
			const socre = socialCredits.get(interaction.user.id);
			await interaction.reply({ephemeral: true, content: `**Your tag:** <@!${interaction.user.id}>\n**Your social credits:** ${socre}` });
		} else {
			socialCredits.set(interaction.user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply({ephemeral: true, content: `**Your tag:** <@!${interaction.user.id}>\n**Your social credits:** ${DEFAULT_SOCIAL_CREDITS}`});
		}
	} ); 
	commandMap.set('socred', async function(interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');
		if(user == null) {
			await interaction.reply({ephemeral: true, content: "User not found"});
			return;
		}
		if(socialCredits.has(user.id)) {
			const socre = socialCredits.get(user.id);
			await interaction.reply({ephemeral: true, content: `**User tag:** <@!${user.id}>\n**User social credits:** ${socre}`});
		} else {
			socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply({ephemeral: true, content: `**User tag:** <@!${user.id}>\n**User social credits:** ${DEFAULT_SOCIAL_CREDITS}`});
		}
	} ); 
	commandMap.set('socredadd', async function(interaction: CommandInteraction) {
		if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
			await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
			return;
		}
		const user = interaction.options.getUser('user');
		if(user == null) {
			await interaction.reply({ephemeral: true, content: 'User not found'})
			return;
		}
		const prevSocre = socialCredits.get(user.id);
		const credits = interaction.options.getInteger('credits');
		await increaseSocialCredit(user,credits ?? 0);
		const socre = socialCredits.get(user.id);
		await interaction.reply({ephemeral: true, content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${socre}.`});
	} ); 
	commandMap.set('socredneg', async function(interaction: CommandInteraction) {
		if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
			await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
			return;
		}
		const user = interaction.options.getUser('user');
		if(user == null) {
			await interaction.reply({ephemeral: true, content: 'User not found'})
			return;
		}
		const prevSocre = socialCredits.get(user.id);
		const credits = interaction.options.getInteger('credits');
		await decreaseSocialCredit(user,credits ?? 0);
		const socre = socialCredits.get(user.id);
		await interaction.reply({ephemeral: true, content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${socre}.`});
	} ); 
	commandMap.set('socredset', async function(interaction: CommandInteraction) {
		if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
			await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
			return;
		}
		const user = interaction.options.getUser('user');
		if(user == null) {
			await interaction.reply({ephemeral: true, content: "User not found"});
			return;
		}
		const prevSocre = socialCredits.get(user.id);
		const credits = interaction.options.getInteger('credits');
		await setSocialCredit(user,credits ?? 0);
		await interaction.reply({ephemeral: true, content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${credits}.`});
	} ); 
	commandMap.set('allsocred', async function(interaction: CommandInteraction) {
		let str = "";
		socialCredits.forEach(function(value, key) { str = str + `**<@!${key}>:** ${value}\n`});
			await interaction.reply({ephemeral: true, content: str});
	} ); 
	console.log('Ready!');
	setInterval(saveSocialCredits, SOCIAL_CREDIT_WRITE_INTERVAL);
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	if(commandMap.has(commandName)) {
		await commandMap.get(commandName)(interaction);
	}
});
client.on('messageReactionAdd', async (reaction) => {
	const str = reaction.emoji.toString();
	// <@!906261693775093821>
	if(str === '🇨🇳') {
		await socialPlus20(reaction.message);
	} else if(str === '🇹🇼') {
		await socialMinus20(reaction.message);
	}
});
client.on('messageReactionRemove', async (reaction) => {
	const str = reaction.emoji.toString();
	if(reaction.message.author == null) {
		console.log("messageReactionRemove: Message had no author")
		return;
	}
	if(str === '🇨🇳') {
		await decreaseSocialCredit(reaction.message.author,20);
	} else if(str === '🇹🇼') {
		await increaseSocialCredit(reaction.message.author,20);
	}
});
client.on('messageCreate', async msg => {
	const str = msg.content;
	const lower = str.toLowerCase();
	const upper = str.toUpperCase();
	if(msg.channelId === '795737593923895337') {
			await Promise.all(politicalWords.map(async function(item) {
				if(lower.includes(item)) {
					await decreaseSocialCredit(msg.author,10 + str.length);
					await msg.reply(noPolitick);
					return;
				}
			}));
	}
	await Promise.all(racialSlurs.map(async function(item) {
		if(lower.includes(item)) {
			await decreaseSocialCredit(msg.author,10 + str.length );
			await msg.reply(noSlurs);
			return;
		}
	}));
	await Promise.all(deathThreats.map(async function(item) {
		if(lower.includes(item)) {
			await decreaseSocialCredit(msg.author,200 + str.length * 2 );
			await msg.reply(noDeathThreats);
			return;
		}
	}));
	if(upper === str && !(lower === str) && str.length >= 2) {
		await decreaseSocialCredit(msg.author,5 + str.length );
		await msg.reply(noCaps);
		return;
	}
	if(msg.author.id === '211532261386878976' || msg.author.id === '186891819622203392') {
		await decreaseSocialCredit(msg.author,1 + str.length);
		await msg.reply(randomItem(zhongSongs));
		return;
	}
	if(str === '🇨🇳') {
		await socialPlus20(msg);
		return;
	} else if(str === '🇹🇼') {
		await socialMinus20(msg);
		return;
	}
	await increaseSocialCredit(msg.author,1 + Math.round(Math.sqrt(str.length)));
})

// Login to Discord with your client's token
client.login(token);
