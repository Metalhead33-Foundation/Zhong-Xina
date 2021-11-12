import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const hohols = [
    'https://www.youtube.com/watch?v=w0eq30gJV2U', 'https://tenor.com/view/hohol-ukrainian-dance-pigs-gif-20883345',
    'https://tenor.com/view/rei-ayanami-ukraine-hohol-evangelion-gif-22605880',
    'https://tenor.com/view/%D1%81%D0%BB%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BB%D0%B4-%D0%B6%D0%BE%D0%B6%D0%BE-%D1%84%D0%BB%D0%B5%D0%BA%D1%81-%D0%BC%D1%83%D1%85%D0%B0%D0%BC%D0%BC%D0%B5%D0%B4-%D0%BA%D1%83%D0%B4%D0%B6%D0%BE-gif-16553377', 'https://tenor.com/view/%D1%85%D0%BE%D1%85%D0%BB%D0%B0-%D0%B7%D0%B0%D0%B1%D1%8B%D0%BB%D0%B8-moonphobia-gif-20381443', 'https://tenor.com/view/hohol-gif-20486476', 'https://tenor.com/view/ukraine-ukrainian-animation-scared-scary-aaaah-gif-12499590', 'https://tenor.com/view/azerbaycan-ukrayna-flag-bayra%C4%9F-%D0%B0%D0%B7%D0%B5%D1%80%D0%B1%D0%B0%D0%B9%D0%B4%D0%B6%D0%B0%D0%BD-gif-18215874', 'https://tenor.com/view/ukraine-flag-ukraine-flag-flag-ukraine-ukraine-map-gif-14339705', 'https://tenor.com/view/pig-piggy-hohol-hohlinka-cute-gif-20598787', 
	'https://tenor.com/view/hohol-gif-23566318', 
	'https://tenor.com/view/nikocado-avocado-mental-breakdown-mukbang-rage-angry-food-eating-gif-17940312',
	'https://tenor.com/view/laughing-pig-grin-beam-smile-gif-16353172',
	'https://tenor.com/view/sexy-wierd-look-thong-pigthong-gif-15348136',
	'https://tenor.com/view/love-you-pig-kiss-fat-pig-im-hungry-gif-17924060',
	'https://tenor.com/view/pig-pig-police-police-gif-17885777',
	'https://tenor.com/view/happy-pig-guinea-fat-happy-pig-gif-13665272',
	'https://tenor.com/view/pig-bath-pig-happy-pig-oink-pigskin-gif-22556001',
	'https://tenor.com/view/pig-piggy-babypig-gif-22266862',
	'https://tenor.com/view/curious-pig-piglet-piggy-blinking-gif-22486284',
	'https://tenor.com/view/pig-cute-gif-21946909',
	'https://tenor.com/view/cute-pig-piglet-pink-fluffy-gif-7300613',
	'https://tenor.com/view/piglet-cute-farm-pig-oink-shucks-gif-17092529'
];
const COMMAND = {
	data: new SlashCommandBuilder().setName('hohol').setDescription('Posts a cute Hohol gif.'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
			await interaction.reply(GuildFunctions.randomItem(hohols));
		}
    },
};
export { COMMAND };