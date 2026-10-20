let handler = async (m, { conn, text, usedPrefix }) => {
	if (!text) return m.reply(`Silakan tentukan opsi yang ingin diatur!\n\nContoh:\n*${usedPrefix}set welcome*\n*${usedPrefix}set antilink*`);

	let teks = `*PENGATURAN [ ${text.toUpperCase()} ]*\n\nSilakan ketik perintah:\n• *${usedPrefix}on ${text}* (untuk mengaktifkan)\n• *${usedPrefix}off ${text}* (untuk mematikan)`;
	await conn.reply(m.chat, teks, m);
};

handler.help = ['set <opsi>'];
handler.tags = ['main'];
handler.command = /^set$/i;

export default handler;
