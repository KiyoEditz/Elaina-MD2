import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (!mime) return m.reply(`Kirim atau reply gambar dengan caption *${usedPrefix + command}*`);
	if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya JPG/PNG.`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang mengubah foto menjadi anime...*_');

	try {
		let media = await q.download();
		let url = await uploadImage(media);

		let lolkey = global.lolkey || global.APIKeys?.['https://api.lolhuman.xyz'] || global.APIKeys?.['http://api.lolhuman.xyz'] || 'd5d9e369ab0bf0c231d43b17';
		let res = await fetch(`https://api.lolhuman.xyz/api/imagetoanime?apikey=${lolkey}&img=${encodeURIComponent(url)}`);

		if (!res.ok) {
			// Fallback ke Betabotz
			let lannKey = global.lann || global.APIKeys?.['https://api.betabotz.eu.org'] || 'XwxIaeoY';
			res = await fetch(`https://api.betabotz.eu.org/api/maker/jadianime?url=${encodeURIComponent(url)}&apikey=${lannKey}`);
		}

		if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memproses gambar anime.`);

		let buffer = await res.buffer();
		await conn.sendFile(m.chat, buffer, 'anime.jpg', '✨ *Hasil Foto Jadi Anime*', m);
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (e) {
		console.error(e);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Gagal mengubah ke anime: ${e.message || e}`);
	}
};

handler.help = ['toanime', 'jadianime'];
handler.tags = ['ai', 'anime'];
handler.command = /^(toanime|jadianime|imganime)$/i;
handler.limit = true;

export default handler;
