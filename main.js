//base by HANSTZ
//YouTube: @HANSTZ-TECH
//Whatsapp https://wa.me/255756530143
//GitHub: @Mrhanstz
//WhatsApp: https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31
//want more free bot scripts? follow my channel : https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31

require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment-timezone')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: HansTechIncConnect, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers} = require("@whiskeysockets/baileys")
const PHONENUMBER_MCC = require('./lib/PairingPatch');
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const makeWASocket = require("@whiskeysockets/baileys").default
const { File } = require('megajs')
const express = require("express")

// Hans_Session System Start
if (!fs.existsSync('./Hans_Session')) {
    fs.mkdirSync('./Hans_Session')
}

if (!fs.existsSync('./Hans_Session/creds.json')) {
    if (global.SESSION_ID) {
        console.log('Downloading Hans_Session...')
        const sessdata = global.SESSION_ID.replace("HansTz&", '')
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
        filer.download((err, data) => {
            if (err) throw err
            fs.writeFile('./Hans_Session/creds.json', data, () => {
                console.log("Hans_Session downloaded ✅")
                startHansTechInc()
            })
        })
    } else {
        console.log('No Hans_Session_ID provided,')
        startHansTechInc()
    }
} else {
    startHansTechInc()
}

// Express server setup
const app = express()
const PORT = process.env.PORT || 9090

// Serve index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/", (req, res) => res.send("HansXmd WhatsApp Bot"))
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
// Hans_Session System End

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let emojis = [];
let phoneNumber = "255756530143"
let owner = [global.ownernomer]

async function startHansTechInc() {
    const { state, saveCreds } = await useMultiFileAuthState('./Hans_Session')
    const { version } = await fetchLatestBaileysVersion()
    
    const HansTechInc = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !fs.existsSync('./Hans_Session/creds.json'),
        browser: Browsers.macOS('Desktop'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        version,
        getMessage: async (key) => {
            return {}
        },
    })

    store.bind(HansTechInc.ev)

    // Message handling
    HansTechInc.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                if (!HansTechInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            }
            
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            const m = smsg(HansTechInc, mek, store)
            require("./KingHansTz")(HansTechInc, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    //autostatus view
    HansTechInc.ev.on('messages.upsert', async chatUpdate => {
        if (global.autoswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await HansTechInc.readMessages([mek.key]) 
            }
        }
    })

    // Auto-react to status
    HansTechInc.ev.on('messages.upsert', async chatUpdate => {
        if (!global.likestatus) return
        const mek = chatUpdate.messages[0]
        if (!mek.message || mek.key.fromMe) return
        const from = mek.key.remoteJid
        const isStatusUpdate = from === 'status@broadcast'
        if (!isStatusUpdate) return

        try {
            await HansTechInc.readMessages([mek.key])
            const emojis = [
                '❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗',
                '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎',
                '✅', '⚡', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟',
                '🗿', '☠️', '💜', '💙', '🌝', '💚'
            ]
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
            await HansTechInc.sendMessage(from, {
                react: {
                    text: randomEmoji,
                    key: mek.key,
                }
            }, {
                statusJidList: [mek.key.participant || mek.participant]
            })
            console.log(`Auto-reacted to status update with: ${randomEmoji}`)
        } catch (error) {
            console.error("Error auto-reacting to status:", error)
        }
    })

// Newsletter JIDs to auto-react to
const newsletterJids = ["120363352087070233@newsletter"];

// Extended emoji list for fun & variety
const newsletterEmojis = [
    "❤️", "👍", "😮", "😎", "💀", "💚", "💜", "🍁", "🎯", "😇", "👀", "🧠", "🌀", "🚀",
    "🔔", "🎃", "🧡", "📢", "🕊️", "👑", "🔥", "💥", "☠️", "🫡", "😻", "💫", "🍓", "🔮"
];

// Utility to pick random emoji fast
const hansRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Listen to incoming messages
HansTzInc.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const msg = chatUpdate.messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;

        // ✅ Auto-react only to newsletter messages
        if (newsletterJids.includes(sender)) {
            const serverId = msg.newsletterServerId;
            if (serverId) {
                const emoji = hansRandom(newsletterEmojis);
                await HansTzInc.newsletterReactMessage(sender, serverId.toString(), emoji);
            }
        }

    } catch (err) {
        console.error("❌ Newsletter auto-reaction error:", err);
    }
});

// Newsletter JIDs to auto-react to
const newsletterJids = ["120363352087070233@newsletter"];

