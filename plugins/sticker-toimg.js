import { readFileSync as read, unlinkSync as remove } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { tmpdir } from 'os';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        if (!m.quoted) throw `Balas stiker dengan caption *${usedPrefix + command}*`
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) throw `Balas stiker gif dengan caption *${usedPrefix + command}*`

        // Mendapatkan path sementara untuk file hasil konversi
        let file = path.join(tmpdir(), `${Date.now()}.png`)
        let media = await conn.downloadAndSaveMediaMessage(q, path.join(tmpdir(), `${Date.now()}.webp`))

        // Eksekusi konversi dari webp ke png menggunakan ffmpeg
        exec(`ffmpeg -i ${media} ${file}`, (err, stderr, stdout) => {
            // Hapus file sumber setelah konversi selesai
            remove(media)

            if (err) {
                conn.reply(m.chat, `🚩 Konversi gagal.`, m)
                return
            }

            // Baca file hasil konversi dan kirim sebagai gambar
            const buffer = read(file)
            conn.sendFile(m.chat, buffer, '', '', m)
            remove(file)
        })
    } catch (e) {
        console.log(e)
        throw `Terjadi Kesalahan!\nCode: ${e}`
    }
}

handler.help = ['toimg (balas stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i

export default handler;