var logger = require('winston');
const { token, guildId, clientId } = require('./auth.json');
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const socialGood = 'https://i.imgur.com/PtGG2kM.png';
const socialBad = 'https://i.imgur.com/QhxWTbd.png';
const zhongSongs = [ 'https://www.youtube.com/watch?v=QiqmbbrNW6k',
					'https://www.youtube.com/watch?v=LB1P8IAiDwk',
					'https://www.youtube.com/watch?v=10cPXoKjRKI',
					'https://www.youtube.com/watch?v=EzApQy2DcSg' ];
const hoholSong = 'https://www.youtube.com/watch?v=w0eq30gJV2U';
const inchenHanchi = 'https://youtu.be/3J6m2xwqLnY';
const noCaps = 'Whoa, easy with the all-caps bro!';
const noSlurs = 'Please don\' use racial slurs. They\'re harmful to the server\'s existence.';
const noPolitick = 'Getting awfully political for <#795737593923895337>! Mind taking it to <#795737668654071818>?';
let politicalWords = [ 'jews', 'joos', 'jooz', 'jude', 'jewish', 'kike', 'skype' ]; 
let racialSlurs = [ 'nigger', 'knee-grow', 'nignog', 'nig-nog' ];
var socialCredits = new Map();
const DEFAULT_SOCIAL_CREDITS = 1000;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// HELPER FUNCTIONS

function sendToSteph(msg) {
	const user = client.users.cache.get('894820658461175809');
	user.send(msg);
}
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
function increaseSocialCredit(user,credits) {
	if(socialCredits.has(user.id)) {
			socialCredits.set(user.id,socialCredits.get(user.id) + credits);
		} else {
			socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS + credits);
		}
}
function decreaseSocialCredit(user,credits) {
	if(socialCredits.has(user.id)) {
			socialCredits.set(user.id,socialCredits.get(user.id) - credits);
		} else {
			socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS - credits);
		}
}
function socialPlus20(msg) {
	const author = msg.author.id;
	increaseSocialCredit(msg.author,20);
	msg.reply( { /*content: '<@!' + author + '> has ' + socialCredits.get(author) + ' social credits.',*/ files: [socialGood] } );
}
function socialMinus20(msg) {
	const author = msg.author.id;
	decreaseSocialCredit(msg.author,20);
	msg.reply( { /*content: '<@!' + author + '> has ' + socialCredits.get(author) + ' social credits.',*/ files: [socialBad] } );
}

// CLIENT REGISTRATIONS
const commands = [
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
	console.log('Ready!');
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'mysocred') {
		if(socialCredits.has(interaction.user.id)) {
			const socre = socialCredits.get(interaction.user.id);
			await interaction.reply(`Your tag: ${interaction.user.tag}\nYour social credits: ${socre}`);
		} else {
			socialCredits.set(interaction.user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply(`Your tag: ${interaction.user.tag}\nYour social credits: ${DEFAULT_SOCIAL_CREDITS}`);
		}
	} else if (commandName === 'socred') {
		const user = interaction.options.getUser('user');
		if(socialCredits.has(user.id)) {
			const socre = socialCredits.get(user.id);
			await interaction.reply(`User tag: ${user.tag}\nUser social credits: ${socre}`);
		} else {
			socialCredits.set(user.id,DEFAULT_SOCIAL_CREDITS);
			await interaction.reply(`User tag: ${user.tag}\nUser social credits: ${DEFAULT_SOCIAL_CREDITS}`);
		}
	}
});
client.on('messageReactionAdd', (reaction, user) => {
	const str = reaction.emoji.toString();
	const author = reaction.message.author.id;
	// <@!906261693775093821>
	if(str === '🇨🇳') {
		socialPlus20(reaction.message);
	} else if(str === '🇹🇼') {
		socialMinus20(reaction.message);
	}
});
client.on('messageCreate', msg => {
	const str = msg.content;
	const lower = str.toLowerCase();
	const upper = str.toUpperCase();
	if(msg.channelId === '795737593923895337') {
			politicalWords.forEach(function(item, index, array) {
				if(lower.includes(item)) {
					decreaseSocialCredit(msg.author,10);
					msg.reply(noPolitick);
					return;
				}
			});
	}
	racialSlurs.forEach(function(item, index, array) {
		if(lower.includes(item)) {
			decreaseSocialCredit(msg.author,10);
			msg.reply(noSlurs);
			return;
		}
	});
	if(upper === str && str.length >= 2) {
		decreaseSocialCredit(msg.author,5);
		msg.reply(noCaps);
		return;
	}
	if(lower === 'hohol') {
		increaseSocialCredit(msg.author,15);
		msg.reply(hoholSong);
		return;
	}
	if(msg.author.id === '211532261386878976') {
		decreaseSocialCredit(msg.author,1 + str.length);
		msg.reply(zhongSongs.random());
		return;
	}
	if(str === '🇨🇳') {
		socialPlus20(msg);
		return;
	} else if(str === '🇹🇼') {
		socialMinus20(msg);
		return;
	}
	increaseSocialCredit(msg.author,1 + Math.round(Math.sqrt(str.length)));
})

// Login to Discord with your client's token
client.login(token);
