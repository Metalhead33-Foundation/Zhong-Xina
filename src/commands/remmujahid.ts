import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('remmujahid').setDescription('Undesignates a member as mujahid (admin-only).')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The userto undesignate')
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
			await GuildFunctions.removeTrolledMember(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully removed <@!${user.id}> from the list of Evil Mujahideen.`
			});
		}
    }
};
export { COMMAND };