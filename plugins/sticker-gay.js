import uploadImage from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';
import { webp2png } from '../lib/webp2mp4.js';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command}`
    let img = await q.download()
    let url
    if (/webp/.test(mime)) {
      url = await webp2png(img)
    } else {
      url = await uploadImage(img)
    }
    let wasted = `https://some-random-api.com/canvas/overlay/gay?avatar=${encodeURIComponent(url)}`
    let stiker = await sticker(null, wasted, 'LGBT -_-', global.author)
    conn.sendFile(m.chat, stiker, 'sgay.webp', '', m)
  } catch (e) {
    throw '_Error.._'
  }
}
handler.help = ['stikergay (caption|reply gambar)']
handler.tags = ['stickerother']
handler.command = /^sgay$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler;
