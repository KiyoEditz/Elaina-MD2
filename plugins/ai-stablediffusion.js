import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan prompt untuk Stable Diffusion!\n\n*Contoh:* ${usedPrefix + command} 1girl, beautiful anime, detailed eyes, pastel colors`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang memproses gambar dengan Stable Diffusion...*_');

	try {
		let res = await fetch(`https://aemt.me/v5/text2img?text=${encodeURIComponent(text)}`);
		if (!res.ok) {
			// Fallback ke endpoint alternatif
			let lannKey = global.lann || global.APIKeys?.['https://api.betabotz.eu.org'] || 'XwxIaeoY';
			res = await fetch(`https://api.betabotz.eu.org/api/maker/stablediffusion?text=${encodeURIComponent(text)}&apikey=${lannKey}`);
		}

		if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memproses Stable Diffusion.`);

		let buffer = await res.buffer();
		await conn.sendFile(m.chat, buffer, 'stablediffusion.jpg', `🎨 *STABLE DIFFUSION AI*\n• *Prompt:* ${text}`, m);
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (e) {
		console.error(e);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Gagal membuat gambar: ${e.message || e}`);
	}
};

handler.help = ['stablediffusion <prompt>', 'sd <prompt>'];
handler.tags = ['ai'];
handler.command = /^(stablediffusion|sd)$/i;
handler.limit = true;

export default handler;
