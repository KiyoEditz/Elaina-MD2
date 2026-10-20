let handler = async (m, { args, conn, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`Contoh penggunaan:\n*${usedPrefix + command} https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F/123 halo dunia*`);
    }

    if (!args[0].startsWith('https://whatsapp.com/channel/')) {
        return m.reply('Tautan channel WhatsApp tidak valid!');
    }

    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => {
        if (c === ' ') return '―';
        return hurufGaya[c] || c;
    }).join('');

    try {
        const link = args[0];
        const parts = link.replace('https://whatsapp.com/channel/', '').split('/');
        const channelInvite = parts[0];
        const serverMsgId = parts[1];

        if (!serverMsgId) {
            return m.reply('Masukkan link ke spesifik pesan di channel (yang memiliki nomor ID di akhir URL)!');
        }

        const res = await conn.newsletterMetadata('invite', channelInvite);
        if (!res?.id) throw 'Channel tidak ditemukan';

        if (conn.newsletterReactMessage) {
            await conn.newsletterReactMessage(res.id, serverMsgId, emoji);
        } else {
            throw 'Fungsi reaction channel belum didukung oleh socket Baileys ini.';
        }

        return m.reply(`Berhasil mengirim reaction *${emoji}* ke pesan di channel *${res.name}*.`);
    } catch (e) {
        console.error(e);
        return m.reply(`Gagal mengirim reaction: ${e.message || e}`);
    }
};

handler.help = ['reactch <link_pesan_ch> <teks>'];
handler.tags = ['tools'];
handler.command = /^reactch$/i;

export default handler;
