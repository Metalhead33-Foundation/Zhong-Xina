var logger = require('winston');
const { XMLHttpRequest } = require('xmlhttprequest');
const { token, guildId, clientId, RestHttp } = require('./auth.json');
const { Client, Intents, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
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
const noSlurs = 'Please don\' use racial slurs. They\'re harmful to the server\'s existence.';
const noPolitick = 'Getting awfully political for <#795737593923895337>! Mind taking it to <#795737668654071818>?';
let politicalWords = [ 'nazi', 'communist', 'communism', 'racism', 'racist', 'transgender', 'commie', 'leftist', 'left-wing', 'right-wing', 'far-right', 'jew', 'joos', 'jooz', 'jude', 'jewish', 'kike', 'skype', 'judish', 'judisch', 'yiddish', 'żyd', 'jevrej', 'jevrei', 'yevrey', 'yevrei', 'long-nose tribe', 'holocaust' ]; 
let racialSlurs = [ 'nigger', 'knee-grow', 'nignog', 'nig-nog' ];
var socialCredits = new Map();
const DEFAULT_SOCIAL_CREDITS = 1000;
const SOCIAL_CREDIT_BATCH_WRITES = 250;
const SOCIAL_CREDIT_WRITE_INTERVAL = 10000000;
var SOCRE_WRITES = 0;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// HELPER FUNCTIONS

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
async function saveSocialCredits() {
	var request = new XMLHttpRequest();
    request.open('PUT', RestHttp, true);
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log('Succesfully flushed social credits!');
        }
    }
	await request.send(strMapToJson(socialCredits));
}
async function loadSocialCredits() {
	var request = new XMLHttpRequest();
    request.open('GET', RestHttp + '/latest', true);
    request.setRequestHeader("Accept", "application/json; charset=utf-8");
	request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            socialCredits = jsonToStrMap(request.responseText);
            console.log('Succesfully loaded social credits!');
        }
    }
    await request.send(null);
}
function sendToSteph(msg) {
	const user = client.users.cache.get('894820658461175809');
	user.send(msg);
}
async function increaseSocialCredit(user,credits) {
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
async function decreaseSocialCredit(user,credits) {
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
async function socialPlus20(msg) {
	const author = msg.author.id;
	await increaseSocialCredit(msg.author,20);
	await msg.reply( { files: [socialGood] } ).then(msg => {
    setTimeout(() => msg.delete(), 20000)
  });
}
async function socialMinus20(msg) {
	const author = msg.author.id;
	await decreaseSocialCredit(msg.author,20);
	await msg.reply( { files: [socialBad] } ).then(msg => {
    setTimeout(() => msg.delete(), 20000)
  });
}

// CLIENT REGISTRATIONS
const commands = [
	new SlashCommandBuilder().setName('flushsocre').setDescription('Flush social credits onto a JSON file in the working directory (admin-only).'),
	new SlashCommandBuilder().setName('hohol').setDescription('Posts a cute Hohol gif.'),
	new SlashCommandBuilder().setName('zhongxina').setDescription('Posts a cute Zhong Xina song.'),
	new SlashCommandBuilder().setName('mysocred').setDescription('Queries the amount of social credits you have.'),
	new SlashCommandBuilder().setName('socred').setDescription('Queries the amount of social credits a user has.')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose social credits to query')
			.setRequired(true))
].map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	loadSocialCredits();
	console.log('Ready!');
	setInterval(saveSocialCredits, SOCIAL_CREDIT_WRITE_INTERVAL);
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'flushsocre') {
		if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) ) {
		await saveSocialCredits();
		await interaction.reply({ephemeral: true, content: 'Succesfully flushed social credits to the filesystem!'});
		} else {
		await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
		}
	} else if (commandName === 'hohol') {
		increaseSocialCredit(interaction.user,10);
		await interaction.reply(hohols.random());
	} else if (commandName === 'zhongxina') {
		increaseSocialCredit(interaction.user,10);
		await interaction.reply(zhongSongs.random());
	} else if (commandName === 'mysocred') {
		if(socialCredits.has(interaction.user.id)) {
			const socre = socialCredits.get(interaction.user.id);
			await interaction.reply({ephemeral: true, content: `**Your tag:** ${interaction.user.tag}\n**Your social credits:** ${socre}` });
		} else {
			socialCredits.set(interaction.user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply({ephemeral: true, content: `**Your tag:** ${interaction.user.tag}\n**Your social credits:** ${DEFAULT_SOCIAL_CREDITS}`});
		}
	} else if (commandName === 'socred') {
		const user = interaction.options.getUser('user');
		if(socialCredits.has(user.id)) {
			const socre = socialCredits.get(user.id);
			await interaction.reply({ephemeral: true, content: `**User tag:** ${user.tag}\n**User social credits:** ${socre}`});
		} else {
			socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply({ephemeral: true, content: `**User tag:** ${user.tag}\n**User social credits:** ${DEFAULT_SOCIAL_CREDITS}`});
		}
	}
});
client.on('messageReactionAdd', async (reaction, user) => {
	const str = reaction.emoji.toString();
	// <@!906261693775093821>
	if(str === '🇨🇳') {
		await socialPlus20(reaction.message);
	} else if(str === '🇹🇼') {
		await socialMinus20(reaction.message);
	}
});
client.on('messageReactionRemove', async (reaction, user) => {
	const str = reaction.emoji.toString();
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
			politicalWords.forEach(async function(item, index, array) {
				if(lower.includes(item)) {
					await decreaseSocialCredit(msg.author,10 + str.length);
					await msg.reply(noPolitick);
					return;
				}
			});
	}
	racialSlurs.forEach(async function(item, index, array) {
		if(lower.includes(item)) {
			await decreaseSocialCredit(msg.author,10 + str.length );
			await msg.reply(noSlurs);
			return;
		}
	});
	if(upper === str && (( str.length >= 2 && str.includes(' ') ) || str.length >= 6) ) {
		await decreaseSocialCredit(msg.author,5 + str.length );
		await msg.reply(noCaps);
		return;
	}
	if(msg.author.id === '211532261386878976') {
		await decreaseSocialCredit(msg.author,1 + str.length);
		await msg.reply(zhongSongs.random());
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
