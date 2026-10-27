import { randomBytes, randomUUID } from 'crypto';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`Masukkan pertanyaan untuk Blackbox AI!\n\n*Contoh:* ${usedPrefix + command} buatkan kode function quicksort di JavaScript`);

	const api = 'https://api.blackbox.ai/api/chat';
	const headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
		'Accept': '*/*',
		'Referer': 'https://www.blackbox.ai',
		'Content-Type': 'application/json',
		'Origin': 'https://www.blackbox.ai',
		'DNT': '1',
		'Connection': 'keep-alive'
	};

	const clear = (response) => response.replace(/\$\$(.*?)\$\$/g, '').trim();

	const BlackBox = {
		async generate(chat, options = {}, { max_retries = 3 } = {}) {
			const random_id = randomBytes(16).toString('hex');
			const random_user_id = randomUUID();

			const data = {
				messages: chat,
				id: random_id,
				userId: random_user_id,
				previewToken: null,
				codeModelMode: true,
				agentMode: {},
				trendingAgentMode: {},
				isMicMode: false,
				isChromeExt: false,
				githubToken: null,
				webSearchMode: true,
				userSystemPrompt: null,
				mobileClient: false,
				maxTokens: 4096,
				playgroundTemperature: parseFloat(options.temperature) || 0.7,
				playgroundTopP: 0.9,
				validated: '69783381-2ce4-4dbd-ac78-35e9063feabc',
			};

			try {
				const response = await fetch(api, { method: 'POST', headers, body: JSON.stringify(data) });
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${await response.text()}`);
				}

				let tc = await response.text();
				let tr = clear(tc);

				if (tr.includes('$~$')) {
					data.mode = 'continue';
					if (!data.messages.some((msg) => msg.content === tr)) {
						data.messages.push({ content: tr, role: 'assistant' });
					}
					const cor = await fetch(api, { method: 'POST', headers, body: JSON.stringify(data) });
					let ctc = await cor.text();
					tr += clear(ctc);
				}

				return tr;
			} catch (err) {
				if (max_retries > 0) {
					return this.generate(chat, options, { max_retries: max_retries - 1 });
				} else {
					throw err;
				}
			}
		}
	};

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

	try {
		const chatMessages = [{ role: 'user', content: text }];
		const responseMessage = await BlackBox.generate(chatMessages, { temperature: 0.7 });

		if (!responseMessage) throw new Error('Response kosong dari Blackbox API.');

		await conn.sendMessage(m.chat, {
			text: responseMessage,
			contextInfo: {
				externalAdReply: {
					title: 'BLACKBOX AI',
					body: 'AI Code & Chat Assistant',
					mediaType: 1,
					renderLargerThumbnail: false,
					sourceUrl: 'https://www.blackbox.ai'
				}
			}
		}, { quoted: m });
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (error) {
		console.error(error);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Error: ${error.message || error}`);
	}
};

handler.help = ['blackbox <pertanyaan>'];
handler.tags = ['ai'];
handler.command = /^(blackbox|bbox)$/i;
handler.limit = true;

export default handler;
