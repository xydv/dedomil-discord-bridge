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
        if (!(shout[2] === fmessage) && !(shout[0] === "Discord")) {
            if (!(shout[2] === undefined)) {
                fmessage = shout[2];
                channel.send(`**${shout[0]} :** ${shout[2]}`);
            }
        }
    }, 2000);
});
bot.on("messageCreate", async (message) => {
    if ((message.attachments.size == 0) && !(message.reference)) {
        if (message.channel.id == process.env.CID && !(message.member.displayName == "Dedomil")) {
            await superagent.post(process.env.SENDSHOUTURL)
                .set("Cookie", process.env.SENDCOOKIE)
                .accept(process.env.SENDACCEPT)
                .field("shout_data", `[b]${message.member.displayName}[/b] : ${message.content}`)
                .field("postcode", process.env.SENDPOSTCODE)
        }
    } else {
        if (message.channel.id == process.env.CID && !(message.member.displayName == "Dedomil")) {
            if (!(!(message.attachments.size == 0) && (message.reference))) {
                if (message.attachments.size == 0) {
                    const reply = await message.channel.messages.fetch(message.reference.messageId);
                    let replyContent;
                    if (reply.content.includes(":** ")) {
                        replyContent = reply.content.split(":** ")[1]
                    } else {
                        replyContent = reply.content
                    }
                    await superagent.post(process.env.SENDSHOUTURL)
                        .set("Cookie", process.env.SENDCOOKIE)
                        .accept(process.env.SENDACCEPT)
                        .field("shout_data", `[b]${message.member.displayName}[/b] : [u]\`${replyContent}\`[/u] - [i]${message.content}[/i] `)
                        .field("postcode", process.env.SENDPOSTCODE)
                } else {
                    const firstattachment = message.attachments.first();
                    if (message.content) {
                        await superagent.post(process.env.SENDSHOUTURL)
                            .set("Cookie", process.env.SENDCOOKIE)
                            .accept(process.env.SENDACCEPT)
                            .field("shout_data", `[b]${message.member.displayName}[/b] Has Uploaded An [url=${firstattachment.url}]Attachment[/url] With Caption [i]${message.content}[/i]`)
                            .field("postcode", process.env.SENDPOSTCODE)
                    } else {
                        await superagent.post(process.env.SENDSHOUTURL)
                            .set("Cookie", process.env.SENDCOOKIE)
                            .accept(process.env.SENDACCEPT)
                            .field("shout_data", `[b]${message.member.displayName}[/b] Has Uploaded An [url=${firstattachment.url}]Attachment[/url]`)
                            .field("postcode", process.env.SENDPOSTCODE)
                    }
                }
            } else {
                const reply = await message.channel.messages.fetch(message.reference.messageId);
                let replyContent;
                if (reply.content.includes(":** ")) {
                    replyContent = reply.content.split(":** ")[1]
                } else {
                    replyContent = reply.content
                }
                await superagent.post(process.env.SENDSHOUTURL)
                    .set("Cookie", process.env.SENDCOOKIE)
                    .accept(process.env.SENDACCEPT)
                    .field("shout_data", `[b]${message.member.displayName}[/b] Has Replied To Message [u]\`${replyContent}\`[/u] With An [url=${firstattachment.url}]Attachment[/url]`)
                    .field("postcode", process.env.SENDPOSTCODE)
            }
        }
    }
})
bot.login(process.env.BOTID);
