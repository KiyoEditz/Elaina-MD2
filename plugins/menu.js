import { promises } from 'fs'
import canvafy from "canvafy"
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
import fetch from 'node-fetch'
const { generateWAMessageFromContent,  prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command}) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender;
let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg')

const defaultMenu = {
  before: `
`.trimStart(),
  header: '',
  body: '',
  footer: '',
  after: '',
}
let skntex = `Hai
[ 𝐃 𝐀 𝐒 𝐇 𝐁 𝐎 𝐀 𝐑 𝐃 ]
• 𝐍𝐚𝐦𝐚 𝐁𝐨𝐭: *R E M B O T Z*
• 𝐖𝐚𝐤𝐭𝐮: 
• 𝐓𝐚𝐧𝐠𝐠𝐚𝐥: 
• 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐃𝐚𝐭𝐞: 
• 𝐔𝐩𝐭𝐢𝐦𝐞: 
• 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞:`
let sections = [
  {
    title: 'List Menu ',
    rows: [
      { "header": "", "title": 'Menu All', "highlight_label": 'Recommended', "description": "Menampilkan semua Fitur Menu", "id": `${_p + command} all`,},
      { "header": "", "title": 'Menu Main', "description": "Menampilkan Menu Main", "id": `${_p + command} main` },
      { "header": "", "title": 'Menu Download', "description": "Seluruh Fitur Download", "id": `.menu downloader` },
      { "header": "", "title": 'Menu Sticker', "description": "Memberikan Fitur Sticker", "id": `${_p + command} sticker` },
      { "header": "", "title": 'XP', "description": "Klaim XP", "id": `${_p + command} xp` },
{ "header": "", "title": 'Menu Game', "description": "Seluruh Fitur Game", "id": `${_p + command} game` },
{ "header": "", "title": 'Menu Rpg', "description": "Seluruh Fitur Game Rpg", "id": `${_p + command} rpg` },
      { "header": "", "title": 'Menu Grup', "description": "Seluruh Fitur Group", "id": `${_p + command} group` },
      { "header": "", "title": 'Menu Fun', "description": "Menyediakan Menu Fun", "id": `${_p + command} fun` },
      { "header": "", "title": 'Menu Tools', "description": "Memberikan Fitur Tools", "id": `${_p + command} tools` },
      { "header": "", "title": 'Menu Internet', "description": "Memberikan Fitur Internet", "id": `${_p + command} internet` },
      { "header": "", "title": 'Menu Info/AI', "description": "Menyediakan Info/AI", "id": `${_p + command} info` },
      { "header": "", "title": 'Menu Islam', "description": "Menu Islam🌜", "id": `${_p + command} islam` },
      { "header": "", "title": 'Menu Kerang', "description": "Menu Kerang", "id": `${_p + command} kerang`},
      { "header": "", "title": 'Menu Maker', "description": "Memberikan Menu Textpro Maker", "id": `${_p +command} maker` },
      { "header": "", "title": 'Menu Anime', "description": "Menampilkan menu Anime", "id": `${_p + command} image` },
      { "header": "", "title": 'Menu Owner', "description": "Khusus Untuk Owner Bot", "id": `${_p + command} owner` },
      { "header": "", "title": 'Menu Quotes', "description": "Kumpulan Quotes Disini", "id": `${_p + command} quotes` },
      { "header": "", "title": 'Menu Stalking', "description": "Melampirkan Menu Stalking", "id": `${_p + command} stalk` },
      { "header": "", "title": 'Menu NSFW 🅟', "description": "KHUSUS PREMIUM", "id": `${_p + command} nsfw` },
    ]       
  }, {
  'title': 'INFO BOT ',
    rows: [
      { "header": "", "title": 'Creator', "description": "Nomer pengembang BOT", "id": `${_p}owner` },
      { "header": "", "title": 'Speed', "description": "menampilkan kecepatan respon BOT", "id": `${_p}ping` },
    ]
  }
]
//const fcon = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': `${name}`,}}}
let media = await prepareWAMessageMedia({ image: { url: 'https://btch.pages.dev/file/115260d4449d8d98f212e.jpg' } }, { upload: conn.waUploadToServer });
let msg2 = {
viewOnceMessage: {
  message: {
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
    },
    interactiveMessage: {
      body: {
        text: skntex,
      },
      footer: {
        text: wm,
      },
      header: proto.Message.InteractiveMessage.Header.create({
      ...media,
      title: "",
      subtitle: "",
      hasMediaAttachment: false
    }),
      nativeFlowMessage: {
        buttons: [
          {
          "name": "single_select",
          "buttonParamsJson":
JSON.stringify({
"title": "List Menu ⎙",
"sections": sections
          })              
        },
        {
          "name": "cta_url",
          "buttonParamsJson": JSON.stringify({
            display_text: "Saluran Update Bot",
            url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O',
            merchant_url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O'
          })
        },
      ],
      },
      contextInfo: {
        quotedMessage: m.message,
        participant: m.sender,
        ...m.key
      }
    },
  },
},
};
let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: "ɴᴀᴍᴀ ꜱᴀyᴀ ᴀᴅᴀʟᴀʜ *Kadhera*\n\nʙᴏᴛ ɪɴɪ ᴅᴀᴘᴀᴛ ᴅɪɢᴜɴᴀᴋᴀɴ sᴇʙᴀɢᴀɪ *ᴇᴅᴜᴋᴀsɪ ᴘᴇʟᴀᴊᴀʀᴀɴ*, *ᴜɴᴅᴜʜᴀɴ ᴍᴇᴅɪᴀ*, *ɢᴀᴍᴇ*, *ᴘᴇɴᴊᴀɢᴀ ɢʀᴜᴘ*, *ᴅᴀɴ ʟᴀɪɴɴʏᴀ* ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇᴍʙᴜᴀᴛ ᴋᴀᴍᴜ ʟᴇʙɪʜ ᴍᴜᴅᴀʜ ᴜɴᴛᴜᴋ ᴍᴇɴᴊᴀʟᴀɴɪ ʜᴀʀɪ-ʜᴀʀɪ.\n\n╭  ◦ ᴄʀᴇᴀᴛᴏʀ: *ᴏʀᴀɴɢ*\n╰  ◦ ᴘʀᴇғɪx: *[ . ]*\n\nᴊɪᴋᴀ ᴀᴅᴀ ᴍᴀsᴀʟᴀʜ ᴅᴀʟᴀᴍ ᴘᴇɴɢɢᴜɴᴀᴀɴ sɪʟᴀʜᴋᴀɴ ʜᴜʙᴜɴɢɪ ᴄʀᴇᴀᴛᴏʀ\n ◦ ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ғɪᴛᴜʀ ʙᴏᴛ: *ᴘᴇɴᴄᴇᴛ ᴛᴏᴍʙᴏʟᴅɪ ʙᴀᴡᴀʜ*\n\nʜᴀʀᴀᴘ ᴜɴᴛᴜᴋ ʙᴇʀɢᴀʙᴜɴɢ ɢʀᴏᴜᴘ ʙᴏᴛ ᴀɢᴀʀ ᴍᴇɴɢᴇᴛᴀʜᴜɪ ɪɴғᴏʀᴍᴀsɪ ʙᴏᴛ ᴊɪᴋᴀ *ᴇʀʀᴏʀ/ʙᴀɴɴᴇᴅ*"
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "Kadhera Button V2"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "Me Pianz OFC",
            subtitle: "Kadhera_button_V2",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [            
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Tampilkan Semua Menu\",\"id\":\".allmenu\"}"
              }, 
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Script By Pianz\",\"id\":\".sc\"}"
              }, 
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Bot Aktif Dalam Kurun waktu\",\"id\":\".runtime\"}"
              }, 
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Info Bot\",\"id\":\".\"}"
              },
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Ping\",\"id\":\".ping\"}"
              },           
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Owner Bot salsa\",\"id\":\".owner\"}"
              },             
           ],
          })
        })
    }
  }
}, {})