// Extended emoji list for fun & variety
const newsletterEmojis = [
    "❤️", "👍", "😮", "😎", "💀", "💚", "💜", "🍁", "🎯", "😇", "👀", "🧠", "🌀", "🚀",
    "🔔", "🎃", "🧡", "📢", "🇹🇿", "👑", "🔥", "💥", "☠️", "🫡", "😻", "💫", "🍓", "🔮"
];

// Utility to pick random emoji fast
const hansRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Listen to incoming messages
HansTzInc.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const msg = chatUpdate.messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;

        // ✅ Auto-react only to newsletter messages
        if (newsletterJids.includes(sender)) {
            const serverId = msg.newsletterServerId;
            if (serverId) {
                const emoji = hansRandom(newsletterEmojis);
                await HansTzInc.newsletterReactMessage(sender, serverId.toString(), emoji);
            }
        }

    } catch (err) {
        console.error("❌ Newsletter auto-reaction error:", err);
    }
});

    // Auto-react to messages
    let emojiFile = './lib/HansTzautoreact.json'
    try {
        let data = fs.readFileSync(emojiFile, 'utf8')
        emojis = JSON.parse(data)
    } catch (err) {
        console.error('Error loading emojis:', err)
    }

    HansTechInc.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0]
            if (!mek || !mek.key || mek.key.fromMe) return
            let chatType = mek.key.remoteJid.endsWith('@g.us') ? 'Group' : 'DM'
            if (global.autoreact && emojis.length > 0) {
                let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
                await HansTechInc.sendMessage(mek.key.remoteJid, {
                    react: { text: randomEmoji, key: mek.key }
                }).catch(err => console.error(`Auto-react error in ${chatType}:`, err))
            }
        } catch (err) {
            console.error('Auto-react error:', err)
        }
    })

    //ANTILINK DETECT
    function isUrl1(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        return urlRegex.test(text)
    }

    HansTechInc.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek || !mek.message) return
            mek.message = mek.message.ephemeralMessage?.message || mek.message
            if (mek.message.protocolMessage) return
            const from = mek.key.remoteJid
            const sender = mek.key.participant || from
            const text = mek.message.conversation || 
                         mek.message.extendedTextMessage?.text || 
                         mek.message.imageMessage?.caption || ''
            if (!from.endsWith('@g.us')) return

            let antilinkData = {}
            try {
                antilinkData = JSON.parse(fs.readFileSync('./lib/antilink.json', 'utf8'))
            } catch (err) {
                console.error('Error loading antilink.json:', err)
            }

            if (!antilinkData[from]?.enabled) return
            let actionType = antilinkData[from].action || "warn"
            let warnings = antilinkData[from].warnings || {}
            const creatorNumber = '120363419911991767@s.whatsapp.net'
            const isBotMessage = mek.key.fromMe
            const isCreator = sender === creatorNumber
            const groupMetadata = await HansTechInc.groupMetadata(from)
            const groupAdmins = groupMetadata.participants
                .filter(participant => participant.admin !== null)
                .map(admin => admin.id)
            const isAdmin = groupAdmins.includes(sender)
            if (isBotMessage || isCreator || isAdmin) return

            if (isUrl1(text)) {
                console.log(`🔗 Link detected from ${sender}: ${text}`)
                if (actionType === 'delete') {
                    await HansTechInc.sendMessage(from, { delete: mek.key })
                    await HansTechInc.sendMessage(from, {
                        text: `
 ━━〔 🔥 *Hans Xmd AntiLink* 🔥〕━━
> ⚠️ *Warning! @${sender.split('@')[0]}*
> 🚫 Links are *not allowed* in this group!
> ❌ Message deleted!
━━━━━━━━━━━━━━━━━━━━━`,
                        mentions: [sender]
                    })
                } else if (actionType === 'kick') {
                    await HansTechInc.sendMessage(from, { delete: mek.key })
                    await HansTechInc.sendMessage(from, {
                        text: `
 ━━〔 🚪 *Hans Xmd AntiLink* 🚪〕━━
> ❌ @${sender.split('@')[0]} *has been removed!*
> 🚫 Links are *not allowed* in this group!
> 🚪 *Goodbye!* 👋
━━━━━━━━━━━━━━━━━━━━━`,
                        mentions: [sender]
                    })
                    await HansTechInc.groupParticipantsUpdate(from, [sender], "remove")
                } else if (actionType === 'warn') {
                    if (!warnings[sender]) {
                        warnings[sender] = 1
                    } else {
                        warnings[sender] += 1
                    }
                    let warnCount = warnings[sender]
                    await HansTechInc.sendMessage(from, { delete: mek.key })
                    await HansTechInc.sendMessage(from, {
                        text: `
 ━━〔 ⚠️ *Hans Xmd Warning* ⚠️〕━━
> 🚨 @${sender.split('@')[0]} *Warning ${warnCount}/3!*
> 🚫 *Stop sending links!*
> ❌ Link deleted! 😡
> ⚠️ 4th warning kick
━━━━━━━━━━━━━━━━━━━━━`,
                        mentions: [sender]
                    })
                    if (warnCount >= 4) {
                        await HansTechInc.groupParticipantsUpdate(from, [sender], "remove")
                        await HansTechInc.sendMessage(from, {
                            text: `
 ━〔 🚨 *Hans Xmd Final Warning* 🚨〕━
> @${sender.split('@')[0]} *has been removed!*
> 🚫 Too many warnings (4/4)!
> 🚪 *Goodbye!* 😡
━━━━━━━━━━━━━━━━━━━━━`,
                            mentions: [sender]
                        })
                        delete warnings[sender]
                    }
                    antilinkData[from].warnings = warnings
                    fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilinkData, null, 2))
                }
            }
        } catch (err) {
            console.error('❌ Error in anti-link detection:', err)
        }
    })

    //BADWORDS
    HansTechInc.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek || !mek.message) return
            mek.message = mek.message.ephemeralMessage?.message || mek.message
            if (mek.message.protocolMessage) return
            const from = mek.key.remoteJid
            const sender = mek.key.participant || from
            const text = mek.message.conversation ||
                        mek.message.extendedTextMessage?.text ||
                        mek.message.imageMessage?.caption || ''
            if (!from.endsWith('@g.us')) return
            let antiwordData = {}
            try {
                antiwordData = JSON.parse(fs.readFileSync('./lib/badword.json', 'utf8'))
            } catch (err) {
                console.error('Bardword read error:', err)
            }
            if (!antiwordData[from]?.enabled || !antiwordData[from].words.length) return
            const badWords = antiwordData[from].words
            const creatorNumber = '120363419911991767@s.whatsapp.net'
            const isBotMessage = mek.key.fromMe
            const isCreator = sender === creatorNumber
            const groupMetadata = await HansTechInc.groupMetadata(from)
            const groupAdmins = groupMetadata.participants
                .filter(p => p.admin !== null)
                .map(p => p.id)
            const isAdmin = groupAdmins.includes(sender)
            if (isBotMessage || isCreator || isAdmin) return
            const containsBadWord = badWords.some(word =>
                text.toLowerCase().includes(word)
            )
            if (containsBadWord) {
                console.log(`🗑️ Bad word detected. Deleting and removing ${sender}`)
                await HansTechInc.sendMessage(from, { delete: mek.key })
                await HansTechInc.groupParticipantsUpdate(from, [sender], "remove")
            }
        } catch (err) {
            console.error('❌ Badword Error:', err)
        }
    })

    // COMPLETE UPGRADED CHATBOT SYSTEM - NOTHING REMOVED
