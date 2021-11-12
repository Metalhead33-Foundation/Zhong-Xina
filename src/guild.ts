import axios from 'axios';
import { User, Guild, GuildChannel, ThreadChannel } from 'discord.js';
import { APIInteractionDataResolvedChannel } from 'discord-api-types/v9';

const politicalWords = ['globohomo', 'globalist', 'nazi', 'communist', 'communism', 'racism', 'racist', 'transgender', 'commie', 'leftist', 'left-wing', 'right-wing', 'far-right', 'jew', 'joos', 'jooz', 'jude', 'jewish', 'kike', 'skype', 'judish', 'judisch', 'yiddish', 'żyd', 'jevrej', 'jevrei', 'yevrey', 'yevrei', 'long-nose tribe', 'holocaust'];
const racialSlurs = ['nigger', 'knee-grow', 'nignog', 'nig-nog'];
const deathThreats = ['ll kill you', 'll kill u'];
const apoliticalChannels = [ '795737593923895337', '795737793368293406', '795738035987021896', '866941147389231104', '795742577974444093' ];
const trolledMembers = [ '211532261386878976', '186891819622203392' ];
const DEFAULT_SOCIAL_CREDITS = 1000;
const SOCIAL_CREDIT_BATCH_WRITES = 250;
const SOCIAL_CREDIT_WRITE_INTERVAL = 10000000;
let socialCredits = new Map<string, number>();
let SOCRE_WRITES = 0;
import { RestHttp } from './constants'

export function randomItem<T>(items: T[]): T {
    return items[Math.floor((Math.random() * items.length))]
}
function strMapToObj<U>(strMap: Map<string, U>): Record<string, U> {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

function objToStrMap<U>(obj: Record<string, U>): Map<string, U> {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

export async function saveSocialCredits() : Promise<void> {
    const response = await axios.put(RestHttp + '/latest', strMapToObj(socialCredits))
    if (response.status == 200) {
        console.log('Succesfully flushed social credits!');
    }
}
export async function loadSocialCredits() : Promise<void> {
    const response = await axios.get(RestHttp + '/latest');
    socialCredits = objToStrMap(await response.data);
}
export async function setPoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	return;
}
export async function getPoliticalWords(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return politicalWords;
}
export async function addPoliticalWord(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function removePoliticalWord(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function getRacialSlurs(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - slur words will be per-guild after the SQL transition
	return racialSlurs;
}
export async function addRacialSlur(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function removeRacialSlur(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function getDeathThreats(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - thread words will be per-guild after the SQL transition
	return deathThreats;
}
export async function addDeathThreat(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function removeDeathThreat(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function getApoliticalChannels(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - apolitical channel IDs will be per-guild after the SQL transition
	return apoliticalChannels;
}
export async function addApoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function removeApoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function getPoliticalChannel(guild: Guild) : Promise<string> {
	// Guild parameter currently unused - political channel IDs will be per-guild after the SQL transition
	return '795737668654071818';
}
export async function generateNoPolitickString(id1: string, id2: string) : Promise<string> {
	return `Getting awfully political for <#${id1}>, comrade! Mind taking it to <#${id2}>?`;
}
export async function getTrolledMembers(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - trolled member IDs will be per-guild after the SQL transition
	return trolledMembers;
}
export async function addTrolledMember(user: User, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function removeTrolledMember(user: User, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function getSocialCredits(user: User, guild: Guild) : Promise<number> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
	if (socialCredits.has(user.id)) {
		return socialCredits.get(user.id) || DEFAULT_SOCIAL_CREDITS;
	} else return DEFAULT_SOCIAL_CREDITS;
}
export async function getAllSocialCredits(guild: Guild) : Promise<Map<string, number>> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
	return socialCredits;
	/*let str = "";
	socialCredits.forEach(function (value, key) {
		str = str + `**<@!${key}>:** ${value}\n`
	});
	return str;*/
}
export async function setSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    socialCredits.set(user.id, credits);
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}
export async function increaseSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    if (socialCredits.has(user.id)) {
        socialCredits.set(user.id, (socialCredits.get(user.id) ?? 0) + credits);
    } else {
        socialCredits.set(user.id, DEFAULT_SOCIAL_CREDITS + credits);
    }
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}
export async function decreaseSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    if (socialCredits.has(user.id)) {
        socialCredits.set(user.id, (socialCredits.get(user.id) ?? 0) - credits);
    } else {
        socialCredits.set(user.id, DEFAULT_SOCIAL_CREDITS - credits);
    }
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}

export { SOCIAL_CREDIT_WRITE_INTERVAL }