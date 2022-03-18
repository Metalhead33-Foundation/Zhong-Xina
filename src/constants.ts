import {readFileSync} from 'fs';
/*const {
    token,
    guildId,
    clientId,
    RestHttp
} = JSON.parse(readFileSync(process.env.AUTHLOC ? process.env.AUTHLOC : './auth.json').toString());*/
const token = process.env.token;
const guildId = process.env.token;
const clientId = process.env.token;
const RestHttp = process.env.token;
export { token, guildId, clientId, RestHttp }