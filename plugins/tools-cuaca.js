import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw `Penggunaan:\n*${usedPrefix + command} <nama kota>*\n\nContoh:\n*${usedPrefix + command} Jakarta*`;
    }

    await m.reply(global.wait || 'Sedang memeriksa cuaca...');
    let teksenc = encodeURIComponent(text.trim());

    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${teksenc}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&lang=id`);
        if (!res.ok) throw 'Lokasi tidak ditemukan!';

        let json = await res.json();
        if (json.cod != 200) throw json.message || 'Kota tidak ditemukan';

        let gustKmph = json.wind?.gust ? (json.wind.gust * 3.6).toFixed(2) : '-';

        let sunriseTime = json.sys?.sunrise ? new Date(json.sys.sunrise * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
        }) : '-';
        let sunsetTime = json.sys?.sunset ? new Date(json.sys.sunset * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
        }) : '-';

        let caption = `╭──── 〔 *INFORMASI CUACA* 〕 ─⬣
│ 🌍 *Lokasi*   : ${json.name}, ${json.sys?.country || ''}
│ 🌦️ *Kondisi*  : ${json.weather?.[0]?.description || '-'}
│ 🌡️ *Suhu*     : ${json.main?.temp} °C (Terasa: ${json.main?.feels_like} °C)
│ 📈 *Maks/Min* : ${json.main?.temp_max} °C / ${json.main?.temp_min} °C
│ 💧 *Kelembapan*: ${json.main?.humidity}%
│ 💨 *Angin*    : ${json.wind?.speed} m/s (Guncangan: ${gustKmph} km/jam)
│ ☁️ *Awan*     : ${json.clouds?.all || 0}%
│ 🌬️ *Tekanan*  : ${json.main?.pressure} hPa
│ 👀 *Jarak Pandang*: ${json.visibility ? (json.visibility / 1000).toFixed(1) + ' km' : '-'}
│ 🌅 *Matahari* : Terbit ${sunriseTime} WIB | Terbenam ${sunsetTime} WIB
╰────────────────────────⬣`.trim();

        m.reply(caption);
    } catch (e) {
        m.reply(`Gagal mengambil data cuaca: ${e.message || e}`);
    }
};

handler.help = ['cuaca <kota>'];
handler.tags = ['tools'];
handler.command = /^(cuaca|weather)$/i;

export default handler;
