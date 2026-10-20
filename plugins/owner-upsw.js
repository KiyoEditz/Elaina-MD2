let handler = async (m, { conn, text }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || q.mediaType || '';
	let caption = m.quoted ? text || m.quoted.text || '' : text;

	let options = {};
	if (/image/.test(mime)) {
		let media = await q.download();
		options = { image: media, caption };
	} else if (/video/.test(mime)) {
		let media = await q.download();
		options = { video: media, caption };
	} else if (/audio/.test(mime)) {
		let media = await q.download();
		options = { audio: media, ptt: true };
	} else {
		if (!text) return m.reply('Masukkan teks atau reply media yang ingin diunggah ke status WhatsApp!');
		options = { text };
	}

	let statusJidList = [];
	if (m.isGroup) {
		let meta = await conn.groupMetadata(m.chat).catch(() => null);
		if (meta?.participants) {
			statusJidList = meta.participants.map((p) => p.id);
		}
	}
	if (!statusJidList.length) {
		statusJidList = Object.keys(global.db.data?.users || {}).filter((u) => u.endsWith('@s.whatsapp.net'));
	}

	try {
		await conn.sendMessage('status@broadcast', options, {
			backgroundColor: '#7ACAA7',
			textArgb: 0xffffffff,
			font: 1,
			statusJidList,
		});
		m.reply('✅ Berhasil mengunggah status WhatsApp!');
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal mengunggah status: ${e.message}`);
	}
};

handler.help = ['upsw <teks/media>'];
handler.tags = ['owner'];
handler.command = /^upsw$/i;
handler.owner = true;

export default handler;
