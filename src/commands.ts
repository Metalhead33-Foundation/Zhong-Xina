import { token, guildId, clientId } from './constants'
import { CommandInteraction } from 'discord.js';
import { REST} from '@discordjs/rest';
import { Routes} from 'discord-api-types/v9';

import * as hohol from './commands/hohol';
import * as zhongxina from './commands/zhongxina';
import * as threatwords from './commands/threatwords';
import * as socredset from './commands/socredset';
import * as socredneg from './commands/socredneg';
import * as socredadd from './commands/socredadd';
import * as socred from './commands/socred';
import * as setpolchan from './commands/setpolchan';
import * as remthreatword from './commands/remthreatword';
import * as rempolword from './commands/rempolword';
import * as remnword from './commands/remnword';
import * as remmujahid from './commands/remmujahid';
import * as remapolchan from './commands/remapolchan';
import * as polwords from './commands/polwords';
import * as nwords from './commands/nwords';
import * as mysocred from './commands/mysocred';
import * as mujahideen from './commands/mujahideen';
import * as flushsocre from './commands/flushsocre';
import * as apolchans from './commands/apolchans';
import * as allsocred from './commands/allsocred';
import * as addthreatword from './commands/addthreatword';
import * as addpolword from './commands/addpolword';
import * as addnword from './commands/addnword';
import * as addmujahid from './commands/addmujahid';
import * as addapolchan from './commands/addapolchan';
import * as tifa from './commands/tifa';

const commandMap = new Map<string, (interaction: CommandInteraction) => Promise<void>>();

async function registerCommands() : Promise<void> {
	commandMap.set(hohol.COMMAND.data.name,hohol.COMMAND.execute);
	commandMap.set(zhongxina.COMMAND.data.name,zhongxina.COMMAND.execute);
	commandMap.set(threatwords.COMMAND.data.name,threatwords.COMMAND.execute);
	commandMap.set(socredset.COMMAND.data.name,socredset.COMMAND.execute);
	commandMap.set(socredneg.COMMAND.data.name,socredneg.COMMAND.execute);
	commandMap.set(socredadd.COMMAND.data.name,socredadd.COMMAND.execute);
	commandMap.set(socred.COMMAND.data.name,socred.COMMAND.execute);
	commandMap.set(setpolchan.COMMAND.data.name,setpolchan.COMMAND.execute);
	commandMap.set(remthreatword.COMMAND.data.name,remthreatword.COMMAND.execute);
	commandMap.set(rempolword.COMMAND.data.name,rempolword.COMMAND.execute);
	commandMap.set(remnword.COMMAND.data.name,remnword.COMMAND.execute);
	commandMap.set(remmujahid.COMMAND.data.name,remmujahid.COMMAND.execute);
	commandMap.set(remapolchan.COMMAND.data.name,remapolchan.COMMAND.execute);
	commandMap.set(polwords.COMMAND.data.name,polwords.COMMAND.execute);
	commandMap.set(nwords.COMMAND.data.name,nwords.COMMAND.execute);
	commandMap.set(mysocred.COMMAND.data.name,mysocred.COMMAND.execute);
	commandMap.set(mujahideen.COMMAND.data.name,mujahideen.COMMAND.execute);
	commandMap.set(flushsocre.COMMAND.data.name,flushsocre.COMMAND.execute);
	commandMap.set(apolchans.COMMAND.data.name,apolchans.COMMAND.execute);
	commandMap.set(allsocred.COMMAND.data.name,allsocred.COMMAND.execute);
	commandMap.set(addthreatword.COMMAND.data.name,addthreatword.COMMAND.execute);
	commandMap.set(addpolword.COMMAND.data.name,addpolword.COMMAND.execute);
	commandMap.set(addnword.COMMAND.data.name,addnword.COMMAND.execute);
	commandMap.set(addmujahid.COMMAND.data.name,addmujahid.COMMAND.execute);
	commandMap.set(addapolchan.COMMAND.data.name,addapolchan.COMMAND.execute);
	commandMap.set(tifa.COMMAND.data.name,tifa.COMMAND.execute);
    const commands = [ hohol.COMMAND.data,
		zhongxina.COMMAND.data,
		threatwords.COMMAND.data,
		socredset.COMMAND.data,
		socredneg.COMMAND.data,
		socredadd.COMMAND.data,
		socred.COMMAND.data,
		setpolchan.COMMAND.data,
		remthreatword.COMMAND.data,
		rempolword.COMMAND.data,
		remnword.COMMAND.data,
		remmujahid.COMMAND.data,
		remapolchan.COMMAND.data,
		polwords.COMMAND.data,
		nwords.COMMAND.data,
		mysocred.COMMAND.data,
		mujahideen.COMMAND.data,
		flushsocre.COMMAND.data,
		apolchans.COMMAND.data,
		allsocred.COMMAND.data,
		addthreatword.COMMAND.data,
		addpolword.COMMAND.data,
		addnword.COMMAND.data,
		addmujahid.COMMAND.data,
		addapolchan.COMMAND.data,
		tifa.COMMAND.data].map(command => command.toJSON());
		const rest = new REST({version: '9'}).setToken(token);
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);		
}
function passCommands() : void {
    console.log("Creating command set!");
    registerCommands();
    console.log("Created command set!");
}
export { passCommands, commandMap }
