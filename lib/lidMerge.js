import { deleteUser, deleteChat, saveLidMapping } from './sqliteDatabase.js';

/**
 * Normalisasi dan decode JID
 */
export function cleanJid(jid, conn) {
  if (!jid) return '';
  if (typeof jid === 'object' && jid !== null) {
    jid = jid.id || jid.jid || jid.phoneNumber || jid.lid || '';
  }
  if (typeof jid !== 'string') return '';
  if (conn?.decodeJid) return conn.decodeJid(jid);
  return jid.replace(/:\d+@/, '@');
}

/**
 * Mengumpulkan semua mapping LID -> JID (@s.whatsapp.net)
 * dari bot session, owner config, group participating, dan database.
 */
export async function collectLidMappings(conn) {
  const mapping = {};

  if (!global.db.data.lid) {
    global.db.data.lid = {};
  }
  if (!global.db.data.lidReverse) {
    global.db.data.lidReverse = {};
  }

  // 1. Ambil dari database persistent mapping yang sudah tersimpan sebelumnya
  for (const [lid, jid] of Object.entries(global.db.data.lid)) {
    if (typeof lid === 'string' && typeof jid === 'string' && lid.endsWith('@lid') && jid.endsWith('@s.whatsapp.net')) {
      mapping[lid] = jid;
      if (conn?.registerLid) conn.registerLid(lid, jid);
      else if (conn?.isLid) conn.isLid.set(lid, jid);
    }
  }

  // 2. Bot sendiri (me.lid -> me.id)
  if (conn?.user) {
    const myLid = cleanJid(conn.user.lid, conn);
    const myJid = cleanJid(conn.user.id || conn.user.jid, conn);
    if (myLid && myJid && myLid.endsWith('@lid') && myJid.endsWith('@s.whatsapp.net')) {
      mapping[myLid] = myJid;
      if (conn?.registerLid) conn.registerLid(myLid, myJid);
    }
  }

  // 3. Owner config mapping jika nomor owner diketahui
  const ownerNum = (global.owner?.[0]?.[0] || global.owner?.[0] || '6285874068202').toString().replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  const knownOwnerLid = '276974253666525@lid';
  mapping[knownOwnerLid] = ownerNum;
  if (conn?.registerLid) conn.registerLid(knownOwnerLid, ownerNum);

  // 4. Ambil dari semua grup yang diikuti bot
  if (conn && typeof conn.groupFetchAllParticipating === 'function') {
    try {
      console.log('[LID-Merge] Mengambil data peserta grup untuk pemetaan Dual-JID...');
      const participating = await conn.groupFetchAllParticipating().catch(err => {
        console.warn('[LID-Merge] Gagal mengambil grup via API:', err.message);
        return null;
      });

      if (participating && typeof participating === 'object') {
        for (const [groupId, groupData] of Object.entries(participating)) {
          if (!conn.chats[groupId]) {
            conn.chats[groupId] = { id: groupId };
          }
          conn.chats[groupId].metadata = groupData;
          conn.chats[groupId].subject = groupData.subject || conn.chats[groupId].subject || '';

          const participants = groupData.participants || [];
          for (const p of participants) {
            const lid = cleanJid(p.lid, conn);
            let real = p.phoneNumber || p.jid || p.id;
            if (real) {
              real = cleanJid(real, conn);
              if (!real.includes('@')) real += '@s.whatsapp.net';
              if (lid && lid.endsWith('@lid') && real.endsWith('@s.whatsapp.net')) {
                mapping[lid] = real;
                if (conn.registerLid) conn.registerLid(lid, real);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('[LID-Merge] Error saat fetch group metadata:', e);
    }
  }

  // 5. Cek conn.chats yang sudah ada di memory
  if (conn?.chats) {
    for (const chat of Object.values(conn.chats)) {
      const participants = chat?.metadata?.participants || chat?.participants;
      if (!Array.isArray(participants)) continue;
      for (const p of participants) {
        const lid = cleanJid(p.lid, conn);
        let real = p.phoneNumber || p.jid || p.id;
        if (real) {
          real = cleanJid(real, conn);
          if (!real.includes('@')) real += '@s.whatsapp.net';
          if (lid && lid.endsWith('@lid') && real.endsWith('@s.whatsapp.net')) {
            mapping[lid] = real;
            if (conn.registerLid) conn.registerLid(lid, real);
          }
        }
      }
    }
  }

  return mapping;
}

/**
 * Merge satu user dari lidUser ke realUser dengan memprioritaskan stat tertinggi
 */
export function mergeUserStats(lidUser, realUser, realJid, lidJid) {
  if (!realUser) {
    return {
      ...lidUser,
      jid: realJid,
      lid: lidJid || lidUser.lid || ''
    };
  }

  const lidLevel = Number(lidUser.level) || 0;
  const realLevel = Number(realUser.level) || 0;
  const isLidWinner = lidLevel > realLevel;

  const base = isLidWinner ? { ...realUser, ...lidUser } : { ...lidUser, ...realUser };

  return {
    ...base,
    jid: realJid,
    lid: lidJid || realUser.lid || lidUser.lid || '',
    level: Math.max(lidLevel, realLevel),
    exp: Math.max(Number(lidUser.exp) || 0, Number(realUser.exp) || 0),
    limit: Math.max(Number(lidUser.limit) || 0, Number(realUser.limit) || 0),
    money: Math.max(Number(lidUser.money) || 0, Number(realUser.money) || 0),
    atm: Math.max(Number(lidUser.atm) || 0, Number(realUser.atm) || 0),
    bank: Math.max(Number(lidUser.bank) || 0, Number(realUser.bank) || 0),
    health: Math.max(Number(lidUser.health) || 0, Number(realUser.health) || 0),
    potion: Math.max(Number(lidUser.potion) || 0, Number(realUser.potion) || 0),
    premiumTime: Math.max(Number(lidUser.premiumTime) || 0, Number(realUser.premiumTime) || 0),
    premium: Boolean(lidUser.premium || realUser.premium),
    registered: Boolean(lidUser.registered || realUser.registered),
    role: isLidWinner ? (lidUser.role || realUser.role || 'Beginner') : (realUser.role || lidUser.role || 'Beginner'),
    name: (realUser.name && realUser.name !== 'owner') ? realUser.name : (lidUser.name || realUser.name || '')
  };
}

/**
 * Fungsi utama untuk menggabungkan user @lid yang sudah terpetakan ke nomor aslinya (@s.whatsapp.net)
 * dan membersihkan user yang salah terdaftar dengan @g.us
 */
export async function mergeLidUsers(conn) {
  if (!global.db?.data) {
    await global.loadDatabase();
  }

  const mappings = await collectLidMappings(conn);
  const mappingEntries = Object.entries(mappings);

  let mergedCount = 0;
  let deletedLidCount = 0;
  let deletedGroupUserCount = 0;
  let chatMergedCount = 0;

  const users = global.db.data.users || {};
  const chats = global.db.data.chats || {};
  const dbSqlite = global.db.sqlite;

  // 1. Bersihkan akun grup (@g.us) yang sempat masuk ke tabel users
  for (const jid of Object.keys(users)) {
    if (jid.endsWith('@g.us')) {
      delete users[jid];
      if (dbSqlite) {
        deleteUser(dbSqlite, jid);
      }
      deletedGroupUserCount++;
    }
  }

  // 2. Gabungkan user @lid ke @s.whatsapp.net
  for (const [lidJid, realJid] of mappingEntries) {
    if (users[lidJid]) {
      const lidUser = users[lidJid];
      const realUser = users[realJid] || null;

      const mergedUser = mergeUserStats(lidUser, realUser, realJid, lidJid);
      users[realJid] = mergedUser;

      // Hapus data lid dari users RAM
      delete users[lidJid];

      // Hapus row lid dari SQLite users table
      if (dbSqlite) {
        deleteUser(dbSqlite, lidJid);
      }

      mergedCount++;
      deletedLidCount++;
    } else if (users[realJid] && !users[realJid].lid) {
      users[realJid].lid = lidJid;
    }

    // Merge Chat jika ada obrolan pribadi dengan @lid
    if (chats[lidJid]) {
      const lidChat = chats[lidJid];
      const realChat = chats[realJid] || {};
      chats[realJid] = { ...lidChat, ...realChat };

      delete chats[lidJid];
      if (dbSqlite) {
        deleteChat(dbSqlite, lidJid);
      }
      chatMergedCount++;
    }
  }

  const remainingLidUsers = Object.keys(users).filter(j => j.endsWith('@lid')).length;
  const remainingLidChats = Object.keys(chats).filter(j => j.endsWith('@lid')).length;

  if (global.saveDatabase) {
    global.saveDatabase();
  }

  console.log(`[Dual-JID System] Selesai: ${mergedCount} user digabung, ${deletedGroupUserCount} user @g.us dibersihkan, ${chatMergedCount} chat digabung. Sisa @lid: ${remainingLidUsers} users.`);

  return {
    success: true,
    totalMapped: mappingEntries.length,
    mergedCount,
    deletedLidCount,
    deletedGroupUserCount,
    chatMergedCount,
    remainingLidUsers,
    remainingLidChats
  };
}
