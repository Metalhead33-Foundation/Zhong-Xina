import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('remapolchan').setDescription('Undesignates a channel as strictly apolitical. (admin-only)')
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('The undesignated apolitical channel.')
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
				await GuildFunctions.removeApoliticalChannel(interaction.guild, channel);
			}
		}
	}
};
export { COMMAND };