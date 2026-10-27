import WebSocket from 'ws';

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (!/audio|video/.test(mime)) {
		return m.reply(`Reply atau kirim audio/vn/video dengan caption *${usedPrefix + command}*`);
	}

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang memproses suara Kobo Kanaeru...*_');

	try {
		let media = await q.download?.();
		if (!media) throw new Error('Gagal mengunduh file audio/video!');

		const generateRandomLetters = (length) => {
			let result = '';
			const chars = 'abcdefghijklmnopqrstuvwxyz';
			for (let i = 0; i < length; i++) {
				result += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return result;
		};

		const koboVoiceProcess = (mediaBuffer) => {
			return new Promise((resolve, reject) => {
				let session_hash = generateRandomLetters(10);
				let wss = 'wss://yanzbotz-waifu-yanzbotz.hf.space/queue/join';
				let ws = new WebSocket(wss);
				let result = {};

				const timeout = setTimeout(() => {
					try { ws.close(); } catch {}
					reject(new Error('WebSocket timeout saat memproses suara Kobo.'));
				}, 60000);

				const send_hash_payload = {
					fn_index: 0,
					session_hash: session_hash
				};

				const send_data_payload = {
					fn_index: 0,
					data: [
						{
							data: 'data:audio/wav;base64,' + mediaBuffer.toString('base64'),
							name: 'audio.wav'
						},
						0,
						'pm',
						0.6,
						false,
						false,
						'kobo'
					],
					event_data: null,
					session_hash: session_hash
				};

				ws.onopen = () => {
					// connected
				};

				ws.onmessage = (event) => {
					try {
						let message = JSON.parse(event.data);
						switch (message.msg) {
							case 'send_hash':
								ws.send(JSON.stringify(send_hash_payload));
								break;
							case 'send_data':
								ws.send(JSON.stringify(send_data_payload));
								break;
							case 'process_completed':
								if (message.output?.data?.[1]?.name) {
									result.url = 'https://yanzbotz-waifu-yanzbotz.hf.space/file=' + message.output.data[1].name;
								}
								break;
						}
					} catch (err) {
						clearTimeout(timeout);
						reject(err);
					}
				};

				ws.onclose = (event) => {
					clearTimeout(timeout);
					if (result.url) {
						resolve(result.url);
					} else {
						reject(new Error('Koneksi WebSocket ditutup sebelum proses selesai.'));
					}
				};

				ws.onerror = (err) => {
					clearTimeout(timeout);
					reject(err);
				};
			});
		};

		let voiceUrl = await koboVoiceProcess(media);
		await conn.sendFile(
			m.chat,
			voiceUrl,
			'kobo.mp3',
			'',
			m,
			true,
			{ mimetype: 'audio/mp4', ptt: true }
		);
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (error) {
		console.error(error);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Gagal memproses suara Kobo: ${error.message || error}`);
	}
};

handler.help = ['kobovoice'];
handler.tags = ['ai'];
handler.command = /^(kobovoice)$/i;
handler.limit = true;

export default handler;
