import {readFileSync} from 'fs';
/*const {
    token,
    guildId,
    clientId,
    RestHttp
} = JSON.parse(readFileSync(process.env.AUTHLOC ? process.env.AUTHLOC : './auth.json').toString());*/
const token = process.env.token;
const guildId = process.env.guildId;
const clientId = process.env.clientId;
const RestHttp = process.env.RestHttp;
export { token, guildId, clientId, RestHttp }
