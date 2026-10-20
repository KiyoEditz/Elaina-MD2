import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `_Masukkan nama daerah atau kota!_\n\nContoh:\n*${usedPrefix + command} sukabumi*`;

    try {
        let res = await fetch(`https://kodepos.now.sh/?q=${encodeURIComponent(text.trim())}`);
        let json = await res.json();
        let data = json.data || [];

        if (data.length === 0) {
            throw `Kode pos untuk daerah *"${text.trim()}"* tidak ditemukan.`;
        }

        let results = data.slice(0, 10).map((v, i) => {
            return `${i + 1}. *${v.village || v.urban || '-'}*
   • Kode Pos: *${v.code || v.postalcode || '-'}*
   • Kecamatan: ${v.district || v.subdistrict || '-'}
   • Kota/Kab: ${v.regency || v.city || '-'}
   • Provinsi: ${v.province || '-'}`;
        }).join('\n\n');

        let caption = `╭──── 〔 *PENCARIAN KODE POS* 〕 ─⬣
│ 🔎 *Query*: ${text.trim()}
│ 📊 *Ditemukan*: ${data.length} hasil (menampilkan maks 10)
╰────────────────────────⬣\n\n${results}`.trim();

        m.reply(caption);
    } catch (e) {
        m.reply(`Gagal mencari kode pos: ${e.message || e}`);
    }
};

handler.help = ['kodepos <daerah>'];
handler.tags = ['tools'];
handler.command = /^kodepos$/i;

export default handler;
