import { npmstalk } from '../lib/npmstalk.js';

let handler = async (m, { command, text, conn, usedPrefix }) => {
    if (!text) throw `Masukkan nama package NPM!\n\nContoh:\n*${usedPrefix + command} baileys*`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let res = await npmstalk(text.trim());
        if (!res) throw 'Data tidak ditemukan';

        let capt = `╭──── 〔 *NPM STALK* 〕 ─⬣
│ 📦 *Nama Package* : ${res.name}
│ 🔖 *Versi Terbaru* : ${res.versionLatest}
│ 🔄 *Total Update*  : ${res.versionUpdate} versi
│ 📅 *Versi Pertama* : ${res.versionPublish}
│ 🛠️ *Dep. Terbaru*  : ${res.latestdependecies} dependencies
│ 📦 *Dep. Rilis*    : ${res.publishdependecies} dependencies
│ 🕒 *Waktu Dibuat*  : ${res.publishTime}
│ 🚀 *Update Terakhir*: ${res.latestPublishTime}
│ 🔗 *NPM Link*      : https://www.npmjs.com/package/${res.name}
╰────────────────────────⬣`;

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        m.reply(capt);
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        conn.reply(m.chat, `Package *"${text.trim()}"* tidak ditemukan di registry NPM.`, m);
    }
};

handler.help = ['npmstalk <nama_package>'];
handler.tags = ['tools'];
handler.command = /^(npmstalk)$/i;

export default handler;
