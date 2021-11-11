import { token, guildId, clientId, RestHttp } from './constants'
import * as GuildFunctions from './guild'
import { Client, CommandInteraction, Intents, Message, PartialMessage, Permissions, User, Guild, Channel, GuildChannel, ThreadChannel } from 'discord.js';
import { SlashCommandBuilder} from '@discordjs/builders';
import { REST} from '@discordjs/rest';
import { Routes} from 'discord-api-types/v9';

const zhongSongs = [
    'https://www.youtube.com/watch?v=QiqmbbrNW6k',
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

function randomItem<T>(items: T[]): T {
    return items[Math.floor((Math.random() * items.length))]
}
const commandMap = new Map<string, (interaction: CommandInteraction) => Promise<void>>();

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
                .setRequired(true)),
	new SlashCommandBuilder().setName('setpolchan').setDescription('Sets the designated political channel. (admin-only)')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The designated political channel.')
				.setRequired(true)),
	new SlashCommandBuilder().setName('apolchans').setDescription('Queries channels designated as political.'),
	new SlashCommandBuilder().setName('addapolchan').setDescription('Designates a channel as strictly apolitical. (admin-only)')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The designated apolitical channel.')
				.setRequired(true)),
	new SlashCommandBuilder().setName('remapolchan').setDescription('Undesignates a channel as strictly apolitical. (admin-only)')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The undesignated apolitical channel.')
				.setRequired(true)),
    new SlashCommandBuilder().setName('polwords').setDescription('Queries the political words. (admin-only).'),
    new SlashCommandBuilder().setName('addpolword').setDescription('Adds a word to the political words. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to add to the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('rempolword').setDescription('Removes a word from the political words. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to remove from the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('nwords').setDescription('Queries the forbidden racial slurs. (admin-only).'),
    new SlashCommandBuilder().setName('addnword').setDescription('Adds a word to the list of forbidden racial slurs. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to add to the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('remnword').setDescription('Removes a word from the list of forbidden racial slurs. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to remove from the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('threatwords').setDescription('Queries the forbidden death threats. (admin-only).'),
    new SlashCommandBuilder().setName('addthreatword').setDescription('Adds a word to the list of forbidden death threats. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to add to the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('remthreatword').setDescription('Removes a word from the list of forbidden death threats. (admin-only).')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to remove from the list of political words')
				.setRequired(true)),
    new SlashCommandBuilder().setName('mujahideen').setDescription('Queries members designated as mujahideen.'),
    new SlashCommandBuilder().setName('addmujahid').setDescription('Designates a member as mujahid (admin-only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The userto designate')
                .setRequired(true)),
    new SlashCommandBuilder().setName('remmujahid').setDescription('Undesignates a member as mujahid (admin-only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The userto undesignate')
                .setRequired(true))
].map(command => command.toJSON());
const rest = new REST({version: '9'}).setToken(token);

