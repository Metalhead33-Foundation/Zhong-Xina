import {readFileSync} from 'fs';
const {
    token,
    guildId,
    clientId,
    RestHttp
} = JSON.parse(readFileSync(process.env.AUTHLOC ? process.env.AUTHLOC : './auth.json').toString());
export { token, guildId, clientId, RestHttp }