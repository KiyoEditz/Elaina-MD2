let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Penggunaan: *${usedPrefix + command} <perhitungan>*\n\nContoh:\n*${usedPrefix + command} 5÷0.5*\n*${usedPrefix + command} (12 + 8) * 3 / 2*`);

    let val = text
        .replace(/[^0-9\-\/+*×÷πEe().]/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π|pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E')
        .replace(/\/+/g, '/')
        .replace(/\++/g, '+')
        .replace(/-+/g, '-');

    let format = val
        .replace(/Math\.PI/g, 'π')
        .replace(/Math\.E/g, 'e')
        .replace(/\//g, '÷')
        .replace(/\*/g, '×');

    try {
        let result = Function('"use strict"; return (' + val + ')')();

        if (result === Infinity || result === -Infinity || isNaN(result)) {
            throw new Error('Perhitungan tidak valid!');
        }

        m.reply(`*${format}* = _${result}_`);
    } catch (e) {
        m.reply('_Format salah atau perhitungan tidak valid!_\nHanya angka dan simbol -, +, *, /, ×, ÷, π, e, (.) yang didukung.');
    }
};

handler.help = ['calc', 'kalkulator'];
handler.tags = ['tools'];
handler.command = /^(calc(ulat(e|or))?|kalk(ulator)?)$/i;
handler.exp = 5;

export default handler;
