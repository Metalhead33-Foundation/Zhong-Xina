import { SlashCommandBuilder} from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import * as GuildFunctions from '../guild';
const COMMAND = {
	data: new SlashCommandBuilder().setName('allsocred').setDescription('Queries the social credits of all members (who are in the record).'),
	async execute(interaction: CommandInteraction) {
		if(interaction.guild) {
			let str = "";
			(await GuildFunctions.getAllSocialCredits(interaction.guild)).forEach(function (value, key) {
				str = str + `**<@!${key}>:** ${value}\n`
			});
            await interaction.reply({ephemeral: true, content: str});
		}
    }
};
export { COMMAND };