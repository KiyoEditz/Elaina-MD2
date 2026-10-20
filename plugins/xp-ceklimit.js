import levelling from '../lib/levelling.js';

let handler = async (m, { conn, usedPrefix }) => {
	let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
	let user = global.db?.data?.users?.[who] || {};
	let name = user.name || (conn.getName ? await conn.getName(who) : who.split('@')[0]);
	let limit = user.limit ?? 20;
	let exp = user.exp || 0;
	let pasangan = user.pasangan || '';
	let level = user.level || 0;
	let role = user.role || 'Beginner';
	let suit = user.suit || 0;
	let skata = user.skata || 0;
	let jodoh = pasangan ? `Berpacaran @${pasangan.split('@')[0]}` : 'Jomblo';
	let { min, xp, max } = levelling.xpRange(level, global.multiplier || 69);
	let math = max - exp;
	let readMore = conn.readmore || global.readMore || String.fromCharCode(8206).repeat(4001);

	let text = `
*Nama* : ${name}
*XP* : ${exp} (${exp - min}/ ${xp})
[${math <= 0 ? `Siap untuk ${usedPrefix}levelup` : `Butuh ${math} XP lagi untuk levelup`}]
*Level* : ${level}
*Role* : ${role}
*Status* : ${jodoh}
*Limit* : ${limit} 
*MMR Total* : ${suit + (skata ? skata : 1)} \n${readMore}
Harga penukaran 1 limit = 350 XP

Cara penukaran: ketik
${usedPrefix}buy

XP bisa kamu dapatkan dengan bermain game Bot di *${usedPrefix}menu game*
`.trim();

	conn.reply(m.chat, text, m, {
		mentions: pasangan ? [pasangan] : [],
	});
};

handler.help = ['cek'];
handler.tags = ['xp'];
handler.command = /^(cek|limit|me)$/i;
handler.register = true;

export default handler;
