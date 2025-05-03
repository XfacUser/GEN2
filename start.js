
console.clear();
console.log('XFACMD :D');
require('./settings/config');

const { 
    default: makeWASocket, 
    prepareWAMessageMedia, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    generateWAMessageFromContent, 
    generateWAMessageContent, 
    generateWAMessage,
    jidDecode, 
    proto, 
    delay,
    relayWAMessage, 
    getContentType, 
    getAggregateVotesInPollMessage, 
    downloadContentFromMessage, 
    fetchLatestWaWebVersion, 
    InteractiveMessage, 
    makeCacheableSignalKeyStore, 
    Browsers, 
    generateForwardMessageContent, 
    MessageRetryMap 
} = require("@whiskeysockets/baileys");
const cfonts = require('cfonts');
const chalk = require('chalk');
const pino = require('pino');
const FileType = require('file-type');
const readline = require("readline");
const fs = require('fs');
const crypto = require("crypto")
const colors = require('colors')
const {
    Boom 
} = require('@hapi/boom');
const { 
    color 
} = require('./start/lib/color');
const { TelegraPh } = require('./start/lib/uploader')
const {
    smsg,
    sleep,
    getBuffer
} = require('./start/lib/myfunction');

const { 
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    writeExif,
    addExif
} = require('./start/lib/exif')


const usePairingCode = true;
const GITHUB_DB_URL = "https://raw.githubusercontent.com/XfacUser/Security-/refs/heads/main/DB.json";

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    });
    return new Promise((resolve) => { rl.question(text, resolve) });
}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
cfonts.say('Xfac', 
{
    font: 'block',
    align: 'left',
    colors: ['#ff00ff', 'white'],
    background: 'transparent',
    rawMode: false,
});
async function verifyUser(phone) {
    try {
        console.log(chalk.blue("🔍 Mengambil data keamanan..."));

        let response = await fetch(GITHUB_DB_URL);
        let data = await response.json();

        let user = data.users.find(u => u.phone === phone);
        if (!user) {
            console.log(chalk.red("❌ Nomor tidak terdaftar!"));
            process.exit(1);
        }

        let username = await question(chalk.yellow(`📝 Masukkan Username: `));
        let password = await question(chalk.yellow(`🔑 Masukkan Password: `));
        let pin = await question(chalk.yellow(`🔢 Masukkan PIN: `));
        let key = await question(chalk.yellow(`🔐 Masukkan Key: `));

        if (user.username !== username || user.password !== password || user.pin !== pin || user.key !== key) {
            console.log(chalk.red("❌ Data tidak valid! Akses ditolak."));
            process.exit(1);
        }

        console.log(chalk.green("✅ Verifikasi berhasil! Melanjutkan koneksi..."));
    } catch (error) {
        console.error(chalk.red("❌ Gagal mengambil database! Periksa koneksi internet atau URL GitHub."));
        process.exit(1);
    }
}

