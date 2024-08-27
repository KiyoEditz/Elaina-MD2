//━━━━━━━━[ DEFAULT SETTINGS ]━━━━━━━━//
const { makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import { promises } from 'fs'
import util from 'util'
import os from 'os'
import { join } from 'path'
import { createHash} from 'crypto'
import fetch from 'node-fetch'
import { performance } from 'perf_hooks'
import moment from 'moment-timezone'

//━━━━━━━━[ CATEGORY ]━━━━━━━━//
let handler = async (m, { conn, usedPrefix: _p, __dirname, args, usedPrefix, command }) => {
try {
  let tags
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'main', 'downloader', 'sticker', 'xp', 'game', 'rpg', 'asupan', 'group', 'fun', 'tools', 'internet', 'info', 'islam', 'kerang', 'maker', 'stalk', 'quotes', 'shortlink', 'anonymous', 'voicechanger', 'image', 'nsfw', 'owner', 'advanced']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == 'all') tags = {
   'main': 'MENU UTAMA',
  'downloader': 'MENU DOWNLOADER',
  'sticker': 'MENU CONVERT',
  'xp': 'MENU EXP',
  'game': 'MENU GAME',
  'rpg': 'MENU RPG',
  'group': 'MENU GROUP',
  'fun': 'MENU FUN',
  'tools': 'MENU TOOLS',
  'internet': 'INTERNET',
  'info': 'MENU INFO',
  'islam' : 'MENU ISLAMI',
  'kerang': 'MENU KERANG',
  'asupan': 'MENU ASUPAN',
  'maker': 'MENU MAKER',
  'quotes' : 'MENU QUOTES',
  'stalk': 'MENU STALK',
  'shortlink': 'SHORT LINK',
  'anonymous': 'ANONYMOUS CHAT',
  'voicechanger': 'VOICE CHANGER',
  'image': 'MENU IMAGE',
  'nsfw': 'MENU NSFW',
  'owner': 'MENU OWNER',
  'advanced': 'ADVANCED',
  }
  if (teks == 'main') tags = {
    'main': 'MENU UTAMA',
  }
  if (teks == 'downloader') tags = {
  'downloader': 'MENU DOWNLOADER',
  }
  if (teks == 'sticker') tags = {
  'sticker': 'MENU CONVERT',
  }
  if (teks == 'xp') tags = {
  'xp': 'MENU EXP',
  }
   if (teks == 'asupan') tags = {
  'asupan': 'MENU ASUPAN', 
  }
  if (teks == 'game') tags = {
  'game': 'MENU GAME',
  }
  if (teks == 'rpg') tags = {
  'rpg': 'MENU RPG',
  }
  if (teks == 'group') tags = {
  'group': 'MENU GROUP',
  }
  if (teks == 'fun') tags = {
  'fun': 'MENU FUN',
  }
  if (teks == 'tools') tags = {
  'tools': 'MENU TOOLS',
  }
  if (teks == 'internet') tags = {
  'internet': 'INTERNET',
  }
  if (teks == 'info') tags = {
  'info': 'MENU INFO',
  }
  if (teks == 'islam') tags = {
  'islam': 'MENU ISLAMI',
  }
  if (teks == 'kerang') tags = {
  'kerang': 'MENU KERANG',
  }
  if (teks == 'maker') tags = {
  'maker' : 'MENU MAKER',
  }
  if (teks == 'quotes') tags = {
  'quotes': 'MENU QUOTES',
  }
  if (teks == 'stalk') tags = {
  'stalk': 'MENU STALK',
  }
  if (teks == 'shortlink') tags = {
    'shortlink': 'SHORTLINK',
  }
  if (teks == 'anonymous') tags = {
  'anonymous': 'ANONYMOUS CHAT',
  }
  if (teks == 'voicechanger') tags = {
  'voicechanger': 'VOICE CHANGER',
  }
  if (teks == 'image') tags = {
  'image': 'MENU IMAGE',
  }
  if (teks == 'nsfw') tags = {
  'nsfw' : 'MENU NSFW',
  }
  if (teks == 'owner') tags = {
  'owner': 'MENU OWNER',
  }
  if (teks == 'advanced') tags = {
  'advanced': 'MENU ADVANCED',
  }
  
  
  
  //━━━━━━━━[ DEFAULT MENU ]━━━━━━━━//
const defaultMenu = {
  before:`
╔══════════════
╟「 Hai, %ucapan *${conn.user.name}* 」
╚════════════════
`.trimStart(), 
  header: '*〘 %category 〙*\n╔══════════════',
  body: '╟ %cmd %islimit %isPremium',
  footer: '╚════════════════\n', 
  after: `*%week %weton, %date*\n*Waktu Server:* %time WIB`,
}


//━━━━━━━━[ DATABASE USER ]━━━━━━━━//
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender 
    let name = conn.getName(m.sender)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let premium = global.db.data.users[m.sender].premium
    let user = global.db.data.users[who]
    let { exp, limit, level, money, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let tag = `@${m.sender.split('@')[0]}`
 m, { contextInfo: { mentionedJid: conn.parseMention(tag) }}

//━━━━━━━━[ TIMER ]━━━━━━━━//
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let waktuwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')

//━━━━━━━━[ SETTING HELP ]━━━━━━━━//
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


//━━━━━━━━[ BAGIAN MENU ]━━━━━━━━//
let kiyo = `Hai ${tag} %ucapan
[ 𝐃 𝐀 𝐒 𝐇 𝐁 𝐎 𝐀 𝐑 𝐃 ]
• 𝐍𝐚𝐦𝐚 𝐁𝐨𝐭: *R E M B O T Z*
• 𝐖𝐚𝐤𝐭𝐮: *${time}*
• 𝐓𝐚𝐧𝐠𝐠𝐚𝐥: *${week} ${weton}*
• 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐃𝐚𝐭𝐞: *${dateIslamic}*
• 𝐔𝐩𝐭𝐢𝐦𝐞: *${uptime}*
• 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞: *${rtotalreg} dari ${totalreg}*

Hai, 
${tag} ${global.ucapan}

┏❏──「 *INFO* 」───⬣
│○ *Library:* Baileys
│○ *Function:* Assistant
┗––––––––––✦
 
┌  ◦ Uptime : ${uptime}
│  ◦ Hari : ${week} ${weton}
│  ◦ Waktu : ${time}
│  ◦ Tanggal : ${date}
│  ◦ Version : ${global.version}
│  ◦ Database : ${rtotalreg} dari ${totalreg}
└  ◦ Prefix Used : [ ${_p} ]

┏❏──「 *NOTE* 」───⬣
│○ If you find a bug or want\n│ a premium upgrade, please\n│ contact the owner.\n│○ *Ⓟ* = Premium\n│○ *Ⓛ* = Limit
┗––––––––––✦
`
if (teks == '404') {
/*
  let sections = [
      {
        title: 'List Menu ',
        rows: [
          { "header": "", "title": 'Menu All', "highlight_label": 'Recommended', "description": "Menampilkan semua Fitur Menu", "id": `${_p + command} all`,},
          { "header": "", "title": 'Menu Main', "description": "Menampilkan Menu Main", "id": `${_p + command} main` },
          { "header": "", "title": 'Menu Download', "description": "Seluruh Fitur Download", "id": `.menu3 downloader` },
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
      */
    const fcon = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': `${name}`,}}}
     let media = await prepareWAMessageMedia({ image: { url: 'https://btch.pages.dev/file/115260d4449d8d98f212e.jpg' } }, { upload: conn.waUploadToServer });
    let msg = {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2,
				},
				interactiveMessage: {
					body: {
						text: kiyo,
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
							/*
              {
              "name": "single_select",
              "buttonParamsJson":
JSON.stringify({
 "title": "List Menu ⎙",
"sections": sections
              })              
            },
            */
            {
              "name": "quick_reply",
              "buttonParamsJson": "{\"display_text\":\"MENUALL\",\"id\":\".menu2 all\"}"
            },
            {
              "name": "cta_url",
              "buttonParamsJson": JSON.stringify({
                display_text: "Saluran Update Bot",
                url: 'https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F',
                merchant_url: 'https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F'
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
    return conn.relayMessage(m.chat, msg, fcon, { });
}
  
  
 
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
        before,
        ...Object.keys(tags).map(tag => {
          return header.replace(/%category/g, tags[tag]) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
              return menu.help.map(help => {
                return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                  .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                  .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
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
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      name,
      ucapan: ucapan(),
      level, limit, money, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    
//━━━━━━━━[ SETTINGS MENU ]━━━━━━━━//
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    let vn = 'https://file.betabotz.eu.org/file/wv9pkwd9mcb0ytx1k8if.aac'
    
  await conn.sendMessage(m.chat, {
      video: { url: 'https://btch.pages.dev/file/7081ad0d533f9f9d3db9c.jpg' },
      gifPlayback: true,
      caption: text,
      contextInfo: {
      externalAdReply: {
      title: `Elaina-MD`,
      body: `KiyoEditz`,
      thumbnailUrl: 'https://btch.pages.dev/file/7081ad0d533f9f9d3db9c.jpg',
      sourceUrl: ``,
      mediaType: 1,
      renderLargerThumbnail: true
      }
      }}, {
                        quoted: m
                    })
                    conn.sendFile(m.chat, vn, null, null, m, true, { ptt: true })
} catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu2', 'help2', '?']
handler.tags = ['main']
handler.command = /^(menu2|help2|\?)$/i
handler.exp = 3

export default handler

//━━━━━━━━[  JANGAN DI UBAH  ]━━━━━━━━//
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Selamat DiniHari"
  if (time >= 4) {
    let res = "Selamat Pagi 🌤️🏞️"
  }
  if (time > 10) {
    let res = "Selamat Siang ☀️🏝️"
  }
  if (time >= 15) {
    let res = "Selamat Sore ⛅🌅"
  }
  if (time >= 18) { 
    let res = "Selamat Malam 🌙🌌"
  }
  return res
}