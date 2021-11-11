import axios from 'axios';
import { Client, CommandInteraction, Intents, Message, PartialMessage, Permissions, User, Guild, Channel, GuildChannel, ThreadChannel } from 'discord.js';
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

export class GuildFunctions {

static async saveSocialCredits() : Promise<void> {
    const response = await axios.put(RestHttp + '/latest', strMapToObj(socialCredits))
    if (response.status == 200) {
        console.log('Succesfully flushed social credits!');
    }
}
static async loadSocialCredits() : Promise<void> {
    const response = await axios.get(RestHttp + '/latest');
    socialCredits = objToStrMap(await response.data);
}
static async setPoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	return;
}
static async getPoliticalWords(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return politicalWords;
}
static async addPoliticalWord(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async removePoliticalWord(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async getRacialSlurs(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - slur words will be per-guild after the SQL transition
	return racialSlurs;
}
static async addRacialSlur(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async removeRacialSlur(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async getDeathThreats(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - thread words will be per-guild after the SQL transition
	return deathThreats;
}
static async addDeathThreat(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async removeDeathThreat(word: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async getApoliticalChannels(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - apolitical channel IDs will be per-guild after the SQL transition
	return apoliticalChannels;
}
static async addApoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async removeApoliticalChannel(guild: Guild, channel: GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async getPoliticalChannel(guild: Guild) : Promise<string> {
	// Guild parameter currently unused - political channel IDs will be per-guild after the SQL transition
	return '795737668654071818';
}
static async generateNoPolitickString(id1: string, id2: string) : Promise<string> {
	return `Getting awfully political for <#${id1}>, comrade! Mind taking it to <#${id2}>?`;
}
static async getTrolledMembers(guild: Guild) : Promise<string[]> {
	// Guild parameter currently unused - trolled member IDs will be per-guild after the SQL transition
	return trolledMembers;
}
static async addTrolledMember(user: User, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async removeTrolledMember(user: User, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
static async getSocialCredits(user: User, guild: Guild) : Promise<number> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
	if (socialCredits.has(user.id)) {
		return socialCredits.get(user.id) || DEFAULT_SOCIAL_CREDITS;
	} else return DEFAULT_SOCIAL_CREDITS;
}
static async getAllSocialCredits(guild: Guild) : Promise<Map<string, number>> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
	return socialCredits;
	/*let str = "";
	socialCredits.forEach(function (value, key) {
		str = str + `**<@!${key}>:** ${value}\n`
	});
	return str;*/
}
static async setSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    socialCredits.set(user.id, credits);
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await GuildFunctions.saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}
static async increaseSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    if (socialCredits.has(user.id)) {
        socialCredits.set(user.id, (socialCredits.get(user.id) ?? 0) + credits);
    } else {
        socialCredits.set(user.id, DEFAULT_SOCIAL_CREDITS + credits);
    }
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await GuildFunctions.saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}
static async decreaseSocialCredit(user: User, guild: Guild, credits: number) : Promise<void> {
	// Guild parameter currently unused - social credits for users will be per-guild after the SQL transition
    if (socialCredits.has(user.id)) {
        socialCredits.set(user.id, (socialCredits.get(user.id) ?? 0) - credits);
    } else {
        socialCredits.set(user.id, DEFAULT_SOCIAL_CREDITS - credits);
    }
    ++SOCRE_WRITES;
    if (SOCRE_WRITES >= SOCIAL_CREDIT_BATCH_WRITES) {
        await GuildFunctions.saveSocialCredits();
        SOCRE_WRITES = 0;
    }
}

}
export { SOCIAL_CREDIT_WRITE_INTERVAL }