async function xfacstart() {
		const {
		state,
		saveCreds
	} = await useMultiFileAuthState("session")
	const xfac = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
		version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});


    if (usePairingCode && !xfac.authState.creds.registered) {
const phoneNumber = await question(`
⠀⠰⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢔⠀⠀⡠⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀
⠀⠀⠉⠠⡁⠀⠀⠀⠀⠀⠀⠈⠀⠈⠀⢐⠁⠀⠀⠀⠀⠀⠑⢀⠊⠀⠈⠄⡀⠀⠀⠀
⠀⠀⠂⠀⢁⠀⣀⠀⠀⠄⠀⠀⠀⡠⠀⠀⣠⠀⠀⠰⡄⠀⠘⠘⣄⠀⡠⠃⢃⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣎⢿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣎⢿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣎⢿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣮⢻⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣆⢶⣶⣶⣶⣶⣶⣶⣶⣶⡹⣿⣿⣿⣧⠻⣿⣿⣿⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⣎⢻⣿⣿⣿⣿⣿⣿⣿⣿⣝⣿⣿⣿⣷⡹⣿⣿⣿⣧⠀⠀⠀⠀
⠀⠀⠀⠀⣰⣿⣿⣿⡿⣹⣶⣶⣶⣶⣶⣶⣶⣶⠖⣼⣿⣿⣿⢫⣶⣶⣶⣶⠀⠀⠀⠀
⠀⠀⠀⣰⣿⣿⣿⡟⣼⣿⣿⣿⣿⣿⣿⣿⣿⢏⣾⣿⣿⡿⢣⣿⣿⣿⣿⠃⠀⠀⠀⠀
⠀⠀⣰⣿⣿⣿⢟⣼⣿⣿⣿⢻⣭⣭⣭⣭⣭⢺⣿⣿⡿⣱⣿⣿⣿⡿⣡⠀⠀⠀⠀⠀
⠀⣼⣿⣿⣿⢏⣾⣿⣿⣿⢯⣿⣷⡹⣿⣿⣿⣧⡹⣿⣱⣿⣿⣿⡿⣵⣿⣆⠀⠀⠀⠀
⢸⣿⣿⣿⢣⣿⣿⣿⣿⣇⢿⣿⣿⣷⡙⣿⣿⣿⣷⣬⣭⣭⣭⣭⣼⣿⣿⣿⣆⠀⠀⠀
⠀⠻⣿⢳⣿⣿⣿⣿⣿⣿⣎⢿⣿⣿⣿⡜⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀
⠀⠀⠉⠛⠛⠛⠛⠛⠛⠛⠛⠊⢿⣿⣿⣿⢮⣟⣛⣛⣛⣛⣛⣛⣛⣛⣛⣛⣛⣛⣇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⢏⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣶⡀⢀⣴⠀⠀⡀⠀⢰⡆⠀⠀⠀⠀⡆⠶⠄⡀⠀⡀⠀⢲⣄⡶⠀⠀⠀⢀⠀⠀⣀
⠀⣿⠻⠎⣯⢀⣀⢱⢾⣸⡇⣄⣘⠀⠀⣇⣀⡄⢻⡼⠁⠀⣠⡟⣅⣴⠀⣀⣀⡅⣇⣈
⠀⠉⠀⠀⠁⠈⠉⠀⠀⠉⠀⠈⠁⠀⠀⠉⠉⠁⠸⠃⠀⠀⠉⠀⠈⠉⠀⠈⠉⠀⠈⠉
〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓༄
⫷ Welcome To Clufer Xfac ⫸ 
==================================
MASUKKAN NOMER BERAWALAN 628xxxxxxx :
==================================`
);
        const code = await xfac.requestPairingCode(phoneNumber.trim());
        await verifyUser(phoneNumber.trim());
        console.log(`
╭────────────────╼
╎ Kode Pairing Mu : ${code}
╰────────────────╼`);
    }
    store.bind(xfac.ev);
    xfac.ev.on("messages.upsert", async (chatUpdate, msg) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!xfac.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('FatihArridho_')) return;
            const m = smsg(xfac, mek, store)
            require("./start/case")(xfac, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    });

    xfac.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    xfac.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = xfac.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });
    xfac.public = global.status
xfac.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await xfac.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await xfac.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await xfac.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}
exports.smsg = (xfac, m, hasParent) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    m = M.fromObject(m)
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
        m.chat = xfac.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = xfac.decodeJid(m.key.fromMe && xfac.user.id || m.participant || m.key.participant || m.chat || '')
        m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, xfac.user.id)
    }
    if (m.message) {
        let mtype = Object.keys(m.message)
        m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || // Sometimes message in the front
            (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3!
            mtype[mtype.length - 1] // common case
        m.msg = m.message[m.mtype]
        if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
            if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
            m.msg.key.fromMe = xfac.decodeJid(m.msg.key.participant) === xfac.decodeJid(xfac.user.id)
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === xfac.decodeJid(xfac.user.id)) m.msg.key.remoteJid = m.sender
        }
        m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
        if (typeof m.text !== 'string') {
            if ([
                'protocolMessage',
                'messageContextInfo',
                'stickerMessage',
                'audioMessage',
                'senderKeyDistributionMessage'
            ].includes(m.mtype)) m.text = ''
            else m.text = m.text.selectedDisplayText || m.text.hydratedTemplate?.hydratedContentText || m.text
        }
        m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
        let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = xfac.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
            m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
            m.quoted.sender = xfac.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === xfac.user.jid
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
            m.quoted.name = xfac.getName(m.quoted.sender)
            m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return null
                let q = M.fromObject(await xfac.loadMessage(m.quoted.id) || vM)
                return exports.smsg(xfac, q)
            }
            if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => xfac.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile)
            
 
