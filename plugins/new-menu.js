
const { makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default
import fs from 'fs'
import { promises } from 'fs'
import path from 'path'
import { join } from 'path'
import util from 'util'
import os from 'os'
import { createHash} from 'crypto'
import fetch from 'node-fetch'
import { performance } from 'perf_hooks'
import moment from 'moment-timezone'
import { xpRange } from '../lib/levelling.js'
let desc = ''

let handler = async (m, { conn, usedPrefix:  _p, __dirname, args, usedPrefix, command }) => {
  let fakeOption = {
    key: {
      remoteJid: 'status@broadcast',
      participant: '0@s.whatsapp.net',
      fromMe: false
    },
    message: {
      imageMessage: {
        //mimetype: "image/jpeg",
        caption: `Elaina-bot WhatsApp`,
        thumbnail: global.menu,
        mediaType: 1,
      renderLargerThumbnail: true
      }
    }
  }
  let defaultMenu = {
    before: `
╔══════════════
╟「 Hai, %ucap *${conn.user.name}* 」
╚════════════════
`.trim(),
    header: '*〘 %category 〙*\n╔══════════════',
    body: '╟ %cmd%islimit',
    footer: '╚════════════════\n',
    after: `*%week %weton, %date*\n*Waktu Server:* %time WIB`,
  }
  try {
    //let package = JSON.parse(await fs.promises.readFile(path.join(_dirname, '../package.json')).catch(_=> '{}'))
    let tags
    let type = (args[0] || '').toLowerCase()
    switch (type) {
      case 'sticker':
      case 'stiker':
        tags = {
          'sticker': 'Menu Sticker',
          'stickertext': 'Teks ke Sticker',
          'stickertomedia': 'Stiker ke Media',
          'stickerother': 'Sticker Lain',
          'stickerprems': 'Sticker Premium',
        }
        desc = 'Ini adalah fitur untuk membuat stiker kamu sendiri dari gambar/video/teks'
        break
      case 'all':
        tags = {
          "main": "Main",
        "anonymous": "Anonymous",
        "islami": "Islami",
        "game": "Game",
        "tools": "Tools",
        "fun": "Fun",
        "primbon": "Primbon",
        "group": "Group",
        "info": "Info",
        "audio": "Audio",
        "maker": "Maker",
        "internet": "Internet",
        "downloader": "Downloader",
        "nsfw": "Nsfw",
        "vote": "Voting",
        "absen": "Absen",
        "premium": "Premium",
        "advanced": "Advanced",
        "owner": "Owner",
        "giveaway": "Giveaway",
        "nocategory": "No Category"
        }
        desc = `Ini adalah semua fitur bot yang ada`
        break
      case 'download':
        tags = {
          'downloader': 'Menu Download',
          'downloadersosmed': 'SosMed Download',
          'downloaderanime': 'Anime Download',
        }
        desc = `Ini adalah fitur untuk mendownload media melalui link/url
Contoh:
${_p}tiktok https://vm.tiktok.com/abcdefghi
`
        break
      case 'edukasi':
        tags = {
          'belajar': 'Menu Edukasi',
        }
        desc = `Ini adalah fitur edukasi`
        break
      case 'media':
        tags = {
          'media': 'Menu Media',
        }
        desc = `
Ini adalah fitur untuk mendownload media melalui keyword
Contoh:
${_p}play bertaut
`
        break
      case 'gambar':
        tags = {
          'image': 'Menu Gambar',
          'imagerandom': 'Random',
          'photooxy': 'Menu Photooxy',
          'textpro': 'Menu TextPro',
        }
        desc = `Ini adalah fitur generator gambar`
        break
      case 'maker':
        tags = {
          'maker': 'Menu Maker',
        }
        desc = `Ini adalah fitur maker/kreasi`
        break
      case 'pencarian':
        tags = {
          'search': 'Menu Pencarian',
        }
        desc = `Ini adalah fitur untuk pencarian berdasarkan keyword`
        break
      case 'tools':
      case 'tool':
        tags = {
          'tools': 'Menu Tools',
        }
        desc = `Ini adalah fitur tools/alat`
        break
      case 'sastra':
        tags = {
          'quotes': 'Menu Sastra',
        }
        desc = `Ini adalah fitur pilihan sastra`
        break
      case 'group':
        tags = {
          'group': 'Menu Group',
          'admin': `Admin Group ${global.opts['restrict'] || global.db.data.settings[conn.user.jid].restrict ? '' : '(Dinonaktifkan)'}`
        }
        desc = `Ini adalah fitur untuk Group Chat`
        break
      case 'fun':
        tags = {
          'fun': 'Menu Fun',
          'kerang': 'Kerang Ajaib'
        }
        desc = `Ini adalah fitur fun/senang-senang`
        break
      case 'game':
        tags = {
          'game': 'Menu Game',
        }
        desc = `Ini adalah beberapa fitur game`
        break
      case 'ai':
        tags = {
        'ai': 'Menu AI',
          }
        desc = `Ini adalah menu AI`
        break
       case 'rpg':
        tags = {
          'rpg': 'Menu rpg',
        }
        desc = `Ini adalah beberapa fitur rpg`
        break
      case 'premium':
        tags = {
          'premium': 'Menu Premium',
          'jadibot': 'Jadi Bot'
        }
        desc = `Ini adalah fitur khusus user Premium`
        break
      case 'info':
        tags = {
          'main': 'Start Bot',
          'xp': 'Exp & Limit',
          'info': 'Menu Info',
        }
        desc = `Ini adalah fitur Informasi Bot`
        break
      case 'anony':
        tags = {
          'anonymous': 'Chat Anonymous',
        }
        desc = `Ini adalah fitur Anonymous Chat yang memungkinkan kamu untuk chat dengan orang yg tidak kmu knal sblmnya.. mirip Telegram
Note: Fiturs ini hanya digunakan di Private Chat /Chat Pribadi
`
        break
      case 'owner':
        tags = {
          'owner': 'Menu Owner/Jadibot',
        }
        desc = `Ini adalah fitur khusus Owner/Jadibot`
        break
      case 'editor':
        tags = {
          'audio': 'Menu Audio Editor',
          'editorgambar': 'Coming soon'
        }
        break
      case 'msg':
      case 'penyimpanan':
      case 'database':
        tags = {
          'database': 'Menu Penyimpanan',
          'cmd': 'Menu Command Media'
        }
        desc = `Untuk menyimpan teks, vn, audio, video, gambar ke dalam memori Bot`
        break
      case 'kelas':
        tags = {
          'vote': 'Menu Vote',
          'absen': 'Menu Absen',
        }
        break
      default:
        type = ''
        break
    }
    let { exp, limit, level, registered, role, name: namaa } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = namaa
    let d = new Date
    let locale = 'id'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + d.getTimezoneOffset()) / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
    conn.menu = conn.menu ? conn.menu : {}
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after
    let _text
    if (!type) {
      tags = {
        'menuringkas': 'Daftar Menu',
      }
      before = conn.menu.before || `
Hai, 
_%ucap *%name!*_

┏❏──「 *INFO* 」───⬣
│○ *Library:* Baileys
│○ *Function:* Assistant
┗––––––––––✦
 
┌  ◦ Uptime : %uptime
│  ◦ Hari : %week %weton
│  ◦ Waktu : %time
│  ◦ Tanggal : %date
│  ◦ Version : %version
└  ◦ Prefix Used : [ %p ]

┏❏──「 *NOTE* 」───⬣
│○ If you find a bug or want\n│ a premium upgrade, please\n│ contact the owner.\n│○ *Ⓟ* = Premium\n│○ *Ⓛ* = Limit
┗––––––––––✦
`
      _text = before
    } else {
      _text = before + '\n' + desc + '\n'
    }

    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }

    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? ' ' : '') + '\n'
      }
      _text += footer
    }
    _text += after
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      version: `5.0.0`,
      xp4levelup: max - exp,
      level, limit, name, 
      ucap: ucap(), 
      weton, week, date, time, totalreg, rtotalreg, role,
      readmore: conn.readmore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    conn.reply(m.chat, text.trim(), fakeOption)
  } catch (e) { throw e }
}
handler.help = [
  'all',
  'stiker',
  'anony',
  'download',
  'media',
  'edukasi',
  'ai',
  'gambar',
  'maker',
  'pencarian',
  'tools',
  'sastra',
  'group',
  'kelas',
  'fun',
  'game',
  'rpg',
  'premium',
  'penyimpanan',
  'editor',
  'owner',
  'info',
].map(v => 'menu ' + v)
handler.tags = ['menuringkas']
handler.command = /^(menu3)$/i
handler.exp = 3
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucap() {
    const time = moment.tz('Asia/Jakarta').format('HH')
      let res = "Selamat DiniHari"
    if (time >= 4) {
      let res = "Selamat Pagi"
    }
    if (time > 10) {
      let res = "Selamat Siang"
    }
    if (time >= 15) {
      let res = "Selamat Sore"
    }
    if (time >= 18) {
      let res = "Selamat Malam"
    }
    return res
  }