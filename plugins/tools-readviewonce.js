import { downloadContentFromMessage } from 'baileys';

let handler = async (m, { conn }) => {
	if (!m.quoted) throw 'Reply gambar/video view-once yang ingin Anda lihat';

	// Ambil dari cache (diisi oleh listener messages.upsert di handler.js),
	// karena WhatsApp menghapus mediaKey dari pesan view-once yang di-quote.
	let quotedId = m.quoted.id || m.quoted.key?.id;
	let voContent = global.__voCache?.get(quotedId);

	if (!voContent) {
		throw 'Media view-once ini tidak ada di cache (mungkin sudah kedaluwarsa, atau bot baru saja restart). Coba reply pesan view-once yang baru masuk.';
	}

	let type = Object.keys(voContent).find((k) => /imageMessage|videoMessage|audioMessage/.test(k));
	if (!type) throw 'Ini bukan pesan gambar/video/audio view-once.';

	let mediaType = type.replace('Message', '').toLowerCase(); // image | video | audio
	let stream = await downloadContentFromMessage(voContent[type], mediaType);

	let buffer = Buffer.from([]);
	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk]);
	}

	let caption = voContent[type]?.caption || '';

	if (mediaType === 'video') return conn.sendFile(m.chat, buffer, 'media.mp4', caption, m);
	if (mediaType === 'image') return conn.sendFile(m.chat, buffer, 'media.jpg', caption, m);
	if (mediaType === 'audio') return conn.sendFile(m.chat, buffer, 'media.mp3', caption, m);
};

handler.help = ['readvo'];
handler.tags = ['info', 'tools'];
handler.command = ['readviewonce', 'read', 'liat', 'readvo', 'rvo'];

export default handler;