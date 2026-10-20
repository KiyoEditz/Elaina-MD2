let handler = async (m, { conn }) => {
	conn.reply(m.chat, '_*yahaha goblok banget*_', m);
};

handler.help = ['menuall'];
handler.tags = ['main'];
handler.command = /^(menuall)$/i;

export default handler;
