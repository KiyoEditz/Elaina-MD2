import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const lister = [
        "Adult Female #1, American English (TruVoice)",
        "Adult Female #2, American English (TruVoice)",
        "Adult Male #1, American English (TruVoice)",
        "Adult Male #2, American English (TruVoice)",
        "Adult Male #3, American English (TruVoice)",
        "Adult Male #4, American English (TruVoice)",
        "Adult Male #5, American English (TruVoice)",
        "Adult Male #6, American English (TruVoice)",
        "Adult Male #7, American English (TruVoice)",
        "Adult Male #8, American English (TruVoice)",
        "Female Whisper",
        "Male Whisper",
        "Mary",
        "Mary (for Telephone)",
        "Mary in Hall",
        "Mary in Space",
        "Mary in Stadium",
        "Mike",
        "Mike (for Telephone)",
        "Mike in Hall",
        "Mike in Space",
        "Mike in Stadium",
        "RoboSoft Five",
        "RoboSoft Four",
        "RoboSoft One",
        "RoboSoft Six",
        "RoboSoft Three",
        "RoboSoft Two",
        "Sam",
        "BonziBUDDY"
    ];

    const readMore = String.fromCharCode(8206).repeat(4001);

    const query = `Pilih karakter suara:\n\n*Contoh:*\n*${usedPrefix + command} 1|Halo apa kabar?*\n\n*Daftar Karakter Suara:*\n` + readMore + lister.map((v, index) => `  ${index + 1}. ${v}`).join("\n");

    if (args.length < 1 && (!m.quoted || !m.quoted.text)) {
        throw query;
    }

    const text = args.length >= 1 ? args.join(" ") : m.quoted.text;
    const [atas, bawah, kiri, kanan] = text.split("|");

    if (!atas || !bawah) {
        return m.reply(query);
    }

    let voiceIndex = parseInt(atas) - 1;
    if (isNaN(voiceIndex) || !lister[voiceIndex]) {
        return m.reply(`Nomor karakter suara tidak valid! Pilih angka 1 sampai ${lister.length}`);
    }

    await m.reply(global.wait || `Sedang memproses suara: ${lister[voiceIndex]}...`);

    try {
        const res = await SayTTS(lister[voiceIndex], bawah.trim(), kiri || 140, kanan || 157);
        if (res) {
            await conn.sendMessage(m.chat, {
                audio: res,
                mimetype: 'audio/mp4',
                ptt: true
            }, {
                quoted: m
            });
        }
    } catch (e) {
        m.reply("Error: " + e.message);
    }
};

handler.help = ["tts2 <nomor>|<teks>", "speech <nomor>|<teks>"];
handler.tags = ["tools", "ai"];
handler.command = /^(speech|tts2)$/i;

export default handler;

async function SayTTS(voice, text, pitch, speed) {
    try {
        pitch = parseInt(pitch) || 140;
        speed = parseInt(speed) || 157;

        const url = `https://tetyys.com/SAPI4/SAPI4?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&pitch=${pitch}&speed=${speed}`;

        if (text.length > 4088) {
            throw new Error("Teks melebihi batas maksimal karakter!");
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gagal mengambil audio: ${response.statusText}`);

        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer);
    } catch (error) {
        throw error;
    }
}
