let handler = async (m, { conn, text, args }) => {
	let backgroundColor = '#7ACAA7';

	// Cek argumen warna di akhir teks (#hex atau nama)
	if (args.length > 0 && args[args.length - 1].startsWith('#')) {
		let colorInput = args.pop().slice(1);
		if (/^[0-9a-fA-F]{6}$/.test(colorInput)) {
			backgroundColor = `#${colorInput}`;
		} else {
			let hex = mapColorNameToHex(colorInput.toLowerCase());
			if (hex) backgroundColor = hex;
		}
		text = args.join(' ').trim();
	}

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
		if (!text) {
			return m.reply(
				'Masukkan teks untuk status atau kirim/reply media!\n\nContoh custom warna background:\n*.upswall Halo semua #biru*\n*.upswall Pengumuman penting #FF5733*'
			);
		}
		options = { text };
	}

	let statusJidList = Object.keys(global.db.data?.users || {}).filter((u) => u.endsWith('@s.whatsapp.net'));
	if (!statusJidList.length) statusJidList = [m.sender];

	try {
		await conn.sendMessage('status@broadcast', options, {
			backgroundColor,
			textArgb: 0xffffffff,
			font: 1,
			statusJidList,
		});
		m.reply('✅ Berhasil mengunggah status WhatsApp ke semua kontak/pengguna!');
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal mengunggah status: ${e.message}`);
	}
};

function mapColorNameToHex(name) {
	const colors = {
		merah: '#FF0000',
		biru: '#0000FF',
		hijau: '#008000',
		kuning: '#FFFF00',
		orange: '#FFA500',
		ungu: '#800080',
		putih: '#FFFFFF',
		hitam: '#000000',
		abu: '#808080',
		pink: '#FFC0CB',
		coklat: '#A52A2A',
		emas: '#FFD700',
		perak: '#C0C0C0',
	};
	return colors[name];
}

handler.help = ['upswall <teks> #<warna/hex>'];
handler.tags = ['owner'];
handler.command = /^upswall$/i;
handler.owner = true;

export default handler;
