let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || !args[0].includes('|')) {
        throw `Masukkan data tensi dan Hb dengan format:\n*${usedPrefix + command} <tensi>|<hb>*\n\nContoh:\n*${usedPrefix + command} 120/80|14*`;
    }

    let [tensiRaw, hbRaw] = args[0].split('|');
    let hb = parseFloat(hbRaw.replace(',', '.'));
    
    // Tensi bisa berformat 120/80 atau angka tunggal sistolik
    let sistol = 120, diastol = 80;
    if (tensiRaw.includes('/')) {
        let parts = tensiRaw.split('/');
        sistol = parseInt(parts[0]);
        diastol = parseInt(parts[1]);
    } else {
        sistol = parseInt(tensiRaw);
    }

    if (isNaN(sistol) || isNaN(hb)) {
        throw 'Format angka tensi atau Hb tidak valid!';
    }

    // Diagnosis Tekanan Darah
    let statusTensi = '';
    let saranTensi = '';
    if (sistol > 180 || diastol > 120) {
        statusTensi = '🚨 Krisis Hipertensi (Sangat Tinggi)';
        saranTensi = 'Segera konsultasikan ke IGD atau dokter terdekat!';
    } else if (sistol >= 160 || diastol >= 100) {
        statusTensi = '⚠️ Hipertensi Tingkat 2 (Tinggi)';
        saranTensi = 'Kurangi garam, kelola stres, dan periksakan diri ke dokter.';
    } else if (sistol >= 140 || diastol >= 90) {
        statusTensi = '⚠️ Hipertensi Tingkat 1';
        saranTensi = 'Jaga pola makan seimbang, rutin olahraga, dan kurangi natrium.';
    } else if (sistol >= 120 || diastol >= 80) {
        statusTensi = '🟡 Pra-Hipertensi (Di ambang batas normal)';
        saranTensi = 'Pertahankan gaya hidup sehat agar tensi tidak melonjak.';
    } else if (sistol >= 90 && diastol >= 60) {
        statusTensi = '✅ Normal';
        saranTensi = 'Tekanan darah Anda ideal. Pertahankan!';
    } else {
        statusTensi = '🔵 Hipotensi (Darah Rendah)';
        saranTensi = 'Cukupi asupan cairan, konsumsi makanan bergizi, dan istirahat cukup.';
    }

    // Diagnosis Hemoglobin (Hb)
    let statusHb = '';
    let saranHb = '';
    if (hb < 10) {
        statusHb = '🔴 Anemia Berat / Rendah';
        saranHb = 'Perbanyak konsumsi makanan kaya zat besi (bayam, daging merah) atau suplemen penambah darah.';
    } else if (hb < 12) {
        statusHb = '🟡 Anemia Ringan';
        saranHb = 'Cukupi asupan vitamin C dan zat besi.';
    } else if (hb <= 17.5) {
        statusHb = '✅ Normal';
        saranHb = 'Kadar hemoglobin Anda dalam rentang yang sehat.';
    } else {
        statusHb = '⚠️ Tinggi (Polisitemia)';
        saranHb = 'Cukupi kebutuhan hidrasi harian air putih.';
    }

    let caption = `╭──── 〔 *CEK KESEHATAN DARAH* 〕 ─⬣
│ 🩸 *Tekanan Darah (Tensi)* : ${sistol}/${diastol} mmHg
│ 📊 *Status Tensi* : ${statusTensi}
│ 💡 *Saran Tensi*  : ${saranTensi}
│ 
│ 🧪 *Hemoglobin (Hb)* : ${hb} g/dL
│ 📊 *Status Hb*    : ${statusHb}
│ 💡 *Saran Hb*     : ${saranHb}
╰────────────────────────⬣

_Catatan: Hasil ini merupakan estimasi skrining awal dan bukan pengganti diagnosa medis dokter profesional._`;

    m.reply(caption);
};

handler.help = ['cekdarah tensi|hb'];
handler.tags = ['tools'];
handler.command = /^cekdarah$/i;

export default handler;
