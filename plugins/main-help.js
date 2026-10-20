let handler = async (m, { conn, usedPrefix }) => {
	let teks = `
Halo *${m.name || 'Kak'}*! 👋

Aku adalah *${global.namebot || 'Elaina-MD'}*, bot otomatis WhatsApp.
Berikut panduan singkat untuk memulai:

📌 *Perintah Utama:*
• *${usedPrefix}menu* : Menampilkan seluruh menu & daftar fitur bot
• *${usedPrefix}daftar* : Registrasi akun kamu ke database bot
• *${usedPrefix}ping* : Mengecek kecepatan respon server bot
• *${usedPrefix}owner* : Kontak pemilik bot
• *${usedPrefix}report <teks>* : Melaporkan error / kendala fitur ke owner

Silakan ketik *${usedPrefix}menu* untuk menjelajahi seluruh fitur!
`.trim();

	await conn.reply(m.chat, teks, m);
};

handler.help = ['help'];
handler.tags = ['main'];
handler.command = /^(help)$/i;

export default handler;
