import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('eiko').setDescription('Posts a cute Tsuki Eiko picture.'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
			await interaction.reply(await GuildFunctions.getEiko(interaction.guild));
		}
    },
};
export { COMMAND };
