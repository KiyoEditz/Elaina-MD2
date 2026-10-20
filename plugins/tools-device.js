import { getDevice } from 'baileys';

let handler = async (m) => {
    let msgId = m.quoted ? m.quoted.id : m.key.id;
    let dev = getDevice(msgId);
    let deviceName = {
        'android': 'Android 📱',
        'ios': 'iOS (iPhone/iPad) 🍏',
        'web': 'WhatsApp Web 💻',
        'desktop': 'WhatsApp Desktop 🖥️',
        'unknown': 'Tidak Diketahui ❓'
    }[dev] || dev;

    m.reply(`Pesan ini dikirim menggunakan: *${deviceName}*`);
};

handler.help = ['device'];
handler.tags = ['tools'];
handler.command = /^(device)$/i;

export default handler;
