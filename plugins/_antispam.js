const sigmoid = x => 1 / (1 + Math.exp(-x));

const W1 = [
	[0.8, 0.7, 0.4, 0.6, 0.3],
	[0.3, 0.5, 0.7, 0.8, 0.4],
	[0.5, 0.4, 0.3, 0.5, 0.9],
];
const b1 = [-0.3, -0.3, -0.2];
const W2 = [[0.8, 0.7, 0.6]];
const b2 = [-1.0];

function forwardPass(inputs) {
	const hidden = W1.map((weights, i) => {
		const z = weights.reduce((sum, w, j) => sum + w * inputs[j], 0) + b1[i];
		return sigmoid(z);
	});
	const z2 = W2[0].reduce((sum, w, i) => sum + w * hidden[i], 0) + b2[0];
	return sigmoid(z2);
}

function extractFeatures(text, history, now) {
	const recent      = history.filter(h => now - h.time < 10_000);
	const freqScore   = Math.min(recent.length / 10, 1);
	const repeatScore = Math.min(history.filter(h => h.text === text).length / 5, 1);
	const caps        = (text.match(/[A-Z]/g) || []).length;
	const capsScore   = text.length > 0 ? Math.min(caps / text.length, 1) : 0;
	const linkScore   = Math.min((text.match(/https?:\/\//g) || []).length / 3, 1);
	const lenScore    = text.length > 500 ? 0.8 : text.length < 2 ? 0.3 : 0;
	return [freqScore, repeatScore, capsScore, linkScore, lenScore];
}

let handler = (m) => m;

handler.before = async function (m, { conn }) {
	if (!m.isGroup || !m.text) return;

	let chat = db.data.chats[m.chat];
	let user = db.data.users[m.sender];

	if (!chat.antispam) return;
	if (m.isAdmin || m.isBotAdmin) return;

	const now = Date.now();

	if (!user.spamHistory) user.spamHistory = [];
	user.spamHistory = user.spamHistory.filter(h => now - h.time < 30_000);

	const features  = extractFeatures(m.text, user.spamHistory, now);
	const spamScore = forwardPass(features);

	user.spamHistory.push({ time: now, text: m.text });

	if (spamScore < 0.65) return;

	await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {});

	if (!chat.spamWarnings) chat.spamWarnings = {};
	chat.spamWarnings[m.sender] = (chat.spamWarnings[m.sender] || 0) + 1;

	const warn = chat.spamWarnings[m.sender];
	const pct  = (spamScore * 100).toFixed(1);

	if (warn >= 3) {
		await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch(() => {});
		delete chat.spamWarnings[m.sender];
		user.spamHistory = [];
		await conn.sendMessage(m.chat, {
			text: `🚫 @${m.sender.split('@')[0]} di-kick karena spam!\n🧠 Score: ${pct}%`,
			mentions: [m.sender],
		});
	} else {
		await conn.sendMessage(m.chat, {
			text: `⚠️ @${m.sender.split('@')[0]} terdeteksi spam!\n📊 Score: *${pct}%*\n🔢 Peringatan: *${warn}/3*`,
			mentions: [m.sender],
		});
	}
};

export default handler;