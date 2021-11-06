var logger = require('winston');
const { token } = require('./auth.json');
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

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
			socialCredits.set(user.id,credits);
		}
}
function decreaseSocialCredit(user,credits) {
	if(socialCredits.has(user.id)) {
			socialCredits.set(user.id,socialCredits.get(user.id) - credits);
		} else {
			socialCredits.set(user.id,0);
		}
}

/*const data = new SlashCommandBuilder()
	.setName('socred')
	.setDescription('Queries user socail credits!')
	.addStringOption(option =>
		option.setName('user')
			.setDescription('The user to query social credits of.')
			.setRequired(true));*/

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
client.on('messageReactionAdd', (reaction, user) => {
	const str = reaction.emoji.toString();
	const author = reaction.message.author.id;
	// <@!906261693775093821>
	if(str === '🇨🇳') {
		increaseSocialCredit(reaction.message.author,20);
		reaction.message.reply( { content: '<@!' + author + '> has ' + socialCredits.get(author) + ' social credits.', files: [socialGood] } );
	} else if(str === '🇹🇼') {
		decreaseSocialCredit(reaction.message.author,20);
		reaction.message.reply( { content: '<@!' + author + '> has ' + socialCredits.get(author) + ' social credits.', files: [socialBad] } );
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
		decreaseSocialCredit(msg.author,1);
		msg.reply(zhongSongs.random());
		return;
	}
	increaseSocialCredit(msg.author,1);
})

// Login to Discord with your client's token
client.login(token);
