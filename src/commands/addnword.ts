import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('addnword').setDescription('Adds a word to the list of forbidden racial slurs. (admin-only).')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('The word to add to the list of political words')
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
			await GuildFunctions.addRacialSlur(word, interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added the word ${word} to the list of racial slurs.`
			});
		}
    }
};
export { COMMAND };