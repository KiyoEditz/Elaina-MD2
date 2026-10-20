import { format } from 'util';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

let fontPath = path.resolve('src/font/Zahraaa.ttf');
let inputPath = path.resolve('src/kertas/magernulis1.jpg');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let teks = args.join(' ') || (m.quoted && m.quoted.text);
    if (!teks) throw `Masukkan teks yang ingin ditulis di buku!\n\nContoh:\n*${usedPrefix + command} Tugas Matematika Bab 3...*`;

    let d = new Date();
    let tgl = d.toLocaleDateString('id-ID');
    let hari = d.toLocaleDateString('id-ID', { weekday: 'long' });

    let hasMagick = global.support?.magick || global.support?.gm;

    if (hasMagick && fs.existsSync(fontPath) && fs.existsSync(inputPath)) {
        let bufs = [];
        const [_spawnprocess, ..._spawnargs] = [
            ...(global.support?.gm ? ['gm'] : ['magick']),
            'convert',
            inputPath,
            '-font', fontPath,
            '-size', '1024x784',
            '-pointsize', '20',
            '-interline-spacing', '1',
            '-annotate', '+806+78', hari,
            '-font', fontPath,
            '-size', '1024x784',
            '-pointsize', '18',
            '-interline-spacing', '1',
            '-annotate', '+806+102', tgl,
            '-font', fontPath,
            '-size', '1024x784',
            '-pointsize', '20',
            '-interline-spacing', '-7.5',
            '-annotate', '+344+142', teks,
            'jpg:-'
        ];

        spawn(_spawnprocess, _spawnargs)
            .on('error', () => {
                fallbackOnline(m, conn, teks);
            })
            .on('close', (code) => {
                if (code === 0 && bufs.length > 0) {
                    conn.sendFile(m.chat, Buffer.concat(bufs), 'nulis.jpg', '✨ *Hasil Nulis di Buku:*\nHati-hati ketahuan guru :v', m);
                } else {
                    fallbackOnline(m, conn, teks);
                }
            })
            .stdout.on('data', chunk => bufs.push(chunk));
    } else {
        await fallbackOnline(m, conn, teks);
    }
};

async function fallbackOnline(m, conn, teks) {
    try {
        await m.reply('Sedang menulis di kertas...');
        let url = `https://api.siputzx.my.id/api/m/nulis?text=${encodeURIComponent(teks)}`;
        await conn.sendFile(m.chat, url, 'nulis.jpg', '✨ *Hasil Nulis di Buku:*', m);
    } catch (e) {
        m.reply('Gagal menulis: ' + (e.message || e));
    }
}

handler.help = ['nulis <teks>'];
handler.tags = ['tools'];
handler.command = /^nulis$/i;

export default handler;
