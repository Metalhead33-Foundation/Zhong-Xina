# Zhong Xina

![Zhong Xina](https://pbs.twimg.com/profile_images/1427715634738208774/_yuPWpNo_400x400.jpg)

A Discord bot who keeps the server tidy and gives out social credits. He is specifically made for the server [Dēmiourgoí Kósmōn](https://discord.gg/BUFPauXcax), but in the future, he might be opened up for other servers as well. His main goal is to prevent the abuse of channels with off-topic - his logic may be primitive now, but he is getting smarter every day.

To run, a couple of dependencies must be installed:

    yarn install

To run - which is done via issuing the `node bot.js` command - first, an `auth.json` file must be created in the same folder with the following credentials:

```json
{
"token": "<YOUR BOT OAUTH TOKEN>",
"guildId": "<YOUR DISCORD SERVER ID>",
"clientId": "<YOUR BOT OAUTH CLIENT ID>"
}
```
