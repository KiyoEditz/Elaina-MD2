import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan pertanyaan untuk LLaMA AI!\n\n*Contoh:* ${usedPrefix + command} jelaskan apa itu quantum computing`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

	try {
		let response = await fetch(`https://restapii.rioooxdzz.web.id/api/llama?message=${encodeURIComponent(text)}`);
		if (!response.ok) throw new Error(`HTTP ${response.status}: Request API gagal`);

		let result = await response.json();
		let replyText = result?.data?.response || result?.response || result?.result || result?.message;

		if (!replyText) throw new Error('Response kosong dari API LLaMA.');

		await m.reply(replyText.trim());
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (error) {
		console.error(error);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Error: ${error.message || error}`);
	}
};

handler.help = ['llama <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(llama|ilama|aillama)$/i;
handler.limit = true;

export default handler;
