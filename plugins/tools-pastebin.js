import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
    const link = args[0]?.trim();
    if (!link) {
        return m.reply(`Masukkan URL Pastebin!\n\nContoh:\n*${usedPrefix + command} https://pastebin.com/xxxx*`);
    }

    const pasteId = link.split('/').pop()?.trim();
    if (!pasteId) {
        return m.reply('URL Pastebin tidak valid!');
    }

    try {
        const response = await fetch(`https://pastebin.com/raw/${pasteId}`);
        if (!response.ok) throw new Error('Gagal mengambil isi dari Pastebin.');
        const content = await response.text();
        if (!content) {
            return m.reply('Tidak ada konten yang ditemukan di Pastebin tersebut.');
        }

        m.reply(content);
    } catch (error) {
        console.error(error);
        m.reply(`Terjadi kesalahan saat mengambil data dari Pastebin: ${error.message || error}`);
    }
};

handler.help = ['getpb <url_pastebin>', 'pastebin <url>'];
handler.tags = ['tools'];
handler.command = /^(getpb|pastebin|getpastebin)$/i;

export default handler;
