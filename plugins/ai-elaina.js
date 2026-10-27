import { GoogleGenerativeAI } from '@google/generative-ai';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) {
		return m.reply(`Halo! Aku Elaina, asisten AI kamu ✨\nAda yang bisa kubantu?\n\n*Contoh:* ${usedPrefix + command} ceritakan tentang petualanganmu`);
	}

	await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

	try {
		const apiKey = global.geminiKey || process.env.GEMINI_API_KEY || 'AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc';
		const genAI = new GoogleGenerativeAI(apiKey);

		const systemPrompt = `Kamu adalah Elaina, penyihir pengelana (The Wandering Witch) dan asisten AI terbaik. 
Karaktermu cerdas, anggun, sedikit narsis dengan cara yang menggemaskan, sopan, manis, dan suka membantu. 
Gunakan bahasa Indonesia yang santai, ekspresif, dan sesekali gunakan sentuhan penyihir atau emoji magis seperti ✨🪄.`;

		let model;
		try {
			model = genAI.getGenerativeModel({
				model: 'gemini-2.5-flash',
				systemInstruction: systemPrompt
			});
		} catch {
			try {
				model = genAI.getGenerativeModel({
					model: 'gemini-3.5-flash',
					systemInstruction: systemPrompt
				});
			} catch {
				try {
					model = genAI.getGenerativeModel({
						model: 'gemini-flash-latest',
						systemInstruction: systemPrompt
					});
				} catch {
					model = genAI.getGenerativeModel({
						model: 'gemini-1.5-flash',
						systemInstruction: systemPrompt
					});
				}
			}
		}

		const result = await model.generateContent(text);
		const response = result.response.text();

		if (!response) throw new Error('Response kosong dari Elaina AI.');

		await conn.sendMessage(
			m.chat,
			{
				text: response,
				contextInfo: {
					externalAdReply: {
						title: '✦ ELAINA AI ASSISTANT ✦',
						body: 'The Wandering Witch',
						thumbnailUrl: 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg',
						mediaType: 1,
						renderLargerThumbnail: true,
						sourceUrl: 'https://github.com/KiyoEditz/Elaina-MD2'
					}
				}
			},
			{ quoted: m }
		);
	} catch (error) {
		console.error(error);
		m.reply(`Maaf ya, sihir Elaina sedang ada gangguan: ${error.message || error}`);
	}
};

handler.help = ['elaina <pertanyaan>', 'aielaina <pertanyaan>'];
handler.tags = ['ai', 'fun'];
handler.command = /^(elaina|aielaina)$/i;
handler.limit = false;

export default handler;
