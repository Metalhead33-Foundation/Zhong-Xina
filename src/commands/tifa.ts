import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('tifa').setDescription('Posts a cute Tifa picture.'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			GuildFunctions.increaseSocialCredit(interaction.user, interaction.guild, 10);
			await interaction.reply(GuildFunctions.randomItem(await GuildFunctions.getTifas(interaction.guild)));
		}
    },
};
export { COMMAND };
