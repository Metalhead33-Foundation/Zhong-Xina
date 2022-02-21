import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('setpolchan').setDescription('Sets the designated political channel. (admin-only)')
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('The designated political channel.')
            .setRequired(true)),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			if (!(interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
				await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
				return;
			} else {
				const channel = interaction.options.getChannel('channel');
				if (channel == null) {
					await interaction.reply({ephemeral: true, content: "Channel not found"});
					return;
				}
				await GuildFunctions.setPoliticalChannel(interaction.guild, channel);
			}
		}
	}
};
export { COMMAND };