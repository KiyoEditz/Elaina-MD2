import fetch from 'node-fetch';
import { randomBytes, randomUUID } from 'crypto';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan pertanyaan untuk GPT-4!\n\n*Contoh:* ${usedPrefix + command} buatkan rencana belajar bahasa jepang dalam 3 bulan`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

	let responseText = null;

	// 1. Coba Blackbox GPT-4o
	try {
		const data = {
			messages: [{ role: 'user', content: text }],
			id: randomBytes(16).toString('hex'),
			userId: randomUUID(),
			codeModelMode: true,
			agentMode: {},
			trendingAgentMode: {},
			userSelectedModel: 'gpt-4o',
			maxTokens: 4096,
			playgroundTemperature: 0.7,
			validated: '69783381-2ce4-4dbd-ac78-35e9063feabc'
		};

		const res = await fetch('https://api.blackbox.ai/api/chat', {
			method: 'POST',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
				'Content-Type': 'application/json',
				'Origin': 'https://www.blackbox.ai'
			},
			body: JSON.stringify(data)
		});

		if (res.ok) {
			let raw = await res.text();
			responseText = raw.replace(/\$\$(.*?)\$\$/g, '').trim();
		}
	} catch {}

	// 2. Fallback ke BetaBotz GPT-4
	if (!responseText) {
		try {
			const apiKey = global.lann || global.APIKeys?.['https://api.betabotz.eu.org'] || global.btc;
			const res = await fetch(`https://api.betabotz.eu.org/api/search/openai-chat?text=${encodeURIComponent(text)}&apikey=${apiKey}`);
			if (res.ok) {
				const json = await res.json();
				if (json.status && (json.message || json.result)) {
					responseText = json.message || json.result;
				}
			}
		} catch {}
	}

	if (!responseText) {
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		return m.reply('Maaf, server GPT-4 sedang sibuk. Silakan coba beberapa saat lagi.');
	}

	await conn.sendMessage(
		m.chat,
		{
			text: responseText,
			contextInfo: {
				externalAdReply: {
					title: 'GPT-4o (OPENAI)',
					body: 'Advanced Generative Intelligence',
					mediaType: 1,
					renderLargerThumbnail: false,
					sourceUrl: 'https://openai.com'
				}
			}
		},
		{ quoted: m }
	);
	await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['gpt4 <pertanyaan>', 'ai <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(gpt4|ai)$/i;
handler.limit = true;

export default handler;
