import { mergeLidUsers } from '../lib/lidMerge.js';

let handler = async (m, { conn }) => {
  await m.reply('🔍 _Sedang memindai grup dan memproses pemetaan Dual-JID serta penggabungan data @lid ke nomor WhatsApp... Mohon tunggu sebentar._');
  try {
    const res = await mergeLidUsers(conn);
    const teks = `
*╭──「 DUAL-JID & LID MERGE REPORT 」──╮*
│
├ 📊 *Total LID Terpetakan:* ${res.totalMapped}
├ 👥 *User Berhasil Dimerge:* ${res.mergedCount}
├ 🧹 *User @g.us Dibersihkan:* ${res.deletedGroupUserCount}
├ 💬 *Chat Berhasil Dimerge:* ${res.chatMergedCount}
├ ⏳ *Sisa User @lid:* ${res.remainingLidUsers}
├ ⏳ *Sisa Chat @lid:* ${res.remainingLidChats}
│
*╰──────────────────────────────────╯*
${res.remainingLidUsers > 0 ? '\n_Catatan: Sisa akun @lid yang belum terpetakan akan otomatis dikonversi saat mereka mengirim pesan atau saat metadata grup dimuat._' : '\n_Semua data @lid telah bersih dan terpetakan ke nomor WhatsApp asli!_'}`.trim();
    await m.reply(teks);
  } catch (e) {
    console.error(e);
    await m.reply(`❌ Terjadi kesalahan saat memproses migrasi Dual-JID: ${e.message}`);
  }
};

handler.help = ['fixlid', 'mergelid'];
handler.tags = ['owner'];
handler.command = /^(fixlid|mergelid)$/i;
handler.owner = true;

export default handler;