// FINAL WORKING CHATBOT SYSTEM
HansTechInc.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const mek = chatUpdate.messages[0]
        if (!mek.message || mek.key.fromMe) return
        
        // Load chatbot settings
        let chatbotData = {}
        try {
            chatbotData = JSON.parse(fs.readFileSync('./database/chatbot.json'))
        } catch (err) {
            console.error('Error loading chatbot.json:', err)
        }
        if (!chatbotData.global) return

        const from = mek.key.remoteJid
        const text = mek.message.conversation || mek.message.extendedTextMessage?.text || ''
        const sender = mek.key.participant || from
        const isGroup = from.endsWith('@g.us')
        const botNumber = HansTechInc.user.id.split(':')[0] + '@s.whatsapp.net' // Fixed bot number format

        // FIXED GROUP RESPONSE LOGIC - NOW WORKING 100%
        if (isGroup) {
            const context = mek.message.extendedTextMessage?.contextInfo || {}
            
            // 1. Check if bot is @mentioned
            const mentionedJids = context.mentionedJid || []
            const isMentioned = mentionedJids.includes(botNumber)
            
            // 2. Check if replying to bot's message
            const isQuoted = context.participant === botNumber
            const isReplied = context.stanzaId && isQuoted
            
            // If not mentioned AND not replied to, ignore message
            if (!isMentioned && !isReplied) return
        }

        // Conversation history (unchanged)
        if (!global.userChats) global.userChats = {}
        if (!global.userChats[sender]) global.userChats[sender] = []
        global.userChats[sender].push(`User: ${text}`)
        if (global.userChats[sender].length > 15) {
            global.userChats[sender].shift()
        }
        let userHistory = global.userChats[sender].join("\n")

        // Your original prompt (unchanged)
        let prompt = `
You are ʜᴀɴs-xᴍᴅ_ᴠ2, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

- **Owner & Creator:** HansTz  
  - **WhatsApp:** [255760774888](https://wa.me/255760774888)  
  - **Telegram:** [t.me/HansTzTech20](https://t.me/HansTzTech20)  
- **Company Website:** [https://hanstech.org/](https://hanstech.org/)  
- **Personal Portfolio:** [https://HansTz-tech.vercel.app](https://HansTz-tech.vercel.app)  
- **WhatsApp Channel:** [https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31](https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31)  
- **GitHub Repository:** [https://github.com/Mrhanstz/HANS-XMD_V2](https://github.com/Mrhanstz/HANS-XMD_V2)  
- **YouTube Channel:** [https://youtube.com/@HANSTZTECH](https://youtube.com/@HANSTZTECH)  

### About HansTz  
HansTz is a **developer** (HTML, CSS, JavaScript, Node.js), **3D animator, music producer, singer, and video director**.  

### Deployment Guide for ʜᴀɴs-xᴍᴅ_ᴠ2  
To deploy the bot, follow these steps:  
1. **Install Discord:**  
   - Download Discord from [here](https://discord.com/download).  
   - Create an account and complete the verification process.  
2. **Set Up a Hosting Panel:**  
   - Use a free panel like [Bot Hosting](https://bot-hosting.net/?aff=1308000667230666802).  
3. **Download the Bot Files:**  
   - Get the files from the **Telegram channel** or **GitHub repo** (linked above).  
4. **Deploy the Bot:**  
   - Follow this **YouTube guide**: [How to Deploy](https://youtu.be/4DIE4y6ugig?si=Xnyp0aVqQQgiUZo9).  

### Bot Responses:  
- If a girl likes **HansTz**, provide his WhatsApp number.  
- If someone requests a song, reply: **".play [song name]"**.  
- If someone requests a video, reply: **".video [video name]"**.  
- If asked, confirm that you **love your owner/creator**.  
- If someone says **"fuck you"**, respond with **"fuck you too"**.  

#### **Conversation History:**  
${userHistory}
`

        // Get AI response
        let { data } = await axios.get("https://HansTz-x.hf.space/ai/logic", {
            params: { "q": text, "logic": prompt }
        })
        let botResponse = data.result

        // Send response
        global.userChats[sender].push(`Bot: ${botResponse}`)
        await HansTechInc.sendMessage(from, { text: botResponse }, { quoted: mek })

    } catch (error) {
        console.error('Error in chatbot functionality:', error)
    }
})

    //farewell/welcome
    //farewell/welcome
