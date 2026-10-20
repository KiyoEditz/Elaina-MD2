import { generateWAMessageContent } from 'baileys';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (m.quoted ? m.quoted : m.msg)?.mimetype || '';

    if (!/video|gif/i.test(mime)) {
        return m.reply(`Kirim atau reply video dengan caption *${usedPrefix + command}* untuk diubah menjadi Video Note (PTV bulat)!`);
    }

    await m.reply('Sedang mengubah video ke Video Note (PTV)...');

    try {
        let media = await q.download?.();
        if (!media) throw 'Gagal mengunduh video!';

        let msg = await generateWAMessageContent(
            {
                video: media,
            },
            {
                upload: conn.waUploadToServer,
            }
        );

        await conn.relayMessage(
            m.chat,
            {
                ptvMessage: msg.videoMessage,
            },
            {
                quoted: m,
            }
        );
    } catch (e) {
        m.reply(`Gagal membuat PTV: ${e.message || e}`);
    }
};

handler.help = ['toptv [reply media]'];
handler.tags = ['tools'];
handler.command = /^(toptv|ptv)$/i;

export default handler;
