import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('threatwords').setDescription('Queries the forbidden death threats. (admin-only).'),
	async execute(interaction: CommandInteraction) {
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
    }
};
export { COMMAND };