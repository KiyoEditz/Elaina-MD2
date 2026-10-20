import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { remini } from '../lib/hdvid.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/video/.test(mime)) {
        throw `Kirim atau reply video dengan caption *${usedPrefix + command} <fps>*\nContoh: *${usedPrefix + command} 30*`;
    }

    let seconds = (q.msg || q).seconds || 0;
    if (seconds > 30) throw 'Maksimal durasi video adalah 30 detik!';

    let fps = parseInt(text) || 24;
    if (fps > 30) throw 'Maksimal 30 FPS!';

    await conn.sendMessage(m.chat, {
        text: '⏳ *Sedang memproses video...*\nProses ini mengekstrak dan menjernihkan frame per frame. Mohon tunggu beberapa saat.'
    }, { quoted: m });

    const timestamp = Date.now();
    const chdir = path.resolve('tmp');
    const senderClean = (m.sender || 'user').replace(/[^a-zA-Z0-9]/g, '_');
    const pndir = path.join(chdir, `${senderClean}_${timestamp}`);
    const fdir = path.join(pndir, 'frames');
    const rfdir = path.join(pndir, 'results');
    const rname = path.join(pndir, 'output.mp4');

    [chdir, pndir, fdir, rfdir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    try {
        const mediaBuffer = await q.download?.();
        if (!mediaBuffer) throw 'Gagal mengunduh media video!';

        const inputPath = path.join(pndir, 'input.mp4');
        fs.writeFileSync(inputPath, mediaBuffer);

        // Ekstrak frames
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i "${inputPath}" -vf "fps=${fps}" "${path.join(fdir, 'frame-%04d.png')}"`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const images = fs.readdirSync(fdir).filter(f => f.endsWith('.png'));
        if (images.length === 0) throw 'Gagal mengekstrak frame dari video!';

        // Enhance frames batching to prevent network timeout
        for (let i = 0; i < images.length; i++) {
            const imgPath = path.join(fdir, images[i]);
            const enhancedBuf = await remini(fs.readFileSync(imgPath), 'enhance').catch(() => null);
            if (enhancedBuf) {
                fs.writeFileSync(path.join(rfdir, images[i]), enhancedBuf);
            } else {
                fs.copyFileSync(imgPath, path.join(rfdir, images[i]));
            }
        }

        // Gabung kembali frame ke MP4
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -y -framerate ${fps} -i "${path.join(rfdir, 'frame-%04d.png')}" -i "${inputPath}" -c:v libx264 -pix_fmt yuv420p -c:a aac -strict experimental -shortest "${rname}"`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!fs.existsSync(rname)) throw 'Gagal merender video output!';
        await conn.sendMessage(m.chat, {
            video: fs.readFileSync(rname),
            caption: '✨ *Video berhasil dijernihkan!*'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`Gagal memproses HD Video: ${e.message || e}`);
    } finally {
        try {
            fs.rmSync(pndir, { recursive: true, force: true });
        } catch {}
    }
};

handler.help = ['hdvid <fps>'];
handler.tags = ['tools'];
handler.command = ['hdvid'];
handler.limit = true;

export default handler;
