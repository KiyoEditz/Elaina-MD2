import fetch from 'node-fetch';

let handler = async (m, { text }) => {
    let country = text ? encodeURIComponent(text.trim()) : 'indonesia';
    try {
        let res = await fetch(`https://disease.sh/v3/covid-19/countries/${country}`);
        if (!res.ok) throw 'Negara tidak ditemukan atau server sedang sibuk.';
        let json = await res.json();

        let caption = `╭──── 〔 *DATA COVID-19* 〕 ─⬣
│ 🌍 *Negara*    : ${json.country}
│ 🦠 *Total Kasus*: ${json.cases?.toLocaleString('id-ID')}
│ ➕ *Kasus Baru* : +${json.todayCases?.toLocaleString('id-ID')}
│ 💚 *Sembuh*     : ${json.recovered?.toLocaleString('id-ID')}
│ ➕ *Sembuh Baru*: +${json.todayRecovered?.toLocaleString('id-ID')}
│ ⚰️ *Meninggal*  : ${json.deaths?.toLocaleString('id-ID')}
│ ➕ *Wafat Baru* : +${json.todayDeaths?.toLocaleString('id-ID')}
│ 🏥 *Kasus Aktif*: ${json.active?.toLocaleString('id-ID')}
│ 🧪 *Total Tes*  : ${json.tests?.toLocaleString('id-ID')}
│ 👥 *Populasi*   : ${json.population?.toLocaleString('id-ID')}
╰────────────────────────⬣`.trim();

        m.reply(caption);
    } catch (e) {
        m.reply(`Gagal mengambil data Covid-19: ${e.message || e}`);
    }
};

handler.help = ['corona [negara]'];
handler.tags = ['tools'];
handler.command = /^(corona|covid|covid19)$/i;

export default handler;
