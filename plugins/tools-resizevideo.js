import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    conn.hdr = conn.hdr || {};
    if (m.sender in conn.hdr) {
        throw 'Masih ada proses video yang belum selesai, silakan tunggu...';
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/video/.test(mime)) {
        throw `Kirim atau reply video dengan caption *${usedPrefix + command} <resolusi>*\n\nContoh:\n*${usedPrefix + command} 480p* (Pilihan: 360p, 480p, 720p)`;
    }

    let resolution = args[0]?.match(/\d{3,4}p/)?.[0] || '480p';

    conn.hdr[m.sender] = true;
    await m.reply(`Sedang memproses video ke resolusi ${resolution}...`);

    try {
        let inputBuffer = await q.download?.();
        if (!inputBuffer) throw 'Gagal mengunduh video!';

        const resized = await resizeVideo(inputBuffer, resolution);
        await conn.sendFile(m.chat, resized, `video_${resolution}.mp4`, `✨ *Video berhasil diubah ke resolusi ${resolution}!*`, m);
    } catch (e) {
        console.error(e);
        m.reply(`Gagal mengubah resolusi video: ${e.message || e}`);
    } finally {
        delete conn.hdr[m.sender];
    }
};

async function resizeVideo(buffer, resolution = '480p') {
    return new Promise((resolve, reject) => {
        let inputPath = path.join(tmpdir(), `${Date.now()}_input.mp4`);
        let outputPath = path.join(tmpdir(), `${Date.now()}_output.mp4`);
        fs.writeFileSync(inputPath, buffer);

        let scale = 'scale=-2:480';
        if (resolution === '360p') scale = 'scale=-2:360';
        else if (resolution === '720p') scale = 'scale=-2:720';
        else if (resolution === '1080p') scale = 'scale=-2:1080';

        const ffmpeg = spawn('ffmpeg', [
            '-i', inputPath,
            '-vf', scale,
            '-c:v', 'libx264',
            '-crf', '23',
            '-preset', 'veryfast',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-y',
            outputPath
        ]);

        ffmpeg.on('close', (code) => {
            try {
                if (code === 0 && fs.existsSync(outputPath)) {
                    let resultBuffer = fs.readFileSync(outputPath);
                    resolve(resultBuffer);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            } finally {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            }
        });

        ffmpeg.on('error', (err) => {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            reject(err);
        });
    });
}

handler.help = ['resizevideo <resolusi>'];
handler.tags = ['tools'];
handler.command = /^(resizevideo)$/i;
handler.limit = true;

export default handler;
