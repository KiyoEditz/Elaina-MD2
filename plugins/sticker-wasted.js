import uploadImage from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';
import { webp2png } from '../lib/webp2mp4.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, command }) => {
  let url
  let anu = command.replace('ed', '')
  if (m.mentionedJid && m.mentionedJid[0]) {
    let pp = await conn.profilePictureUrl(m.mentionedJid[0], 'image').catch(e => { throw `Orang yang kamu tag tidak ada PP atau PP nya sedang diprivasi` })
    let buffer = await (await fetch(pp)).buffer()
    url = await uploadImage(buffer)
  } else {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `Reply stiker/gambar`
    let img = await q.download()
    if (/webp/.test(mime)) url = await webp2png(img)
    else url = await uploadImage(img)
  }
  m.reply('_Sedang proses mengirim..._')
  let directUrl = url?.url || url
  let link = `https://some-random-api.com/canvas/overlay/${anu}ed?avatar=${encodeURIComponent(directUrl)}`
  let stiker = await sticker(null, link, 'hm', global.author)
  conn.sendFile(m.chat, stiker, 'wasted.webp', '', m)
}

handler.help = ['trigger', 'wasted'].map(v => v + ' (caption/reply)')
handler.tags = ['stickerother']
handler.command = /^(wasted|trigger(ed)?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler;
