import { GoogleGenerativeAI } from '@google/generative-ai';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (!mime) return m.reply(`Kirim atau reply foto dengan caption *${usedPrefix + command}*`);
	if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya JPG/PNG.`);

	let promptText = text || 'Ubah warna kulit karakter pada gambar tersebut menjadi hitam/gelap secara natural, tanpa mengubah bentuk rambut, pakaian, dan latar belakang.';

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply('_*Sedang memproses perubahan warna kulit (Hytam)...*_');

	try {
		const apiKey = global.geminiKey || process.env.GEMINI_API_KEY || 'AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc';
		const genAI = new GoogleGenerativeAI(apiKey);

		let imgData = await q.download();
		const base64Image = imgData.toString('base64');
		const cleanMime = mime.includes('webp') ? 'image/jpeg' : mime;

		const contents = [
			{ text: promptText },
			{
				inlineData: {
					mimeType: cleanMime,
					data: base64Image
				}
			}
		];

		let model;
		try {
			model = genAI.getGenerativeModel({
				model: 'gemini-2.5-flash-image',
				generationConfig: {
					responseModalities: ['Text', 'Image']
				}
			});
		} catch {
			model = genAI.getGenerativeModel({
				model: 'gemini-3.1-flash-image',
				generationConfig: {
					responseModalities: ['Text', 'Image']
				}
			});
		}

		const response = await model.generateContent(contents);
		let resultImage = null;

		const candidate = response?.response?.candidates?.[0];
		if (candidate?.content?.parts) {
			for (const part of candidate.content.parts) {
				if (part.inlineData?.data) {
					resultImage = Buffer.from(part.inlineData.data, 'base64');
					break;
				}
			}
		}

		if (resultImage) {
			await conn.sendFile(m.chat, resultImage, 'hytam.png', '✨ *Hasil AI Skin Tone: Hytam*', m);
			await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
		} else {
			m.reply('Gagal memproses gambar. Pastikan wajah atau karakter terlihat jelas pada foto.');
		}
	} catch (error) {
		console.error(error);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		let errMsg = error?.message || error;
		if (/Quota exceeded|429|limit: 0/i.test(errMsg)) {
			m.reply(`*Google Gemini Error:* API Key Gemini saat ini tidak memiliki kuota fitur image generation (Free tier limit: 0).\n\nUntuk menggunakan fitur ini, gunakan API Key Google AI Studio yang mengaktifkan billing / kuota image generation di config.js:\n\`global.geminiKey = 'AIzaSy...'\``);
		} else {
			m.reply(`Error: ${errMsg}`);
		}
	}
};

handler.help = ['hytam'];
handler.tags = ['ai'];
handler.command = /^(hytam)$/i;
handler.limit = true;

export default handler;