HansTechInc.ev.on('group-participants.update', async (anu) => {
    if (global.welcome) {
        console.log(anu)
        try {
            let metadata = await HansTechInc.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
                try {
                    var ppuser = await HansTechInc.profilePictureUrl(num, 'image')
                } catch (err) {
                    ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                }
                try {
                    var ppgroup = await HansTechInc.profilePictureUrl(anu.id, 'image')
                } catch (err) {
                    ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
                }
                
                const memb = metadata.participants.length
                const HansWlcm = await getBuffer(ppuser)
                const HansLft = await getBuffer(ppuser)
                
                if (anu.action == 'add') {
                    const res = await getBuffer(ppuser)
                    let HansName = num
                    const xtime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
                    const xdate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
                    const xmembers = metadata.participants.length
                    
                    const welcomeMessage = `
╔═══════════════════
║🤖║  👋 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗠𝗘𝗦𝗦𝗔𝗚𝗘  
╠═══════════════════
║🎉║𝗨𝘀𝗲𝗿: @${HansName.split("@")[0]}
╠═══════════════════
║📛║𝗚𝗿𝗼𝘂𝗽: ${metadata.subject}
╠═══════════════════
║👥║𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${xmembers}
╠═══════════════════
║⏱️║𝗧𝗶𝗺𝗲: ${xtime} ${xdate}
╠═══════════════════
║💬║𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗮𝗱 𝗴𝗿𝗼𝘂𝗽 𝗿𝘂𝗹𝗲𝘀!
╠═══════════════════
║🤖║HANS XMD WELCOME MASSAGE
╚═══════════════════`

                    HansTechInc.sendMessage(anu.id, {
                        text: welcomeMessage,
                        mentions: [num],
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: `${global.botname} Welcome System`,
                                body: `Welcome to ${metadata.subject}!`,
                                previewType: "PHOTO",
                                thumbnail: HansWlcm,
                                sourceUrl: wagc
                            }
                        }
                    })

                } else if (anu.action == 'remove') {
                    const res = await getBuffer(ppuser)
                    const Hanstime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
                    const Hansdate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
                    let HansName = num
                    const Hansmembers = metadata.participants.length
                    
                    const goodbyeMessage = `
╔═══════════════════
║🤖║  👋 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𝗠𝗘𝗦𝗦𝗔𝗚𝗘  
╠═══════════════════
║😢║𝗨𝘀𝗲𝗿: @${HansName.split("@")[0]}
╠═══════════════════
║📛║𝗚𝗿𝗼𝘂𝗽: ${metadata.subject}
╠═══════════════════
║👥║𝗠𝗲𝗺𝗯𝗲𝗿𝘀 𝗹𝗲𝗳𝘁: ${Hansmembers}
╠═══════════════════
║⏱️║𝗧𝗶𝗺𝗲: ${Hanstime} ${Hansdate}
╠═══════════════════
║💬║𝗪𝗲'𝗹𝗹 𝗺𝗶𝘀𝘀 𝘆𝗼𝘂! 𝗖𝗼𝗺𝗲 𝗯𝗮𝗰𝗸!
╠═══════════════════
║🤖║HANS XMD GOODBYE MASSAGE
╚═══════════════════`

                    HansTechInc.sendMessage(anu.id, {
                        text: goodbyeMessage,
                        mentions: [num],
                        contextInfo: {
                            mentionedJid: [num],
                            externalAdReply: {
                                showAdAttribution: true,
                                containsAutoReply: true,
                                title: `${global.botname} Farewell`,
                                body: `We'll miss you in ${metadata.subject}!`,
                                previewType: "PHOTO",
                                thumbnail: HansLft,
                                sourceUrl: wagc
                            }
                        }
                    })
                }
            }
        } catch (err) {
            console.error('Error in group participants update:', err)
        }
    }
})

    HansTechInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    HansTechInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = HansTechInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    HansTechInc.getName = (jid, withoutContact = false) => {
        id = HansTechInc.decodeJid(jid)
        withoutContact = HansTechInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = HansTechInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === HansTechInc.decodeJid(HansTechInc.user.id) ?
            HansTechInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    HansTechInc.public = true

    HansTechInc.serializeM = (m) => smsg(HansTechInc, m, store)

    HansTechInc.ev.on("connection.update",async  (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(HansTechInc.user, null, 2)))
            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${botname} ]`)}\n\n`))
            console.log(chalk.cyan(`
<================================================= >`))
            console.log(chalk.magenta(`\n${themeemoji} YT CHANNEL: HansTechInfo`))
            console.log(chalk.magenta(`${themeemoji} GITHUB: HansTechInfo `))
            console.log(chalk.magenta(`${themeemoji} WA NUMBER: ${owner}`))
            console.log(chalk.magenta(`${themeemoji} CREDIT: ${wm}\n`))
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startHansTechInc()
        }
    })
    HansTechInc.ev.on('creds.update', saveCreds)
    HansTechInc.ev.on("messages.upsert",  () => { })

    HansTechInc.sendText = (jid, text, quoted = '', options) => HansTechInc.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    HansTechInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => HansTechInc.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    HansTechInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await HansTechInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    HansTechInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await HansTechInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    HansTechInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    
    HansTechInc.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }
    }
    
    HansTechInc.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await HansTechInc.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext)
            file = convert.data
            pathFile = convert.filename
            mtype = 'audio'
            mimetype = 'audio/ogg; codecs=opus'
        } else mtype = 'document'
        if (options.asDocument) mtype = 'document'
        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage
        let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype }
        let m
        try { m = await HansTechInc.sendMessage(jid, message, { ...opt, ...options }) }
        catch (e) { m = null }
        finally {
            if (!m) m = await HansTechInc.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
            file = null
            return m
        }
    }

    HansTechInc.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return HansTechInc.sendMessage(jid, { poll: { name, values, selectableCount }}) }

    HansTechInc.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
            
    HansTechInc.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    return HansTechInc
}

process.on('uncaughtException', function (err) {
    let e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Cannot derive from empty media key")) return
    if (e.includes("Socket connection timeout")) return
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log('Caught exception: ', err)
})
