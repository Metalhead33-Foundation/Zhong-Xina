import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('apolchans').setDescription('Queries channels designated as political.'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			const channels = await GuildFunctions.getApoliticalChannels(interaction.guild);
			if(channels.length <= 0) {
				await interaction.reply({ephemeral: true, content: 'No channels designted as apolitical.'});
			} else {
				const str = "**Designated Apolitical Channels:** <#" + channels.join(">, <#") + ">";
				await interaction.reply({ephemeral: true, content: str});
			}
		}
	}
};
export { COMMAND };