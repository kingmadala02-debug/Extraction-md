const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys")
const pino = require("pino")
const Boom = require("@hapi/boom")
const fs = require("fs")

const OWNER = "254116852421"

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
        version: [2, 3000, 1015901307],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        },
        logger: pino({ level: "silent" }),
        browser: ["EXTRACTION", "Chrome", "1.0"],
        printQRInTerminal: false,
        markOnlineOnConnect: true
    })

    if (!sock.authState.creds.registered) {
        await new Promise(r => setTimeout(r, 3000))
        try {
            let code = await sock.requestPairingCode(OWNER)
            console.log(`\n*** PAIRING CODE: ${code} ***\nWeka WhatsApp > Linked Devices > Link with phone number\n`)
        } catch (e) {
            console.log("Pair fail:", e.message)
        }
    }

    console.log("EXTRACTION V2 STARTING...")

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            console.log("Closed:", reason)
            if (reason === DisconnectReason.badSession || reason === DisconnectReason.loggedOut) {
                fs.rmSync('./session', { recursive: true, force: true })
            }
            startBot()
        }
        if (connection === 'open') {
            console.log("CONNECTED ✅")
            await sock.sendMessage(OWNER + "@s.whatsapp.net", { text: "✅ EXTRACTION V2 ONLINE\nVC DOWN: .vcdown / 👍\nMenu: .menu" })
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message || m.key.fromMe) return
        const from = m.key.remoteJid
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ""
        const command = body.startsWith('.') ? body.slice(1).split(' ')[0].toLowerCase() : body.toLowerCase()

        if (command === 'menu' || command === 'help') {
            await sock.sendMessage(from, { text: "👑 EXTRACTION V2\n\n.menu\n.ping\n.vcdown / 👍\n.vcup\n.s (sticker)\n.owner" })
        }
        if (command === 'ping') {
            await sock.sendMessage(from, { text: "Pong! ⚡ EXTRACTION ONLINE" })
        }
        if (body === '👍' || command === 'vcdown') {
            await sock.sendMessage(from, { text: "🔒 VC DOWN ACTIVATED 👑" })
        }
        if (command === 'vcup') {
            await sock.sendMessage(from, { text: "🔓 VC OPEN" })
        }
        if (command === 'owner') {
            await sock.sendMessage(from, { text: "Owner: 254116852421" })
        }
    })
}

startBot()
