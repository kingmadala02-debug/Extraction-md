const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")

const OWNER = "254116852421"

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        },
        logger: pino({ level: "silent" }),
        browser: ["EXTRACTION V2", "Chrome", "1.0"],
        printQRInTerminal: false,
        markOnlineOnConnect: false
    })

    if (!sock.authState.creds.registered) {
        console.log("Waiting 1 MINUTE...")
        await new Promise(r => setTimeout(r, 60000))
        try {
            let code = await sock.requestPairingCode(OWNER)
            console.log(`\n*** PAIRING CODE: ${code} ***\n`)
        } catch (e) {
            console.log("Fail, retry after 1min:", e.message)
            await new Promise(r => setTimeout(r, 60000))
            startBot()
            return
        }
    }

    console.log("EXTRACTION V2 STARTING...")

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update
        if (connection === 'close') {
            await new Promise(r => setTimeout(r, 60000))
            startBot()
        }
        if (connection === 'open') {
            console.log("CONNECTED ✅")
            await sock.sendMessage(OWNER + "@s.whatsapp.net", { text: "✅ EXTRACTION V2 ONLINE 👑\n.menu | .ping | .vcdown 👍 | .vcup" })
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message || m.key.fromMe) return
        const from = m.key.remoteJid
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ""
        const cmd = body.startsWith('.') ? body.slice(1).split(' ')[0].toLowerCase() : body.toLowerCase().trim()

        if (cmd === 'menu') {
            await sock.sendMessage(from, { text: "👑 EXTRACTION V2\n.menu\n.ping\n.vcdown / 👍\n.vcup\n.s\n.owner" })
        }
        if (cmd === 'ping') {
            await sock.sendMessage(from, { text: "Pong! ⚡" })
        }
        if (body === '👍' || cmd === 'vcdown') {
            await sock.sendMessage(from, { text: "🔒 VC DOWN ACTIVATED 👑" })
        }
        if (cmd === 'vcup') {
            await sock.sendMessage(from, { text: "🔓 VC OPEN" })
        }
        if (cmd === 'owner') {
            await sock.sendMessage(from, { text: "Owner: 254116852421" })
        }
    })
}

startBot()