function registerCommands() : void {
rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}
function createCommandSet() : void {
    GuildFunctions.loadSocialCredits();
    commandMap.set('flushsocre', async function (interaction: CommandInteraction) {
        if ((interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await GuildFunctions.saveSocialCredits();
            await interaction.reply({
                ephemeral: true,
                content: 'Succesfully flushed social credits to the filesystem!'
            });
        } else {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
        }
    });
    commandMap.set('hohol', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
			await interaction.reply(randomItem(hohols));
		}
    });
    commandMap.set('zhongxina', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
        	GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
        	await interaction.reply(randomItem(zhongSongs));
		}
    });
    commandMap.set('mysocred', async function (interaction: CommandInteraction) {
		if(!interaction.guild) return;
        const socre = GuildFunctions.getSocialCredits(interaction.user,interaction.guild);
        await interaction.reply({
                ephemeral: true,
                content: `**Your tag:** <@!${interaction.user.id}>\n**Your social credits:** ${socre}`
        });
    });
    commandMap.set('socred', async function (interaction: CommandInteraction) {
		if(!interaction.guild) return;
        const user = interaction.options.getUser('user');
        if (user == null) {
            await interaction.reply({ephemeral: true, content: "User not found"});
            return;
        }
        const socre = GuildFunctions.getSocialCredits(user,interaction.guild);
        await interaction.reply({
                ephemeral: true,
                content: `**User tag:** <@!${user.id}>\n**User social credits:** ${socre}`
        });
    });
    commandMap.set('socredadd', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: 'User not found'})
				return;
			}
			const prevSocre = GuildFunctions.getSocialCredits(user,interaction.guild);
			const credits = interaction.options.getInteger('credits');
			await GuildFunctions.increaseSocialCredit(user, interaction.guild, credits ?? 0);
			const socre = GuildFunctions.getSocialCredits(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${socre}.`
			});
		}
    });
    commandMap.set('socredneg', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: 'User not found'})
				return;
			}
			const prevSocre = GuildFunctions.getSocialCredits(user,interaction.guild);
			const credits = interaction.options.getInteger('credits');
			await GuildFunctions.decreaseSocialCredit(user, interaction.guild, credits ?? 0);
			const socre = GuildFunctions.getSocialCredits(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${socre}.`
			});
		}
    });
    commandMap.set('socredset', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: "User not found"});
				return;
			}
			const prevSocre = GuildFunctions.getSocialCredits(user,interaction.guild);
			const credits = interaction.options.getInteger('credits');
			await GuildFunctions.setSocialCredit(user, interaction.guild, credits ?? 0);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${credits}.`
			});
		}
    });
    commandMap.set('allsocred', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			let str = "";
			(await GuildFunctions.getAllSocialCredits(interaction.guild)).forEach(function (value, key) {
				str = str + `**<@!${key}>:** ${value}\n`
			});
            await interaction.reply({ephemeral: true, content: str});
		}
    });
	commandMap.set('setpolchan', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
				await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
				return;
			} else {
				const channel = interaction.options.getChannel('channel');
				if (channel == null) {
					await interaction.reply({ephemeral: true, content: "Channel not found"});
					return;
				}
				await GuildFunctions.setPoliticalChannel(interaction.guild, channel);
			}
		}
	});
	commandMap.set('apolchans', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			const channels = await GuildFunctions.getApoliticalChannels(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No channels designted as apolitical.'});
			} else {
				const str = "**Designated Apolitical Channels:** <#" + channels.join(">, <#") + ">";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
	});
	commandMap.set('addapolchan', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
				await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
				return;
			} else {
				const channel = interaction.options.getChannel('channel');
				if (channel == null) {
					await interaction.reply({ephemeral: true, content: "Channel not found"});
					return;
				}
				await GuildFunctions.addApoliticalChannel(interaction.guild, channel);
			}
		}
	});
	commandMap.set('addpolword', async function (interaction: CommandInteraction) {
		if(interaction.guild) {
			if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
				await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
				return;
			} else {
				const channel = interaction.options.getChannel('channel');
				if (channel == null) {
					await interaction.reply({ephemeral: true, content: "Channel not found"});
					return;
				}
				await GuildFunctions.removeApoliticalChannel(interaction.guild, channel);
			}
		}
	});
    commandMap.set('polwords', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const channels = await GuildFunctions.getPoliticalWords(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No forbidden political words.'});
			} else {
				const str = "**Forbidden Political Words:** \"" + channels.join("\", \"") + "\"";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
    });
    commandMap.set('addpolword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.addPoliticalWord(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added the word ${word} to the list of political words.`
			});
		}
    });
    commandMap.set('rempolword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.removePoliticalWord(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed the word ${word} from the list of political words.`
			});
		}
    });
    commandMap.set('nwords', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const channels = await GuildFunctions.getRacialSlurs(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No forbidden racial slurs.'});
			} else {
				const str = "**Forbidden Racial Slurs:** \"" + channels.join("\", \"") + "\"";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
    });
    commandMap.set('addnword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.addRacialSlur(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added the word ${word} to the list of racial slurs.`
			});
		}
    });
    commandMap.set('remnword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.removeRacialSlur(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed the word ${word} from the list of racial slurs.`
			});
		}
    });
    commandMap.set('threatwords', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const channels = await GuildFunctions.getRacialSlurs(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No forbidden threatening slurs.'});
			} else {
				const str = "**Forbidden Racial Slurs:** \"" + channels.join("\", \"") + "\"";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
    });
    commandMap.set('addthreatword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.addDeathThreat(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added the word ${word} to the list of threatening slurs.`
			});
		}
    });
    commandMap.set('remthreatword', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const word = interaction.options.getString('word');
			if (word == null) {
				return;
			}
			await GuildFunctions.removeDeathThreat(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed the word ${word} from the list of threatening slurs.`
			});
		}
    });
    commandMap.set('mujahideen', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const channels = await GuildFunctions.getTrolledMembers(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No evil mujahideen on this server'});
			} else {
				const str = "**Evil Mujahideen:** <@!" + channels.join(">, <@!") + ">";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
    });
    commandMap.set('addmujahid', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: "User not found"});
				return;
			}
			await GuildFunctions.addTrolledMember(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added <@!${user.id}> to the list of Evil Mujahideen.`
			});
		}
    });
    commandMap.set('remmujahid', async function (interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: "User not found"});
				return;
			}
			await GuildFunctions.removeTrolledMember(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed <@!${user.id}> from the list of Evil Mujahideen.`
			});
		}
    });
}
function passCommands() : void {
    console.log("Creating command set!");
    createCommandSet();
    console.log("Created command set!");
    console.log("Registering commands!");
    registerCommands();    
}
export { randomItem, passCommands, commandMap, zhongSongs }