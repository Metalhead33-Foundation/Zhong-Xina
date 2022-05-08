import axios from 'axios';
import { User, Guild, GuildChannel, ThreadChannel } from 'discord.js';
import { APIInteractionDataResolvedChannel } from 'discord-api-types/v9';
import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch';

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
let eikosL: Array<string> = [];
let tifasL: Array<string> = [];
const tifas = [
    'https://wimg.rule34.xxx//images/5001/f21355ea2d52093d734f168a62ffb59b.jpeg',
	'https://cdn.discordapp.com/attachments/865226939887386644/945305760517201920/unknown.png',
	'https://cdn.discordapp.com/attachments/865226939887386644/943882427170967552/273620938_8198993653460228_7348326665204201925_n.png',
	'https://cdn.donmai.us/original/69/0c/__tifa_lockhart_final_fantasy_and_1_more_drawn_by_ira_town__690c94a6f7f495b933f04a111c3803a9.jpg',
	'https://cdn.donmai.us/original/a7/27/__tifa_lockhart_final_fantasy_and_1_more_drawn_by_yeedee__a727f7b312c7516d8666e1b4284bd4fb.png',
	'https://cdn.donmai.us/original/42/61/__tifa_lockhart_final_fantasy_and_2_more_drawn_by_monori_rogue__42610f5967e2e84dff6a020ecf237985.jpg',
	'https://cdn.donmai.us/original/f7/c9/__tifa_lockhart_final_fantasy_and_2_more_drawn_by_waki_w4kih__f7c9c21cffa3175461c13083383047cf.jpg',
	'https://cdn.donmai.us/original/7d/9c/__tifa_lockhart_final_fantasy_and_2_more_drawn_by_variasii__7d9c0e4396808346757bf1e57e05eee8.jpg',
	'https://cdn.donmai.us/original/de/08/__tifa_lockhart_final_fantasy_and_2_more_drawn_by_arcie_albano__de08618db967ba3157bb169f4a870128.jpg',
	'https://cdn.donmai.us/original/e6/63/__tifa_lockhart_final_fantasy_and_2_more_drawn_by_tony_guisado__e6633f948606ce6add20a72b12bf3566.jpg',
	'https://cdn.donmai.us/original/35/dc/__tifa_lockhart_final_fantasy_and_1_more_drawn_by_r3dfive__35dc16286d1b7d689eb519318792ffaf.jpg'
];
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
export async function refreshEiko() : Promise<void> {
	const normal = await GooglePhotosAlbum.fetchImageUrls('https://photos.app.goo.gl/msbaxPPwm5tsVBKN6');
	const ecchi = await GooglePhotosAlbum.fetchImageUrls('https://photos.app.goo.gl/tUBaJp4qzrevYMG19');
	let received: Array<string> = [];
	if(normal != null) normal.forEach(element => {
		received.push(`${element.url}=w${element.width}-h${element.height}` );
	});
	if(ecchi != null) ecchi.forEach(element => {
		received.push(`${element.url}=w${element.width}-h${element.height}` );
	});
	eikosL = received;
}
export async function refreshTifa() : Promise<void> {
	const normal = await GooglePhotosAlbum.fetchImageUrls('https://photos.app.goo.gl/dq39MwJ4jTf7AuKv9');
	const ecchi = await GooglePhotosAlbum.fetchImageUrls('https://photos.app.goo.gl/WpNMYoXf9RbLKctc8');
	let received: Array<string> = [];
	if(normal != null) normal.forEach(element => {
		received.push(`${element.url}=w${element.width}-h${element.height}` );
	});
	if(ecchi != null) ecchi.forEach(element => {
		received.push(`${element.url}=w${element.width}-h${element.height}` );
	});
	tifasL = received;
}
export async function getEiko(guild: Guild) : Promise<string> {
	if(eikosL.length == 0) {
		refreshEiko();
	}
	return randomItem(eikosL);
}
export async function getTifa(guild: Guild) : Promise<string> {
	if(tifasL.length == 0) {
		refreshTifa();
	}
	return randomItem(tifasL);
}
export async function remTifa(user: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}
export async function addTifa(user: string, guild: Guild) : Promise<void> {
	// Guild parameter currently unused - political words will be per-guild after the SQL transition
	return;
}

export { SOCIAL_CREDIT_WRITE_INTERVAL }
