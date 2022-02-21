import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('socredset').setDescription('Sets social credits to the user (admin-only).')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user whose social credits to add to')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('credits')
            .setDescription('How many credits to set to?')
            .setRequired(true)),
	async execute(interaction: CommandInteraction) {
        if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.BAN_MEMBERS)) {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
            return;
        }
		if(interaction.guild) {
			const user = interaction.options.getUser('user');
			if (user == null) {
				await interaction.reply({ephemeral: true, content: "User not found"});
				return;
			}
			const prevSocre = GuildFunctions.getSocialCredits(user,interaction.guild);
			const credits = interaction.options.getInteger('credits');
			await GuildFunctions.setSocialCredit(user, interaction.guild, credits ?? 0);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully set <@!${user.id}>'s social credits from ${prevSocre} to ${credits}.`
			});
		}
    }
};
export { COMMAND };