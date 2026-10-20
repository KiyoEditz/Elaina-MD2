import uploadFile from '../lib/uploadFile.js';
import { UguuSe } from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';
import { webp2png } from '../lib/webp2mp4.js';

let handler = async (m, { conn, text, usedPrefix, isPrems, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!(/image\/(jpe?g|png)|webp/.test(mime))) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command} Hai | kamu`
  let [t1, t2] = text.split`|`
  if (!t1) throw `_Masukkan teks!_\n\nContoh:\n ${usedPrefix + command} teks | kamu(optional)`
  if (!t2) {
    t2 = t1
    t1 = '_'
  }

  let img = await q.download()
  let link
  if (/webp/.test(mime)) {
    link = await webp2png(img)
  } else {
    link = await UguuSe(img).catch(e => uploadFile(img))
  }
  let bgUrl = link?.url || link
  let hasil = global.API('https://api.memegen.link', `/images/custom/${encodeURIComponent(t1.trim())}/${encodeURIComponent(t2.trim())}.png`, {
    background: bgUrl
  })
  let sender = global.db.data.users[m.sender]
  let author = isPrems ? sender.name : global.author
  let stiker = await sticker(false, hasil, 'mememaker', author)
  conn.sendFile(m.chat, stiker, 'stikermeme.webp', '', m)
}
handler.help = ['smeme', 'stikermeme'].map(v => v + ' <teks|teks>')
handler.tags = ['stickerother']
handler.command = /^(s(tic?ker)?meme)$/i

export default handler;
