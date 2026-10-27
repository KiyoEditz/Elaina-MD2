import fetch from 'node-fetch';
import { randomBytes, randomUUID } from 'crypto';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan pertanyaan untuk Claude AI!\n\n*Contoh:* ${usedPrefix + command} jelaskan perbedaan SQL vs NoSQL secara mendalam`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

	const antroKeys = [
		...(global.claudeKey ? [global.claudeKey] : []),
		...(Array.isArray(global.anthropicKeys) ? global.anthropicKeys : [])
	];

	let responseText = null;

	// 1. Coba Anthropic Direct API
	for (const key of antroKeys) {
		try {
			const res = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'x-api-key': key,
					'anthropic-version': '2023-06-01',
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					model: 'claude-3-5-sonnet-20240620',
					max_tokens: 4000,
					temperature: 0.7,
					system: 'Jawablah dalam bahasa Indonesia dengan jelas, ramah, dan terstruktur.',
					messages: [{ role: 'user', content: text }]
				})
			});

			if (res.ok) {
				const data = await res.json();
				if (data.content?.[0]?.text) {
					responseText = data.content[0].text;
					break;
				}
			}
		} catch {}
	}

	// 2. Fallback ke Blackbox Claude mode jika kuota direct key habis
	if (!responseText) {
		try {
			const data = {
				messages: [{ role: 'user', content: text }],
				id: randomBytes(16).toString('hex'),
				userId: randomUUID(),
				codeModelMode: true,
				agentMode: {},
				trendingAgentMode: {},
				userSelectedModel: 'claude-sonnet-3.5',
				maxTokens: 4096,
				playgroundTemperature: 0.7,
				validated: '69783381-2ce4-4dbd-ac78-35e9063feabc'
			};

			const bbRes = await fetch('https://api.blackbox.ai/api/chat', {
				method: 'POST',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
					'Content-Type': 'application/json',
					'Origin': 'https://www.blackbox.ai'
				},
				body: JSON.stringify(data)
			});

			if (bbRes.ok) {
				let raw = await bbRes.text();
				responseText = raw.replace(/\$\$(.*?)\$\$/g, '').trim();
			}
		} catch {}
	}

	if (!responseText) {
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		return m.reply('Maaf, semua server Claude AI sedang sibuk. Coba beberapa saat lagi.');
	}

	await conn.sendMessage(
		m.chat,
		{
			text: responseText,
			contextInfo: {
				externalAdReply: {
					title: 'CLAUDE 3.5 SONNET',
					body: 'Anthropic AI Assistant',
					mediaType: 1,
					renderLargerThumbnail: false,
					sourceUrl: 'https://claude.ai'
				}
			}
		},
		{ quoted: m }
	);
	await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.help = ['claude <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(claude)$/i;
handler.limit = true;

export default handler;
