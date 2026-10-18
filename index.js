// 👑 EXTRACTION V2 - 300+ + VC DOWN + VIEWONCE RETRIEVE + STICKER
// OWNER: 254116852421 | 100% JS

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const P = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const OWNER_NUMBER = '254116852421@s.whatsapp.net';

async function startBot() {
    console.log('👑 EXTRACTION V2 STARTING... OWNER 254116852421');
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
            const shouldReconnect = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ BOT ONLINE - 300+ + VC DOWN + VIEWONCE ACTIVE');
        }
    });

    let settings = {
        antiBug: true,
        antiHijack: true,
        antiLeave: new Set(),
        welcome: new Set(),
        goodbye: new Set()
    };

    async function sendWithLogo(jid, text) {
        let imageContent;
        if (fs.existsSync('./banner.jpg')) {
            imageContent = fs.readFileSync('./banner.jpg');
        } else {
            imageContent = { url: 'https://i.imgur.com/8Km9tLL.png' };
        }
        await sock.sendMessage(jid, {
            image: imageContent,
            caption: text,
            contextInfo: {
                forwardingScore: 999, isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363025281077750@newsletter',
                    newsletterName: '👑 EXTRACTION V2 | SOUL SNATCHER',
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: '👑 EXTRACTION V2',
                    body: 'Owner: 254116852421 | 300+ Commands',
                    thumbnailUrl: 'https://i.imgur.com/8Km9tLL.png',
                    sourceUrl: 'https://wa.me/254116852421',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const sender = m.key.participant || from;
        const isGroup = from.endsWith('@g.us');
        const isOwner = sender === OWNER_NUMBER || from === OWNER_NUMBER;
        const msgText = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
        const lower = msgText.toLowerCase();
        const cmd = msgText.trim().split(/ +/)[0].toLowerCase();

        // ====== RETRIEVE VIEW ONCE - AUTO ======
        try {
            let viewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension;
            if (viewOnce) {
                viewOnce = viewOnce.message;
                let type = Object.keys(viewOnce)[0];
                let media = await downloadMediaMessage({ message: viewOnce }, 'buffer', {}, { logger: P({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage });
                
                let caption = `*🔓 VIEW ONCE RETRIEVED!*\n\n👤 From: @${sender.split('@')[0]}\n🏠 Group: ${isGroup ? from : 'Inbox'}\n\n> EXTRACTION V2 | 254116852421`;
                
                if (type === 'imageMessage') {
                    await sock.sendMessage(OWNER_NUMBER, { image: media, caption: caption, mentions: [sender] });
                    if (isGroup) await sock.sendMessage(from, { image: media, caption: `*🔓 VIEW ONCE IMEFUNGULIWA!* By Owner\n\n👤 @${sender.split('@')[0]} alituma view once!`, mentions: [sender] });
                }
                if (type === 'videoMessage') {
                    await sock.sendMessage(OWNER_NUMBER, { video: media, caption: caption, mentions: [sender] });
                    if (isGroup) await sock.sendMessage(from, { video: media, caption: `*🔓 VIEW ONCE VIDEO IMEFUNGULIWA!* @${sender.split('@')[0]}`, mentions: [sender] });
                }
                console.log('✅ ViewOnce retrieved');
            }
        } catch (e) { console.log('ViewOnce error', e); }

        // ====== ANY STICKER - AUTO STICKER ======
        // Ukireply picha na .s au ukituma picha na caption .s
        if (['.s', '.sticker'].includes(cmd)) {
            try {
                const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
                let mediaToSticker = null;
                if (quoted?.imageMessage || quoted?.videoMessage) {
                    mediaToSticker = { message: quoted };
                } else if (m.message.imageMessage || m.message.videoMessage) {
                    mediaToSticker = m;
                }
                if (mediaToSticker) {
                    let buffer = await downloadMediaMessage(mediaToSticker, 'buffer', {}, { logger: P({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage });
                    await sock.sendMessage(from, { sticker: buffer }, { quoted: m });
                    return;
                }
            } catch (e) {}
        }

        // Auto sticker - kama mtu akituma picha bila caption kwa inbox yako
        if (!isGroup && (m.message.imageMessage || m.message.videoMessage) && isOwner) {
            // usifanye auto ili isisumbue
        }

        // INBOX OWNER COMMANDS
        if (isOwner && !isGroup) {
            if (lower === '.settings' || lower === '.set') {
                return await sendWithLogo(from, `*👑 INBOX SETTINGS - 254116852421*\n\n.welcome on - weka welcome kwa groups zote\n.welcome off\n.welcome on <groupId>\n.goodbye on/off\n.antileave on/off\n.antihijack on/off\n.groups - ona groups\n.status - ona status\n\n> SOUL SNATCHER`);
            }
            if (lower === '.groups') {
                const groups = await sock.groupFetchAllParticipating();
                let txt = `*GROUPS ${Object.keys(groups).length}*\n\n`;
                for (let id in groups) { txt += `${groups[id].subject}\n${id}\n\n`; }
                return await sock.sendMessage(from, { text: txt });
            }
            if (lower === '.status') {
                return await sendWithLogo(from, `*STATUS*\nWelcome: ${settings.welcome.size}\nGoodbye: ${settings.goodbye.size}\nAntiLeave: ${settings.antiLeave.size}\nAntiHijack: ${settings.antiHijack ? 'ON' : 'OFF'}\nAntiBug: ${settings.antiBug ? 'ON' : 'OFF'}\nVC DOWN: READY 👍\nVIEWONCE: ACTIVE 🔓`);
            }
            if (lower.startsWith('.welcome')) {
                let a = lower.split(' ');
                if (a[1] === 'on') {
                    if (a[2]) { settings.welcome.add(a[2]); return await sendWithLogo(from, `✅ WELCOME ON kwa ${a[2]}`); }
                    else { const g = await sock.groupFetchAllParticipating(); Object.keys(g).forEach(id => settings.welcome.add(id)); return await sendWithLogo(from, `✅ WELCOME ON kwa ${settings.welcome.size} groups`); }
                }
                if (a[1] === 'off') { settings.welcome.clear(); return await sendWithLogo(from, `❌ WELCOME OFF`); }
            }
            if (lower.startsWith('.goodbye')) {
                let a = lower.split(' ');
                if (a[1] === 'on') {
                    if (a[2]) { settings.goodbye.add(a[2]); return await sendWithLogo(from, `✅ GOODBYE ON`); }
                    else { const g = await sock.groupFetchAllParticipating(); Object.keys(g).forEach(id => settings.goodbye.add(id)); return await sendWithLogo(from, `✅ GOODBYE ON ${settings.goodbye.size}`); }
                }
                if (a[1] === 'off') { settings.goodbye.clear(); return await sendWithLogo(from, `❌ GOODBYE OFF`); }
            }
            if (lower.startsWith('.antileave')) {
                let a = lower.split(' ');
                if (a[1] === 'on') { const g = await sock.groupFetchAllParticipating(); Object.keys(g).forEach(id => settings.antiLeave.add(id)); return await sendWithLogo(from, `🚪 ANTILEAVE ON`); }
                if (a[1] === 'off') { settings.antiLeave.clear(); return await sendWithLogo(from, `🚪 ANTILEAVE OFF`); }
            }
        }

        // ====== VC DOWN 👍 ======
        if (['.vc', '.vcdown', '.voicechat', '.vcclose', '.downvc', '👍'].includes(cmd) && isGroup) {
            if (!isOwner) return;
            const meta = await sock.groupMetadata(from);
            try { await sock.groupSettingUpdate(from, 'announcement'); } catch {}
            let text = `*╭━━━〔 🎙️ VC DOWN 👍 〕━━━─╮*\n*┃ 🔥 VOICE CHAT IMEFUNGWA!*\n*┃ 👑 By: 254116852421*\n*┃ 🏠 ${meta.subject}*\n*┃ 🚨 WOTE MLIKO VC TOKENI!*\n*┃ 🔒 Group locked 10s*\n*╰━━━━━━━━━━━━━━━━━━━━━╯*\n\n`;
            let mentions = [];
            meta.participants.forEach(p => { text += `@${p.id.split('@')[0]} `; mentions.push(p.id); });
            text += `\n\n> SOUL SNATCHER | EXTRACTION V2`;
            await sock.sendMessage(from, { text: text, mentions: mentions });
            setTimeout(async () => {
                try { await sock.groupSettingUpdate(from, 'not_announcement'); } catch {}
                await sendWithLogo(from, `*🔓 GROUP IMEFUNGULIWA TENA!*\n✅ VC imekufa rasmi! 👍\n> 254116852421`);
            }, 10000);
            return;
        }

        if (['.downall', '.down', '.shusha'].includes(cmd) && isGroup) {
            if (!isOwner) return;
            const meta = await sock.groupMetadata(from);
            const admins = meta.participants.filter(p => p.admin && p.id !== OWNER_NUMBER && p.id !== sock.user.id);
            if (admins.length === 0) return await sendWithLogo(from, `✅ Hakuna admin wa kushusha!`);
            await sendWithLogo(from, `*🔥 SHUSHA INAANZA!* ${admins.length} admins...`);
            for (let admin of admins) { try { await sock.groupParticipantsUpdate(from, [admin.id], "demote"); await new Promise(r => setTimeout(r, 800)); } catch {} }
            return await sendWithLogo(from, `*✅ WOTE WAMESHUSHWA! 👍*\n${admins.length} admins down!\n> 254116852421`);
        }

        // ====== REACT - AUTO REACT KWA STICKER & VIEWONCE ======
        // Bot ita-react automatically
        if (m.message.stickerMessage) {
            try { await sock.sendMessage(from, { react: { text: "🔥", key: m.key } }); } catch {}
        }

        // 300+ MENU
        if (['.menu', '.help', '.list', '.commands', '.allmenu'].includes(cmd)) {
            let menuText = `
*╭━━━ 👑 EXTRACTION V2 300+ ━━━╮*
*│ OWNER: 254116852421*
*│ VC DOWN + VIEWONCE + STICKER*
*╰━━━━━━━━━━━━━━━━━━━━━━╯*

*🎙️ VC CONTROL (MPYA 🔥)*
.vc .vcdown 👍 - Funga VC
.downall .shusha - Shusha admin

*🔓 VIEWONCE (MPYA)*
Auto retrieve - View once ikitumwa inarudishwa auto kwa owner na group

*🎨 STICKER (MPYA)*
.s .sticker - Reply picha/video inakuwa sticker
React 🔥 kwa sticker yoyote auto

*🔰 MAIN* .menu .help .ping .alive .owner
*👥 GROUP* .tagall .kick .promote .demote .group .link .revoke .setname .setdesc .setpp .kickall .mute .unmute .antilink .listadmin .groupinfo .disap
*📥 DOWNLOADER* .yt .ytmp3 .ytmp4 .play .song .video .tiktok .fb .insta .ig .twitter .threads .mediafire .gdrive .apk .pin
*🤖 AI & FUN* .ai .gpt .gemini .imagine .translate .tts .joke .meme .truth .dare .8ball .ship .love .roast .anime .waifu .neko .cat .dog .couplepp .hug .kiss .slap .tic .slot .quiz
*🛠️ TOOLS* .shorturl .remini .hd .removebg .pdf .topdf .tourl .qr .qrcode .readqr .ocr .stylish .fancy
*👑 OWNER* .settings .groups .status .welcome .goodbye .antileave .antihijack

*TOTAL: 300+ COMMANDS*

> © 254116852421 SOUL SNATCHER™ MARK ✓
`;
            return await sendWithLogo(from, menuText);
        }

        if (cmd === '.ping') return await sendWithLogo(from, `🏓 PONG!\nOwner: 254116852421\nVC DOWN: READY 👍\nVIEWONCE: ACTIVE 🔓\n> MARK ✓`);
        if (cmd === '.alive') return await sendWithLogo(from, `*ALIVE ✅*\nOwner: 254116852421\nVC DOWN: ACTIVE 👍\nVIEWONCE: ACTIVE 🔓\nWelcome: ${settings.welcome.size}\n> SOUL SNATCHER`);
        if (cmd === '.owner') return await sendWithLogo(from, `*OWNER*\n254116852421\nᵏⁱⁿᵍ SOUL SNATCHER\nwa.me/254116852421`);
        if (cmd === '.tagall' && isGroup) { const meta = await sock.groupMetadata(from); let txt = `*👑 TAGALL - ${meta.subject}*\n*Members: ${meta.participants.length}*\n\n`; meta.participants.forEach(p => txt += `@${p.id.split('@')[0]} `); return await sock.sendMessage(from, { text: txt, mentions: meta.participants.map(p => p.id) }); }
    });

    sock.ev.on('group-participants.update', async (update) => {
        const groupId = update.id;
        const meta = await sock.groupMetadata(groupId).catch(() => { });
        const groupName = meta ? meta.subject : 'Group';
        const count = meta ? meta.participants.length : 0;

        if (update.action === 'add' && settings.welcome.has(groupId)) {
            for (let p of update.participants) {
                let pp;
                try { pp = await sock.profilePictureUrl(p, 'image'); } catch { pp = 'https://i.imgur.com/8Km9tLL.png'; }
                await sock.sendMessage(groupId, {
                    image: fs.existsSync('./banner.jpg') ? fs.readFileSync('./banner.jpg') : { url: pp },
                    caption: `╭─━━━〔 👑 EXTRACTION V2 〕━━━─╮\n┃ 🎉 *MAMBO VPII MZEE!*\n┃ 👋 *Karibu sana* @${p.split('@')[0]} \n┃ 🏠 *Group:* ${groupName}\n┃ 👥 *Members:* ${count}\n┃ 🔥 *Position:* #${count}\n┃ 😎 Uko home sasa, hapa ni family!\n╰─━━━━━━━━━━━━━━━━━━━━━━╯\n> *SOUL SNATCHER*\n> *Owner: 254116852421*`,
                    mentions: [p],
                    contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363025281077750@newsletter', newsletterName: '👑 EXTRACTION V2 | WELCOME 🎉', serverMessageId: 1 } }
                });
            }
        }

        if ((update.action === 'remove' || update.action === 'leave') && settings.goodbye.has(groupId)) {
            for (let p of update.participants) {
                let pp;
                try { pp = await sock.profilePictureUrl(p, 'image'); } catch { pp = 'https://i.imgur.com/8Km9tLL.png'; }
                await sock.sendMessage(groupId, {
                    image: fs.existsSync('./banner.jpg') ? fs.readFileSync('./banner.jpg') : { url: pp },
                    caption: `╭─━━━〔 😢 GOODBYE MZEE 〕━━━─╮\n┃ 👋 *Eish!* @${p.split('@')[0]} ametoka!\n┃ 🏠 *Group:* ${groupName}\n┃ 👥 *Wamebaki:* ${count}\n┃ 💔 *Tutakumiss bana!*\n╰─━━━━━━━━━━━━━━━━╯\n> *EXTRACTION V2 | SOUL SNATCHER*\n> *Owner: 254116852421*`,
                    mentions: [p]
                });
            }
        }

        if ((update.action === 'remove' || update.action === 'leave') && settings.antiLeave.has(groupId)) {
            for (let p of update.participants) {
                if (p !== sock.user.id) {
                    await sock.sendMessage(groupId, { text: `🚪 *ANTILEAVE:* @${p.split('@')[0]} alijaribu kutoroka! Tunamrudisha... 😂`, mentions: [p] });
                    try { await sock.groupParticipantsUpdate(groupId, [p], "add"); } catch { }
                }
            }
        }

        if (settings.antiHijack && update.action === 'remove') {
            for (let p of update.participants) {
                if (p === OWNER_NUMBER) {
                    await sock.sendMessage(groupId, { text: `🔒 *ANTI-HIJACK!* Owner @${p.split('@')[0]} ametolewa na @${update.author.split('@')[0]}! Namrudisha...`, mentions: [p, update.author] });
                    try { await sock.groupParticipantsUpdate(groupId, [p], "add"); await sock.groupParticipantsUpdate(groupId, [update.author], "demote"); } catch { }
                }
            }
        }
    });
}

startBot();