/*exports.smsg = (conn, m, hasParent) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    m = M.fromObject(m)
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
        let mtype = Object.keys(m.message || {})[0]
        m.chat = xfac.decodeJid(m.key.remoteJid || m.message[mtype] && m.message[mtype].groupId || '')
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = xfac.decodeJid(m.fromMe && xfac.user.id || m.participant || m.key.participant || m.chat || '')
        m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, xfac.user.id)
    }
    if (m.message) {
        let mtype = Object.keys(m.message)
        m.mtype = mtype[mtype[0] === 'messageContextInfo' && mtype.length == 2 ? 1 : 0]
        m.msg = m.message[m.mtype]
        if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = m.sender
        // if (m.mtype === 'ephemeralMessage') {
        //     exports.smsg(conn, m.msg)
        //     m.mtype = m.msg.mtype
        //     m.msg = m.msg.msg
        //   }
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
            if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
            m.msg.key.fromMe = xfac.decodeJid(m.msg.key.participant) === xfac.decodeJid(xfac.user.id)
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === xfac.decodeJid(xfac.user.id)) m.msg.key.remoteJid = m.sender
        }
        m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
        m.mentionedJid = m.msg && m.msg.contextInfo && m.msg.contextInfo.mentionedJid && m.msg.contextInfo.mentionedJid.length && m.msg.contextInfo.mentionedJid || []
        let quoted = m.quoted = m.msg && m.msg.contextInfo && m.msg.contextInfo.quotedMessage ? m.msg.contextInfo.quotedMessage : null
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = xfac.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
            m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
            m.quoted.sender = xfac.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === xfac.user.jid
            m.quoted.text = m.quoted.text || m.quoted.caption || ''
            m.quoted.name = xfac.getName(m.quoted.sender)
            m.quoted.mentionedJid = m.quoted.contextInfo && m.quoted.contextInfo.mentionedJid && m.quoted.contextInfo.mentionedJid.length && m.quoted.contextInfo.mentionedJid || []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            m.getQuotedObj = m.getQuotedMessage = () => {
                if (!m.quoted.id) return false
                let q = M.fromObject(((xfac.chats[m.quoted.chat] || {}).messages || {})[m.quoted.id])
                return exports.smsg(conn, q ? q : vM)
            }

            if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => xfac.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile)*/

            /**
             * Reply to quoted message
             * @param {String|Object} text
             * @param {String|false} chatId
             * @param {Object} options
             */
            m.quoted.reply = (text, chatId, options) => xfac.reply(chatId ? chatId : m.chat, text, vM, options)

            /**
             * Copy quoted message
             */
            m.quoted.copy = () => exports.smsg(xfac, M.fromObject(M.toObject(vM)))

            /**
             * Forward quoted message
             * @param {String} jid
             *  @param {Boolean} forceForward
            */
            m.quoted.forward = (jid, forceForward = false) => xfac.forwardMessage(jid, vM, forceForward)

            /**
             * Exact Forward quoted message
             * @param {String} jid
             * @param {Boolean|Number} forceForward
             * @param {Object} options
            */
            m.quoted.copyNForward = (jid, forceForward = true, options = {}) => xfac.copyNForward(jid, vM, forceForward, options)

            /**
             * Modify quoted Message
             * @param {String} jid
             * @param {String} text
             * @param {String} sender
             * @param {Object} options
            */
            m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => xfac.cMod(jid, vM, text, sender, options)

            /**
             * Delete quoted message
             */
            m.quoted.delete = () => xfac.sendMessage(m.quoted.chat, { delete: vM.key })
        }
    }
    m.name = m.pushName || xfac.getName(m.sender)
    if (m.msg && m.msg.url) m.download = (saveToFile = false) => xfac.downloadM(m.msg, m.mtype.replace(/message/i, ''), saveToFile)
    /**
     * Reply to this message
     * @param {String|Object} text
     * @param {String|false} chatId
     * @param {Object} options
     */
    m.reply = (text, chatId, options) => xfac.reply(chatId ? chatId : m.chat, text, m, options)

    /**
     * Copy this message
     */
    m.copy = () => exports.smsg(xfac, M.fromObject(M.toObject(m)))

    /**
     * Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     */
    m.forward = (jid = m.chat, forceForward = false) => xfac.copyNForward(jid, m, forceForward, options)
    
    // BY JOHANNES
    /**
     * Reply to this message
     * @param {String|Object} text
     * @param {String|false} chatId
     * @param {Object} options
     */
     m.reply = async (text, chatId, options) => xfac.reply(chatId ? chatId : m.chat, text, m, options)
     
     /**m.reply = async (text, chatId, options) => {
    const msg = await generateWAMessageFromContent(
      m.chat,
      {
        interactiveMessage: {
          body: {
            text: "\n" + text + "\n",
          },
          footer: {
            text: "Powered by : dcodekemii",
          },
          header: {
            title: "",
            hasMediaAttachment: false,
          },
          nativeFlowMessage: {
            buttons: [],
          },
        },
      },
      {
        quoted: global.fkontak,
      },
    );
    return xfac.relayMessage(m.chat, msg.message, {
      contextInfo: {
        mentionedJid: [m.sender],
      },
    });
   };/**
    
    /**
     * Exact Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     * @param {Object} options
     */
    
    m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => xfac.copyNForward(jid, m, forceForward, options)

    /**
     * Modify this Message
     * @param {String} jid 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    m.cMod = (jid, text = '', sender = m.sender, options = {}) => xfac.cMod(jid, m, text, sender, options)

    /**
     * Delete this message
     */
    m.delete = () => xfac.sendMessage(m.chat, { delete: m.key })

    try {
        if (m.msg && m.mtype == 'protocolMessage') xfac.ev.emit('message.delete', m.msg.key)
    } catch (e) {
        console.error(e)
    }
    return m
}
    xfac.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') { 
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ?
                xfacstart() : ''
            console.log('Tersambung Kembali')
        }
        console.log(update)
    })
    xfac.sendText = async (jid, text, quoted = 'xfac', options) => {
        xfac.sendMessage(jid, {
            text: text,
            ...options
        },{ quoted });
    }
    
    xfac.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])}
        return buffer
    }

    xfac.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }
        
        await xfac.sendMessage(jid, { 
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };
    xfac.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0];

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? filename + "." + type.ext : filename;
        await fs.writeFileSync(trueFileName, buffer);
        
        return trueFileName;
    };

    xfac.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await xfac.sendMessage(jid, {
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };
	xfac.sendAsSticker = async (jid, path, quoted, options = {}) => {
		const buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
		let buffer
	 if (options && (options.packname || options.author)) {
            buffer = await writeExif(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }
		await xfac.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
		return buff;
	}
	xfac.imgToSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`,`[1], "base64")
      : /^https?:\/\//.test(path)
      ? await await fetchBuffer(path)
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await xfac.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      }
    );
    return buffer;
  };
    xfac.albumMessage = async (jid, array, quoted) => {
        const album = generateWAMessageFromContent(jid, {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32),
            },
            
            albumMessage: {
                expectedImageCount: array.filter((a) => a.hasOwnProperty("image")).length,
                expectedVideoCount: array.filter((a) => a.hasOwnProperty("video")).length,
            },
        }, {
            userJid: xfac.user.jid,
            quoted,
            upload: xfac.waUploadToServer
        });

        await xfac.relayMessage(jid, album.message, {
            messageId: album.key.id,
        });
        
        xfac.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, './lib' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}

