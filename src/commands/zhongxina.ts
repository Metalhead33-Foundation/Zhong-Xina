import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const zhongSongs = [
    'https://www.youtube.com/watch?v=QiqmbbrNW6k',
    'https://www.youtube.com/watch?v=LB1P8IAiDwk',
    'https://www.youtube.com/watch?v=10cPXoKjRKI',
    'https://www.youtube.com/watch?v=EzApQy2DcSg',
    'https://www.youtube.com/watch?v=nOG76Pszuog',
    'https://www.youtube.com/watch?v=_KOJJ5IoEvo',
    'https://www.youtube.com/watch?v=v8nQIFKrKXA',
];
const COMMAND = {
	data: new SlashCommandBuilder().setName('zhongxina').setDescription('Posts a cute Zhong Xina song.'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
        	GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
        	await interaction.reply(GuildFunctions.randomItem(zhongSongs));
		}
    }
};
export { COMMAND, zhongSongs };