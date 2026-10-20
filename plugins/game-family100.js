import fs from 'fs';
import path from 'path';

const winScore = 500;
let familyData = null;

function getFamilyQuestions() {
	if (!familyData) {
		const filePath = path.resolve('./src/scrap/family.json');
		familyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	}
	return familyData;
}

const handler = async function (m) {
	this.game = this.game ? this.game : {};
	let id = 'family100_' + m.chat;
	if (id in this.game) {
		if (this.game[id].id !== undefined) {
			return this.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini\nKetik *Nyerah* untuk mengakhiri', this.game[id].msg);
		}
		delete this.game[id];
		throw false;
	}
	this.game[id] = {};
	const src = getFamilyQuestions();
	const json = src[Math.floor(Math.random() * src.length)];

	const caption = `
*Soal:* ${json.soal}

Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find((v) => v.includes(' ')) ? '\n(beberapa jawaban terdapat spasi)\n' : ''}

+${winScore} XP tiap jawaban benar
    `.trim();

	this.game[id] = {
		id,
		msg: await m.reply(caption),
		...json,
		terjawab: Array.from(json.jawaban, () => false),
		winScore,
	};
};

handler.help = ['family100'];
handler.tags = ['game'];
handler.group = true;
handler.command = /^family100$/i;

export default handler;
