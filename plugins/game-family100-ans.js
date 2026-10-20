import similarity from '../lib/similarity.js';

const threshold = 0.72; // semakin tinggi nilai, semakin mirip

export async function before(m) {
	this.game = this.game ? this.game : {};
	let id = 'family100_' + m.chat;
	if (!(id in this.game)) return true;
	let room = this.game[id];
	if (room.jawaban === undefined) {
		delete this.game[id];
		return true;
	}

	let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '');
	let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);

	if (!isSurrender) {
		let index = room.jawaban.indexOf(text);
		if (index < 0) {
			const remainingAnswers = room.jawaban.filter((_, idx) => !room.terjawab[idx]);
			if (remainingAnswers.length && Math.max(...remainingAnswers.map((jawaban) => similarity(jawaban, text))) >= threshold) {
				m.reply('Dikit lagi!');
			}
			return true;
		}
		if (room.terjawab[index]) return true;
		let user = global.db.data.users[m.sender];
		if (user) {
			user.exp = (user.exp || 0) + room.winScore;
		}
		room.terjawab[index] = m.sender;
	}

	let isWin = room.terjawab.length === room.terjawab.filter(Boolean).length;
	let caption = `
*Soal:* ${room.soal}

Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find((v) => v.includes(' ')) ? '\n(beberapa jawaban terdapat spasi)\n' : ''}
${isWin ? '*SEMUA JAWABAN TERJAWAB*' : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
	return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false;
})
	.filter(Boolean)
	.join('\n')}

${isSurrender ? '' : `+${room.winScore} XP tiap jawaban benar`}
    `.trim();

	const conn = this;
	if (this.game[id].msg_old) {
		await conn.sendMessage(m.chat, { delete: this.game[id].msg_old.key }).catch((e) => e);
	}

	let msg_old = await this.reply(m.chat, caption, m)
		.then((msg) => {
			return (this.game[id].msg = msg);
		})
		.catch((_) => _);
	this.game[id].msg_old = msg_old;

	if (isWin || isSurrender) {
		setTimeout(() => {
			if (this.game[id]?.msg?.key) {
				conn.sendMessage(m.chat, { delete: this.game[id].msg.key }).catch((e) => e);
			}
			delete this.game[id];
		}, 10000);
	}
	return true;
}
