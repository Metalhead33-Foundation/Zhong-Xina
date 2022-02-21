import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('remthreatword').setDescription('Removes a word from the list of forbidden death threats. (admin-only).')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('The word to remove from the list of political words')
            .setRequired(true)),
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
			await GuildFunctions.removeDeathThreat(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed the word ${word} from the list of threatening slurs.`
			});
		}
    }
};
export { COMMAND };