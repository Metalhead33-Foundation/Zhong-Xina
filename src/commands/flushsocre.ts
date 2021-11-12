import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('flushsocre').setDescription('Flush social credits onto a JSON file in the working directory (admin-only).'),
	async execute(interaction: CommandInteraction) {
        if ((interaction.member.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR)) {
            await GuildFunctions.saveSocialCredits();
            await interaction.reply({
                ephemeral: true,
                content: 'Succesfully flushed social credits to the filesystem!'
            });
        } else {
            await interaction.reply({ephemeral: true, content: 'Admin-only command!'});
        }
    },
};
export { COMMAND };