xfac.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await xfac.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await xfac.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}

xfac.sendText = (jid, text, quoted = '', options) => xfac.sendMessage(jid, { text: text, ...options }, { quoted })

xfac.serializeM = (m) => smsg(xfac, m, store)

xfac.before = (teks) => smsg(xfac, m, store)

xfac.serializeM = (m) => {
        return exports.smsg(xfac , m)
    }


        for (let content of array) {
            const img = await generateWAMessage(jid, content, {
                upload: xfac.waUploadToServer,
            });

            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },    
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ["Y", "Important"],
                isHighlighted: true,
                businessMessageForwardInfo: {
                    businessOwnerJid: jid,
                },
                dataSharingContext: {
                    showMmDisclosure: true,
                },
            };

            img.message.forwardedNewsletterMessageInfo = {
                newsletterJid: "0@newsletter",
                serverMessageId: 1,
                newsletterName: `WhatsApp`,
                contentType: 1,
                timestamp: new Date().toISOString(),
                senderName: "✧ Dittsans",
                content: "Text Message",
                priority: "high",
                status: "sent",
            };

            img.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await xfac.relayMessage(jid, img.message, {
                messageId: img.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: xfac.user.jid,
                    },
                    message: album.message,
                },
            });
        }
        return album;
    };
    xfac.sendStatusMention = async (content, jids = []) => {
        let users;
        for (let id of jids) {
            let userId = await xfac.groupMetadata(id);
            users = await userId.participants.map(u => xfac.decodeJid(u.id));
        };

        let message = await xfac.sendMessage(
            "status@broadcast", content, {
                backgroundColor: "#000000",
                font: Math.floor(Math.random() * 9),
                statusJidList: users,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: jids.map((jid) => ({
                                    tag: "to",
                                    attrs: { jid },
                                    content: undefined,
                                })),
                            },
                        ],
                    },
                ],
            }
        );

        jids.forEach(id => {
            xfac.relayMessage(id, {
                groupStatusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: message.key,
                            type: 25,
                        },
                    },
                },
            },
            {
                userJid: xfac.user.jid,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "true" },
                        content: undefined,
                    },
                ],
            });
            delay(2500);
        });
        return message;
    };
        xfac.ev.on('group-participants.update', async (anu) => {
        if (!global.welcome) return;
        let botNumber = await xfac.decodeJid(xfac.user.id);
        if (anu.participants.includes(botNumber)) return;
        try {
            let metadata = await xfac.groupMetadata(anu.id);
            let namagc = metadata.subject;
            let participants = anu.participants;
            for (let num of participants) {
                let check = anu.author !== num && anu.author.length > 1;
                let tag = check ? [anu.author, num] : [num];
                try {
                    ppuser = await xfac.profilePictureUrl(num, 'image');
                } catch {
                    ppuser = 'https://files.catbox.moe/cchwh7.jpg';
                }
                if (anu.action == 'add') {
                xfac.sendMessage(anu.id, {
image: { url: 'https://files.catbox.moe/xlg9n0.png' },
caption: `Hallo Kak @${num.split("@")[0]} Selamat Datang Di *${namagc}*`,
footer: `Xfac`,
  buttons: [
  {
    buttonId: '.menu',
    buttonText: {
      displayText: 'CLICK THIS TO SEE MENU'
    },
    type: 1,
  }
],
headerType: 1,
  viewOnce: true
}, { quoted: null });
}
                if (anu.action == 'remove') {
            xfac.sendMessage(anu.id, {
            image: { url: 'https://files.catbox.moe/s2s2c4.jpeg' },
            caption: `@${num.split("@")[0]} Telah Keluar Dari Grup Ini`,
            footer: `Xfac`,
              buttons: [
              {
                buttonId: '.menu',
                buttonText: {
                  displayText: 'CLICK THIS TO SEE MENU'
                },
                type: 1,
              }
            ],
            headerType: 1,
              viewOnce: true
            }, { quoted: null });
            }
                if (anu.action == "promote") {
            xfac.sendMessage(anu.id, {
            image: { url: 'https://files.catbox.moe/gh78s2.jpeg' },
            caption: `@${anu.author.split("@")[0]} Telah Menjadikan @${num.split("@")[0]} Sebagai Admin Grup Ini`,
            footer: `Xfac`,
              buttons: [
              {
                buttonId: '.menu',
                buttonText: {
                  displayText: 'CLICK THIS TO SEE MENU'
                },
                type: 1,
              }
            ],
            headerType: 1,
              viewOnce: true
            }, { quoted: null });
            }
                if (anu.action == "demote") {
            xfac.sendMessage(anu.id, {
            image: { url: 'https://files.catbox.moe/2spiis.png' },
            caption: `@${anu.author.split("@")[0]} Telah Memberhentikan @${num.split("@")[0]} Sebagai Admin Grup Ini`,
            footer: `Xfac`,
              buttons: [
              {
                buttonId: '.menu',
                buttonText: {
                  displayText: 'CLICK THIS TO SEE MENU'
                },
                type: 1,
              }
            ],
            headerType: 1,
              viewOnce: true
            }, { quoted: null });
            }
            }
                    } catch (err) {
            console.log(err);
        }
    });
    xfac.ev.on('creds.update', saveCreds);
    return xfac;
}
xfacstart();

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