//await conn.relayMessage(msg.key.remoteJid, msg.message, {
  //messageId: msg.key.id
//})
await conn.relayMessage(m.chat, msg2, { });
let tags = {
'reyzmenu': { }
}
 
  /*try {
  	// DEFAULT MENU
      let dash = global.dashmenu
  	let m1 = global.dmenut
      let m2 = global.dmenub
      let m3 = global.dmenuf
      let m4 = global.dmenub2
      
      // COMMAND MENU
      let cc = global.cmenut
      let c1 = global.cmenuh
      let c2 = global.cmenub
      let c3 = global.cmenuf
      let c4 = global.cmenua
      */
      // LOGO L P
      let lprem = global.lopr
      let llim = global.lolm
      let tag = `@${m.sender.split('@')[0]}`
    
    //-----------TIME---------
    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
   //let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let _mpt
    if (process.send) {
      process.send('uptime')
      _mpt = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let mpt = clockString(_mpt)
    let usrs = db.data.users[m.sender]
      
    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
    let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
 
    let mode = global.opts['self'] ? 'Private' : 'Publik'
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { age, exp, limit, level, role, registered, eris} = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium': 'Free'}`
    let platform = os.platform()
    
    let bjir = 'https://telegra.ph/file/b7e407a6472f01eedced5.jpg'
    //---------------------
    
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
          }
    conn.menu = conn.menu ? conn.menu : {}
    let fitur = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      //tag, dash,m1,m2,m3,m4,cc, c1, c2, c3, c4,lprem,llim,
      ucpn,platform, wib, mode, _p, eris, age, tag, name, prems, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
 let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}

let p = await new canvafy.Security()
. setAvatar (pp)
. setBackground ("color","#FF0033")
. setLocale ("id")
. setOverlayOpacity (1.0)
. setAvatarBorder ("#fff")
   .setCreatedTimestamp(Date.now())
        .setSuspectTimestamp(1)
.build()

let delay = time => new Promise(res => setTimeout(res, time))
let elaina = {
                 audio:fs.readFileSync('./vn/menuawal.mp3'),mimetype:'audio/mpeg',ptt:true,viewOnce:false,thumbnaiUrl:thumb
                    
                    
                }
            await delay(1000)              
            conn.sendMessage(m.chat, elaina,{ quoted: m })
}               
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help)$/i

handler.register = false

export default handler

//----------- FUNCTION -------

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}
function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [ye, ' *Years 🗓️*\n',  mo, ' *Month 🌙*\n', d, ' *Days ☀️*\n', h, ' *Hours 🕐*\n', m, ' *Minute ⏰*\n', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  let res = "ᴋᴏᴋ ʙᴇʟᴜᴍ ᴛɪᴅᴜʀ ᴋᴀᴋ? 🥱"
  if (time >= 4) {
    res = "ᴘᴀɢɪ ᴋᴀᴋ 🌄"
  }
  if (time >= 10) {
    res = "sɪᴀɴɢ ᴋᴀᴋ ☀️"
  }
  if (time >= 15) {
    res = "sᴏʀᴇ ᴋᴀᴋ 🌇"
  }
  if (time >= 18) {
    res = "ᴍᴀʟᴀᴍ ᴋᴀᴋ 🌙"
  }
  return res
}