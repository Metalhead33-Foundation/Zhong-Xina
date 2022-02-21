import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('socred').setDescription('Queries the amount of social credits a user has.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user whose social credits to query')
            .setRequired(true)),
	async execute(interaction: CommandInteraction) : Promise<void> {
		if(!interaction.guild) return;
        const user = interaction.options.getUser('user');
        if (user == null) {
            await interaction.reply({ephemeral: true, content: "User not found"});
            return;
        }
        const socre = GuildFunctions.getSocialCredits(user,interaction.guild);
        await interaction.reply({
                ephemeral: true,
                content: `**User tag:** <@!${user.id}>\n**User social credits:** ${socre}`
        });
    },
};
export { COMMAND };