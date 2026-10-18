// 👑 EXTRACTION V2 - by ᵏⁱⁿᵍ SOUL SNATCHER
// CLEAN INDEX.JS - 100% Working

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const { Boom } = require('@hapi/boom');

async function startBot() {
    console.log('👑 Starting EXTRACTION V2 by SOUL SNATCHER...');

    const { state, saveCreds } = await useMultiFileAuthState('session');

    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['EXTRACTION V2', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;
            
            console.log('Connection closed, reconnecting...', shouldReconnect);
            if (shouldReconnect) startBot();
            
        } else if (connection === 'open') {
            console.log('✅ BOT CONNECTED SUCCESSFULLY - EXTRACTION V2 ONLINE');
        }
    });

    sock.e
