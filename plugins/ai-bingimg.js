import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan prompt deskripsi gambar!\n\n*Contoh:* ${usedPrefix + command} origami representation of cat, vibrant colors, studio lighting`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang membuat gambar dari Bing Image Creator...*_');

	try {
		const apiKey = global.alya || global.APIKeys?.['https://api.alyachan.dev/'] || 'syah11';
		const url = `https://api.alyachan.dev/api/bing-image?q=${encodeURIComponent(text)}&apikey=${apiKey}`;
		let res = await fetch(url).catch(() => null);

		if (res && res.ok) {
			const json = await res.json().catch(() => null);
			if (json?.data && Array.isArray(json.data) && json.data.length) {
				let caption = `🎨 *BING IMAGE CREATOR*\n• *Prompt:* ${text}`;
				for (let item of json.data.slice(0, 4)) {
					let imgUrl = typeof item === 'string' ? item : item.url;
					if (imgUrl) {
						await conn.sendFile(m.chat, imgUrl, 'bing.jpg', caption, m);
					}
				}
				await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
				return;
			}
		}

		// Fallback ke LOLHuman DALL-E jika AlyaChan bermasalah
		const lolkey = global.lolkey || global.APIKeys?.['https://api.lolhuman.xyz'] || 'd5d9e369ab0bf0c231d43b17';
		const lolRes = await fetch(`https://api.lolhuman.xyz/api/dall-e?apikey=${lolkey}&text=${encodeURIComponent(text)}`);
		if (lolRes.ok) {
			const buffer = await lolRes.buffer();
			await conn.sendFile(m.chat, buffer, 'ai-image.jpg', `🎨 *AI IMAGE CREATOR*\n• *Prompt:* ${text}`, m);
			await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
			return;
		}

		throw new Error('Semua server image generator sedang tidak merespon.');
	} catch (e) {
		console.error(e);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Gagal generate gambar Bing: ${e.message || e}`);
	}
};

handler.help = ['bingimg <prompt>', 'bingimage <prompt>'];
handler.tags = ['ai'];
handler.command = /^(bing-img|bingimg|bingimage)$/i;
handler.limit = true;

export default handler;
