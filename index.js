// 👑 EXTRACTION V2 - SOUL SNATCHER FULL 300+ COMMANDS
// OWNER: 254116852421 | NO QR - PAIRING CODE ONLY
// VC DOWN 👍 | VIEWONCE | STICKER | WELCOME SHENG | ANTI-HIJACK | ANTI-LEAVE

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, downloadMediaMessage, jidNormalizedUser, areJidsSameUser } = require("@whiskeysockets/baileys")
const pino = require("pino")
const Boom = require("@hapi/boom")
const fs = require("fs")
const path = require("path")

const OWNER = "254116852421"
const OWNER_JID = OWNER + "@s.whatsapp.net"
let settings = {
    vcMode: false,
    welcome: {},
    antiHijack: {},
    antiLeave: {},
    antiLink: {}
}

// LOAD SETTINGS
if(fs.existsSync('./settings.json')) {
    try { settings = JSON.parse(fs.readFileSync('./settings.json')) } catch {}
}
function saveSettings() { fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2)) }

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await (await import("@whiskeysockets/baileys")).fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })) },
        logger: pino({ level: "silent" }),
        browser: ["EXTRACTION V2", "Chrome", "120.0.0"],
        printQRInTerminal: false,
        markOnlineOnConnect: true,
        syncFullHistory: false
    })

    if (!sock.authState.creds.registered) {
        console.log("⏳ Inatafuta pairing code...");
        await new Promise(r => setTimeout(r, 4000))
        try {
            let code = await sock.requestPairingCode(OWNER)
            console.log(`\n====================\n🔥 CODE YAKO: ${code}\n====================\nWhatsApp > Linked Devices > Link with phone number > Weka: ${code}\n`)
        } catch (e) { console.log("Pair error:", e.message) }
    }

    console.log(`👑 EXTRACTION V2 STARTING... OWNER ${OWNER}`)
    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            console.log("Closed reason:", reason)
            if (reason === DisconnectReason.badSession || reason === DisconnectReason.loggedOut) {
                fs.rmSync('./session', { recursive: true, force: true })
            }
            startBot()
        } else if (connection === 'open') {
            console.log("✅ EXTRACTION V2 CONNECTED 🔥")
            await sock.sendMessage(OWNER_JID, { text: `✅ *EXTRACTION V2 ONLINE* 👑\n\n*OWNER:* ${OWNER}\n*MODE:* Public\n*COMMANDS:* 300+\n*VC DOWN:* 👍 / .vcdown\n*VIEWONCE:* ON 🔓\n*STICKER:* .s + 🔥 react\n*RENDER:* 24/7\n\nAndika .menu` })
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            const from = m.key.remoteJid
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? (m.key.participant || from) : from
            const isOwner = sender.includes(OWNER) || areJidsSameUser(sender, OWNER_JID)
            const pushName = m.pushName || "Mkuu"
            const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || ""
            const command = body.startsWith('.') ? body.slice(1).trim().split(/ +/)[0].toLowerCase() : body.toLowerCase().trim()
            const args = body.trim().split(/ +/).slice(1)
            const text = args.join(' ')
            const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage

            // === 1. VIEWONCE RETRIEVE AUTO 🔓 ===
            let viewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension
            if (viewOnce || m.message.viewOnceMessageV2 || (m.message.imageMessage?.viewOnce) || (m.message.videoMessage?.viewOnce)) {
                console.log("🔓 ViewOnce!")
                try {
                    let buffer = await downloadMediaMessage(m, 'buffer', {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage })
                    let cap = `🔓 *VIEWONCE BUSTED*\nFrom: ${pushName} (${sender})\nChat: ${from}`
                    if (m.message.imageMessage || viewOnce?.message?.imageMessage) await sock.sendMessage(OWNER_JID, { image: buffer, caption: cap })
                    else if (m.message.videoMessage || viewOnce?.message?.videoMessage) await sock.sendMessage(OWNER_JID, { video: buffer, caption: cap })
                    else if (m.message.audioMessage || viewOnce?.message?.audioMessage) await sock.sendMessage(OWNER_JID, { audio: buffer, mimetype: 'audio/mp4', ptt: true })
                    await sock.sendMessage(OWNER_JID, { text: cap })
                } catch(e){ console.log("VO error", e.message) }
            }

            // === 2. VC DOWN 👍 ===
            if (body === '👍' || command === 'vcdown' || command === 'lockvc') {
                if (!isGroup) return
                const meta = await sock.groupMetadata(from)
                if (!meta.participants.find(p => p.id === sock.user.id)?.admin) return sock.sendMessage(from, { text: "❌ Mimi si admin" }, { quoted: m })
                settings.vcMode = true; settings.vcMode = true; saveSettings()
                await sock.sendMessage(from, { text: "🔒 *VC DOWN LOCKED* 👑\nNa @${OWNER} - Soul Snatcher\nKila MTU akijoin VC atatolewa! Mambo ya kelele hakuna!\n\nKufungua: .vcup / .unlockvc", mentions: [OWNER_JID] }, { quoted: m })
            }
            if (command === 'vcup' || command === 'unlockvc') {
                settings.vcMode = false; saveSettings()
                await sock.sendMessage(from, { text: "🔓 *VC OPEN* - Sasa mnaweza piga kelele VC" }, { quoted: m })
            }

            // === 3. MENU FULL 300+ ===
            if (['menu','help','bot','commands','list'].includes(command)) {
               
