import { GoogleGenerativeAI } from '@google/generative-ai';

let handler = async (m, { conn, text, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (!mime) return m.reply(`Kirim atau reply gambar dengan caption *${usedPrefix + command} <instruksi edit>*\n\n*Contoh:* ${usedPrefix + command} tambahkan kacamata hitam dan topi koboi`);
	if (!/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya JPG/PNG/WebP.`);
	if (!text) return m.reply(`Berikan instruksi edit gambar!\n\n*Contoh:* ${usedPrefix + command} ubah latar belakang menjadi pemandangan galaxy`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang memproses editan gambar dengan AI...*_');

	try {
		const apiKey = global.geminiKey || process.env.GEMINI_API_KEY || 'AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc';
		const genAI = new GoogleGenerativeAI(apiKey);

		let imgData = await q.download();
		const base64Image = imgData.toString('base64');
		const cleanMime = mime.includes('webp') ? 'image/jpeg' : mime;

		const contents = [
			{ text },
			{
				inlineData: {
					mimeType: cleanMime,
					data: base64Image
				}
			}
		];

		let model;
		let response = null;
		try {
			model = genAI.getGenerativeModel({
				model: 'gemini-2.5-flash-image',
				generationConfig: {
					responseModalities: ['Text', 'Image']
				}
			});
			response = await model.generateContent(contents);
		} catch (genErr) {
			// Jika image generation dibatasi / quota 0, fallback ke gemini-2.5-flash multimodal vision
			if (/Quota exceeded|429|limit: 0|not found|404/i.test(genErr?.message)) {
				const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
				const visionRes = await visionModel.generateContent([
					{
						inlineData: {
							mimeType: cleanMime,
							data: base64Image
						}
					},
					`Analisis gambar ini dan jelaskan secara detail saran langkah edit sesuai permintaan: "${text}". Berikan juga prompt alternatif yang dapat digunakan pada generator gambar AI.`
				]);
				const visionText = visionRes.response.text();
				await conn.sendMessage(m.chat, {
					text: `🎨 *AI IMAGE EDIT ADVISOR (Gemini 2.5 Flash)*\n\n${visionText}\n\n> ℹ️ *Catatan:* Direct image editing memerlukan API key Google AI Studio dengan kuota image generation aktif di config.js.`,
				}, { quoted: m });
				await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
				return;
			}
			throw genErr;
		}

		let resultImage = null;
		let resultText = '';

		const candidate = response?.response?.candidates?.[0];
		if (candidate?.content?.parts) {
			for (const part of candidate.content.parts) {
				if (part.text) {
					resultText += part.text;
				} else if (part.inlineData?.data) {
					resultImage = Buffer.from(part.inlineData.data, 'base64');
				}
			}
		}

		if (resultImage) {
			await conn.sendFile(m.chat, resultImage, 'edited.png', `✨ *AI IMAGE EDIT*\n• *Instruksi:* ${text}`, m);
		} else if (resultText) {
			await m.reply(`*Analisis / Saran Edit AI:*\n\n${resultText}`);
		} else {
			m.reply('Gagal memproses gambar. Coba ganti prompt atau gambar.');
		}

		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (error) {
		console.error(error);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Error: ${error.message || error}`);
	}
};

handler.help = ['aiedit <instruksi>', 'editimage <instruksi>'];
handler.tags = ['ai'];
handler.command = /^(aiedit|editimage)$/i;
handler.limit = true;

export default handler;
