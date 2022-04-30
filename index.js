require('dotenv').config();
const { Client, Intents } = require("discord.js");
const cheerio = require("cheerio")
const superagent = require("superagent").agent();
const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
let fmessage = "hfdhirhioewhoiriorehwrhiowre"
bot.once('ready', async () => {
    const channel = await bot.channels.fetch(process.env.CID);
    setInterval(async () => {
        let html = await superagent.get(process.env.SHOUTBOXURL)
            .set("Cookie", process.env.GETCOOKIE);
        let $ = cheerio.load(html.text);
        let shout = $("tr[id ^= shout-]").first().text().trim().replace("--", "-").replace("» ", "").split(" - ");
        if (!(shout[2] == fmessage) && !(shout[0] == "Discord")) {
            console.log(shout)
            console.log(fmessage)
            console.log(shout[2])
            console.log(shout[0])
            console.log('New Message On Dedomil');
            fmessage = shout[2];
            channel.send(`**${shout[0]} :** ${shout[2]}`);
        }
    }, 2000);
});
bot.on("messageCreate", async (message) => {
    if (message.channel.id == process.env.CID && !(message.member.displayName == "Dedomil")) {
        await superagent.post(process.env.SENDSHOUTURL)
            .set("Cookie", process.env.SENDCOOKIE)
            .accept(process.env.SENDACCEPT)
            .field("shout_data", `[b]${message.member.displayName}[/b] : ${message.content}`)
            .field("postcode", process.env.SENDPOSTCODE)
    }
})
bot.login(process.env.BOTID);