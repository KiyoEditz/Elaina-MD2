/**
 * Fitur JadiBot (Cloning Bot)
 * Catatan: Memerlukan arsitektur multi-session Baileys aktif.
 */

let handler = async (m, { conn }) => {
	m.reply('Fitur *JadiBot* saat ini sedang dalam masa pemeliharaan (maintenance) untuk pembaruan multi-device Baileys 7.');
};

handler.help = ['jadibot'];
handler.tags = ['main'];
handler.command = /^(jadibot)$/i;
handler.private = false;

export default handler;
