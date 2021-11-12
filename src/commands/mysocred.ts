import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('mysocred').setDescription('Queries the amount of social credits you have.'),
	async execute(interaction: CommandInteraction): Promise<void> {
		if(!interaction.guild) return;
        const socre = GuildFunctions.getSocialCredits(interaction.user,interaction.guild);
        await interaction.reply({
                ephemeral: true,
                content: `**Your tag:** <@!${interaction.user.id}>\n**Your social credits:** ${socre}`
        });
    },
};
export { COMMAND };