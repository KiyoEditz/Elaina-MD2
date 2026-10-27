import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
	if (!text) return m.reply(`Masukkan deskripsi gambar yang ingin dibuat!\n\n*Contoh:* ${usedPrefix + command} a futuristic cyberpunk samurai warrior in neo tokyo, 8k resolution, highly detailed`);

	await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
	m.reply(global.wait || '_*Sedang memproses gambar dengan Flux AI, mohon tunggu...*_');

	try {
		const data = await flux({ prompt: text });
		if (!data.status || !data.data?.images?.length) {
			throw new Error(data.message || 'Gagal menghasilkan gambar dari Flux AI.');
		}

		for (const imgUrl of data.data.images) {
			await conn.sendMessage(
				m.chat,
				{
					image: { url: imgUrl },
					caption: `🎨 *FLUX.1 SCHNELL AI*\n• *Prompt:* ${text}`,
				},
				{ quoted: m }
			);
		}
		await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
	} catch (e) {
		console.error(e);
		await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`Gagal generate gambar: ${e.message || e}`);
	}
};

handler.help = ['flux <prompt>', 'txt2img <prompt>'];
handler.tags = ['ai'];
handler.command = /^(flux|txt2img)$/i;
handler.limit = true;

export default handler;

function randomSessionString(length = 11) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let res = '';
	for (let i = 0; i < length; i++) {
		res += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return res;
}

async function flux(options = {}) {
	try {
		const prompt = options.prompt;
		if (!prompt) return { status: false, message: 'Prompt tidak boleh kosong!' };

		const seed = options.seed || Math.floor(Math.random() * 2147483647) + 1;
		const session_hash = randomSessionString(11);

		const joinResponse = await fetch('https://black-forest-labs-flux-1-schnell.hf.space/queue/join', {
			method: 'POST',
			headers: {
				'authority': 'black-forest-labs-flux-1-schnell.hf.space',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				data: [
					prompt,
					seed,
					true,
					options.width || 512,
					options.height || 512,
					options.steps || 8,
				],
				event_data: null,
				fn_index: 2,
				trigger_id: 5,
				session_hash: session_hash,
			}),
		});

		if (!joinResponse.ok) throw new Error('Gagal menghubungi queue server Flux.');

		const dataResponse = await fetch(
			`https://black-forest-labs-flux-1-schnell.hf.space/queue/data?session_hash=${session_hash}`,
			{
				headers: {
					'authority': 'black-forest-labs-flux-1-schnell.hf.space',
				},
			}
		);

		if (!dataResponse.ok) throw new Error('Gagal mengambil data output dari Flux.');

		const rawData = await dataResponse.text();
		const lines = rawData.split('\n');
		const jsonObjects = [];

		lines.forEach((line) => {
			if (line.startsWith('data: ')) {
				try {
					const jsonString = line.substring(6).trim();
					jsonObjects.push(JSON.parse(jsonString));
				} catch {}
			}
		});

		const result = jsonObjects.find((d) => d.msg === 'process_completed') || {};
		if (!result?.success) {
			return {
				status: false,
				message: result?.message || 'Proses pembuatan gambar tidak selesai.',
			};
		}

		const images = (result.output?.data || [])
			.filter((d) => typeof d === 'object' && d?.url)
			.map((d) => d.url);

		if (!images.length) {
			return { status: false, message: 'Tidak ada URL gambar yang ditemukan.' };
		}

		return {
			status: true,
			data: { images },
		};
	} catch (e) {
		return {
			status: false,
			message: e.message || String(e),
		};
	}
}
