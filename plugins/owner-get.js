import axios from 'axios';
import path from 'path';

let handler = async (m, { conn, text }) => {
	if (!text) return m.reply('Masukkan URL yang ingin diakses!\nContoh: *.get https://api.github.com*');
	if (!/^https?:\/\//i.test(text)) text = 'https://' + text;

	try {
		await m.reply('⏳ _Mengambil data dari URL..._');
		const response = await axios.get(text, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
			},
			responseType: 'arraybuffer',
			timeout: 30000,
		});

		const contentType = response.headers['content-type'] || '';
		const ext = path.extname(text).toLowerCase();

		if (/json/i.test(contentType)) {
			const jsonData = JSON.parse(Buffer.from(response.data).toString('utf8'));
			return m.reply(JSON.stringify(jsonData, null, 2));
		} else if (/text|html/i.test(contentType) && !/image|video|audio/i.test(contentType)) {
			const textData = Buffer.from(response.data).toString('utf8');
			return m.reply(textData.slice(0, 5000));
		} else if (/image/i.test(contentType) || ['.jpg', '.jpeg', '.png'].includes(ext)) {
			return conn.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
		} else if (/video/i.test(contentType) || ['.mp4', '.mkv'].includes(ext)) {
			return conn.sendMessage(m.chat, { video: Buffer.from(response.data) }, { quoted: m });
		} else if (/audio/i.test(contentType) || ['.mp3', '.ogg', '.opus'].includes(ext)) {
			return conn.sendMessage(m.chat, { audio: Buffer.from(response.data) }, { quoted: m });
		} else {
			const fileName = path.basename(text.split('?')[0]) || 'downloaded_file';
			return conn.sendMessage(
				m.chat,
				{
					document: Buffer.from(response.data),
					fileName: fileName,
					mimetype: contentType || 'application/octet-stream',
				},
				{ quoted: m }
			);
		}
	} catch (error) {
		console.error(error);
		m.reply(`❌ Terjadi kesalahan saat mengakses URL: ${error.message}`);
	}
};

handler.help = ['get <url>'];
handler.tags = ['owner', 'tools'];
handler.command = /^(get)$/i;
handler.owner = true;

export default handler;
