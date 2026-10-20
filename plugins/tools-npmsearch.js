import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nama package NPM yang ingin dicari!\n\nContoh:\n*${usedPrefix + command} baileys*`;
    let res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(text.trim())}`);
    let { objects = [] } = await res.json();
    if (!objects.length) throw `Package NPM dengan nama *"${text.trim()}"* tidak ditemukan!`;

    let txt = objects.slice(0, 10).map(({ package: pkg }) => {
        return `📦 *${pkg.name}* (v${pkg.version})\n` +
            `🔗 _${pkg.links?.npm || 'https://www.npmjs.com/package/' + pkg.name}_\n` +
            `📝 _${pkg.description || 'Tidak ada deskripsi'}_`;
    }).join('\n\n');

    let caption = `╭──── 〔 *NPM PACKAGE SEARCH* 〕 ─⬣
│ 🔎 *Query*: ${text.trim()}
│ 📊 *Hasil*: ${objects.length} package ditemukan
╰────────────────────────⬣\n\n${txt}`;

    m.reply(caption);
};

handler.help = ['npmsearch <nama_package>'];
handler.tags = ['tools'];
handler.command = /^npm(js|search)?$/i;

export default handler;
