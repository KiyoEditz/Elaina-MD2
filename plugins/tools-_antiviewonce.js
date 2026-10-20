import { downloadContentFromMessage } from 'baileys';

let handler = m => m;
handler.before = async function (m, { conn }) {
    if (!m.chat || !global.db?.data?.chats?.[m.chat]?.viewonce) return;
    let q = m.quoted ? m.quoted : m;
    if (q.mtype === 'viewOnceMessageV2' || q.mtype === 'viewOnceMessage') {
        let msg = q.message?.viewOnceMessageV2?.message || q.message?.viewOnceMessage?.message || q.message;
        if (!msg) return;
        let type = Object.keys(msg).find(k => /imageMessage|videoMessage|audioMessage/.test(k));
        if (!type) return;

        let mediaType = type.replace('Message', '').toLowerCase();
        let media = await downloadContentFromMessage(msg[type], mediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let caption = msg[type]?.caption || '';
        if (mediaType === 'video') {
            return conn.sendFile(m.chat, buffer, 'media.mp4', caption, m);
        } else if (mediaType === 'image') {
            return conn.sendFile(m.chat, buffer, 'media.jpg', caption, m);
        } else if (mediaType === 'audio') {
            return conn.sendFile(m.chat, buffer, 'media.mp3', caption, m);
        }
    }
};

export default handler;
