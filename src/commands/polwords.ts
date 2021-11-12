import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('polwords').setDescription('Queries the political words. (admin-only).'),
	async execute(interaction: CommandInteraction) {
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
    }
};
export { COMMAND };