import teradlx from '../lib/terabox.js';

let handler = async (m, { conn, command, text, args, usedPrefix }) => {
    if (!text) {
        throw `_*Link-nya mana?!*_\n\nContoh:\n${usedPrefix}${command} https://www.terabox.app/wap/share/filelist?surl=qx26_6N3phpSAfwtefjT-g`;
    }

    try {
        conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

        const response = await teradlx(text);
        if (!response || !response.download) {
            throw 'Gagal mendapatkan tautan unduhan dari TeraBox.';
        }
        const { filename, size, download } = response;

        let capt = `╭──── 〔 TERABOX 〕 ─⬣\n` +
                   ` ⬡ *Title* : ${filename}\n` +
                   ` ⬡ *Size* : ${size}\n` +
                   `╰────────⬣`;

        await conn.sendMessage(
            m.chat,
            {
                document: { url: download },
                mimetype: getMimeType(filename),
                fileName: filename,
                caption: capt,
            },
            { quoted: m }
        );
    } catch (e) {
        throw `Error: ${e.message || e}`;
    }
};

function getMimeType(filename) {
    const extension = filename?.split('.').pop().toLowerCase();
    const mimeTypes = {
        zip: 'application/zip',
        rar: 'application/x-rar-compressed',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        mkv: 'video/x-matroska',
        mp3: 'audio/mpeg',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        txt: 'text/plain',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        default: 'application/octet-stream',
    };

    return mimeTypes[extension] || mimeTypes.default;
}

handler.help = ['teraboxdl <url>'];
handler.command = /^(teraboxdl|teradl|terabox)$/i;
handler.tags = ['downloader'];
handler.premium = false;

export default handler;
