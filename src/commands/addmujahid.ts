import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('addmujahid').setDescription('Designates a member as mujahid (admin-only).')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The userto designate')
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
			await GuildFunctions.addTrolledMember(user,interaction.guild);
			await interaction.reply({
				ephemeral: true,
				content: `Succesfully added <@!${user.id}> to the list of Evil Mujahideen.`
			});
		}
    }
};
export { COMMAND };