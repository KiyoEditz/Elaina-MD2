import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Daftar kolom yang bertipe boolean agar saat di-load dari SQLite (0/1) kembali menjadi boolean true/false
const BOOLEAN_KEYS = new Set([
  'premium',
  'banned',
  'registered',
  'public',
  'autoread',
  'anticall',
  'gconly',
  'isBanned',
  'antispam',
  'game'
]);

/**
 * Inisialisasi koneksi SQLite dan pembuatan tabel
 */
export function initDatabase(dbPath = './data/database.db') {
  const fullPath = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const db = new Database(fullPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('wal_autocheckpoint = 1000');

  // Buat tabel-tabel utama
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      jid TEXT PRIMARY KEY,
      lid TEXT DEFAULT '',
      name TEXT DEFAULT '',
      "limit" INTEGER DEFAULT 20,
      exp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      role TEXT DEFAULT 'Beginner',
      skata INTEGER DEFAULT 0,
      suit INTEGER DEFAULT 0,
      pasangan TEXT DEFAULT '',
      premium INTEGER DEFAULT 0,
      premiumTime INTEGER DEFAULT 0,
      banned INTEGER DEFAULT 0,
      registered INTEGER DEFAULT 0,
      age INTEGER DEFAULT -1,
      regTime INTEGER DEFAULT -1,
      unreg INTEGER DEFAULT 0,
      lastclaim INTEGER DEFAULT 0,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS chats (
      jid TEXT PRIMARY KEY,
      isBanned INTEGER DEFAULT 0,
      antispam INTEGER DEFAULT 0,
      game INTEGER DEFAULT 1,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      public INTEGER DEFAULT 1,
      autoread INTEGER DEFAULT 0,
      anticall INTEGER DEFAULT 0,
      gconly INTEGER DEFAULT 1,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS stats (
      command TEXT PRIMARY KEY,
      total INTEGER DEFAULT 0,
      success INTEGER DEFAULT 0,
      last INTEGER DEFAULT 0,
      lastSuccess INTEGER DEFAULT 0,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS msgs (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sticker (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS lid_mappings (
      lid TEXT PRIMARY KEY,
      jid TEXT NOT NULL,
      updated_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_lid_mappings_jid ON lid_mappings(jid);

    CREATE TABLE IF NOT EXISTS extra (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );
  `);

  return db;
}

/**
 * Mendapatkan daftar kolom yang ada pada tabel
 */
export function getTableColumns(db, tableName) {
  const rows = db.prepare(`PRAGMA table_info("${tableName}")`).all();
  return new Set(rows.map(r => r.name));
}

/**
 * Auto-Column Migration: Otomatis menambah kolom ke samping kanan
 * jika ada properti baru bertipe primitif (string, number, boolean).
 */
export function ensureUserColumns(db, knownCols, userObj) {
  let altered = false;
  for (const [key, val] of Object.entries(userObj)) {
    if (key === 'jid' || key === 'data' || key === 'updated_at') continue;
    if (knownCols.has(key)) continue;

    // Hanya buat kolom terpisah untuk tipe primitif (string, number, boolean)
    const type = typeof val;
    let colType = null;
    let defaultVal = "''";

    if (type === 'number') {
      colType = 'INTEGER';
      defaultVal = '0';
    } else if (type === 'boolean') {
      colType = 'INTEGER';
      defaultVal = '0';
      BOOLEAN_KEYS.add(key);
    } else if (type === 'string') {
      colType = 'TEXT';
      defaultVal = "''";
    }

    if (colType && /^[a-zA-Z0-9_]+$/.test(key)) {
      try {
        db.prepare(`ALTER TABLE users ADD COLUMN "${key}" ${colType} DEFAULT ${defaultVal}`).run();
        knownCols.add(key);
        altered = true;
        console.log(`[DB Auto-Migration] Menambahkan kolom baru ke tabel users: "${key}" (${colType})`);
      } catch (err) {
        console.error(`[DB Auto-Migration Error] Gagal menambah kolom "${key}":`, err.message);
      }
    }
  }
  return altered;
}

/**
 * Membaca seluruh data dari SQLite ke objek RAM global.db.data
 */
export function loadDatabase(db) {
  const data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
  };

  // 1. Load Users
  const userRows = db.prepare('SELECT * FROM users').all();
  for (const row of userRows) {
    const jid = row.jid;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }

    const user = { ...extra };
    for (const [col, val] of Object.entries(row)) {
      if (col === 'jid' || col === 'data' || col === 'updated_at') continue;
      if (val === null || val === undefined) continue;

      if (BOOLEAN_KEYS.has(col)) {
        user[col] = Boolean(val);
      } else {
        user[col] = val;
      }
    }
    data.users[jid] = user;
  }

  // 2. Load Chats
  const chatRows = db.prepare('SELECT * FROM chats').all();
  for (const row of chatRows) {
    const jid = row.jid;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }
    data.chats[jid] = {
      isBanned: Boolean(row.isBanned),
      antispam: Boolean(row.antispam),
      game: Boolean(row.game),
      spamWarnings: {},
      ...extra,
    };
  }

  // 3. Load Settings
  const settingRows = db.prepare('SELECT * FROM settings').all();
  for (const row of settingRows) {
    const id = row.id;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }
    data.settings[id] = {
      public: Boolean(row.public),
      autoread: Boolean(row.autoread),
      anticall: Boolean(row.anticall),
      gconly: Boolean(row.gconly),
      ...extra,
    };
  }

  // 4. Load Stats
  const statRows = db.prepare('SELECT * FROM stats').all();
  for (const row of statRows) {
    data.stats[row.command] = {
      total: row.total,
      success: row.success,
      last: row.last,
      lastSuccess: row.lastSuccess,
    };
  }

  // 5. Load Msgs
  const msgRows = db.prepare('SELECT * FROM msgs').all();
  for (const row of msgRows) {
    try {
      data.msgs[row.key] = JSON.parse(row.data);
    } catch {
      data.msgs[row.key] = row.data;
    }
  }

  // 6. Load Sticker
  const stickerRows = db.prepare('SELECT * FROM sticker').all();
  for (const row of stickerRows) {
    try {
      data.sticker[row.key] = JSON.parse(row.data);
    } catch {
      data.sticker[row.key] = row.data;
    }
  }

  // 7. Load LID Mappings (Dual-JID System)
  data.lid = {};
  data.lidReverse = {};
  try {
    const lidRows = db.prepare('SELECT lid, jid FROM lid_mappings').all();
    for (const row of lidRows) {
      if (row.lid && row.jid) {
        data.lid[row.lid] = row.jid;
        data.lidReverse[row.jid] = row.lid;
      }
    }
  } catch {}

  // 8. Load Extra (sessions, menfess, chara, dll.)
  try {
    const extraRows = db.prepare('SELECT key, data FROM extra').all();
    for (const row of extraRows) {
      try {
        data[row.key] = JSON.parse(row.data);
      } catch {
        data[row.key] = row.data;
      }
    }
    if (data.lid && typeof data.lid === 'object') {
      for (const [l, j] of Object.entries(data.lid)) {
        if (typeof l === 'string' && typeof j === 'string') {
          data.lidReverse[j] = l;
        }
      }
    }
  } catch {}

  return data;
}

/**
 * Menyimpan data dari RAM global.db.data ke SQLite secara batch dan cepat
 */
export function saveDatabase(db, data) {
  if (!db || !data) return;

  const now = Date.now();
  const knownCols = getTableColumns(db, 'users');

  // Periksa apakah ada kolom baru yang perlu ditambahkan secara dinamis
  if (data.users) {
    for (const user of Object.values(data.users)) {
      if (user && typeof user === 'object') {
        ensureUserColumns(db, knownCols, user);
      }
    }
  }

  // Siapkan query dinamis untuk users berdasarkan kolom yang ada
  const userCols = Array.from(knownCols).filter(c => c !== 'jid' && c !== 'data' && c !== 'updated_at');
  const allUserCols = ['jid', ...userCols, 'data', 'updated_at'];
  const userColsEscaped = allUserCols.map(c => `"${c}"`).join(', ');
  const userPlaceholders = allUserCols.map(() => '?').join(', ');
  const userUpdateSet = ['data = excluded.data', 'updated_at = excluded.updated_at', ...userCols.map(c => `"${c}" = excluded."${c}"`)].join(', ');

  const upsertUser = db.prepare(`
    INSERT INTO users (${userColsEscaped})
    VALUES (${userPlaceholders})
    ON CONFLICT(jid) DO UPDATE SET ${userUpdateSet}
  `);

  const upsertChat = db.prepare(`
    INSERT INTO chats (jid, isBanned, antispam, game, data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(jid) DO UPDATE SET
      isBanned = excluded.isBanned,
      antispam = excluded.antispam,
      game = excluded.game,
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertSetting = db.prepare(`
    INSERT INTO settings (id, public, autoread, anticall, gconly, data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      public = excluded.public,
      autoread = excluded.autoread,
      anticall = excluded.anticall,
      gconly = excluded.gconly,
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertStat = db.prepare(`
    INSERT INTO stats (command, total, success, last, lastSuccess, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(command) DO UPDATE SET
      total = excluded.total,
      success = excluded.success,
      last = excluded.last,
      lastSuccess = excluded.lastSuccess,
      updated_at = excluded.updated_at
  `);

  const upsertMsg = db.prepare(`
    INSERT INTO msgs (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertSticker = db.prepare(`
    INSERT INTO sticker (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertLid = db.prepare(`
    INSERT INTO lid_mappings (lid, jid, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(lid) DO UPDATE SET
      jid = excluded.jid,
      updated_at = excluded.updated_at
  `);

  const upsertExtra = db.prepare(`
    INSERT INTO extra (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  // Eksekusi semua penulisan dalam 1 atomic transaction (super cepat < 10ms)
  const transaction = db.transaction(() => {
    // 1. Simpan Users
    if (data.users) {
      for (const [jid, user] of Object.entries(data.users)) {
        if (!user || typeof user !== 'object') continue;
        const extra = {};
        const values = [jid];

        for (const col of userCols) {
          let val = user[col];
          if (BOOLEAN_KEYS.has(col)) {
            val = val ? 1 : 0;
          } else if (val === undefined || val === null) {
            val = col === 'name' ? '' : col === 'role' ? 'Beginner' : col === 'pasangan' ? '' : col === 'lid' ? '' : 0;
          }
          values.push(val);
        }

        // Kumpulkan properti non-kolom (objek kompleks/nested) ke extra
        for (const [k, v] of Object.entries(user)) {
          if (!knownCols.has(k)) {
            extra[k] = v;
          }
        }

        values.push(JSON.stringify(extra), now);
        upsertUser.run(...values);
      }
    }

    // 2. Simpan Chats
    if (data.chats) {
      for (const [jid, chat] of Object.entries(data.chats)) {
        if (!chat || typeof chat !== 'object') continue;
        const { isBanned, antispam, game, ...rest } = chat;
        upsertChat.run(
          jid,
          isBanned ? 1 : 0,
          antispam ? 1 : 0,
          game === false ? 0 : 1,
          JSON.stringify(rest),
          now
        );
      }
    }

    // 3. Simpan Settings
    if (data.settings) {
      for (const [id, setting] of Object.entries(data.settings)) {
        if (!setting || typeof setting !== 'object') continue;
        const { public: pub, autoread, anticall, gconly, ...rest } = setting;
        upsertSetting.run(
          id,
          pub === false ? 0 : 1,
          autoread ? 1 : 0,
          anticall ? 1 : 0,
          gconly === false ? 0 : 1,
          JSON.stringify(rest),
          now
        );
      }
    }

    // 4. Simpan Stats
    if (data.stats) {
      for (const [cmd, stat] of Object.entries(data.stats)) {
        if (!stat || typeof stat !== 'object') continue;
        upsertStat.run(
          cmd,
          stat.total || 0,
          stat.success || 0,
          stat.last || 0,
          stat.lastSuccess || 0,
          now
        );
      }
    }

    // 5. Simpan Msgs
    if (data.msgs) {
      for (const [k, v] of Object.entries(data.msgs)) {
        upsertMsg.run(k, JSON.stringify(v), now);
      }
    }

    // 6. Simpan Sticker
    if (data.sticker) {
      for (const [k, v] of Object.entries(data.sticker)) {
        upsertSticker.run(k, JSON.stringify(v), now);
      }
    }

    // 7. Simpan LID Mappings (Dual-JID System)
    if (data.lid && typeof data.lid === 'object') {
      for (const [lid, jid] of Object.entries(data.lid)) {
        if (typeof lid === 'string' && typeof jid === 'string' && lid.endsWith('@lid') && jid.endsWith('@s.whatsapp.net')) {
          upsertLid.run(lid, jid, now);
        }
      }
    }

    // 8. Simpan Extra (sessions, menfess, chara, dll.)
    const STANDARD_KEYS = new Set(['users', 'chats', 'settings', 'stats', 'msgs', 'sticker', 'lid', 'lidReverse']);
    for (const [k, v] of Object.entries(data)) {
      if (!STANDARD_KEYS.has(k) && v !== undefined && v !== null) {
        upsertExtra.run(String(k), JSON.stringify(v), now);
      }
    }
  });

  transaction();
}

/**
 * Memigrasikan data dari file backup database lama (database_old_backup.db)
 * ke dalam skema tabel baru database.db
 */
export function migrateFromBackup(newDb, backupDbPath = './data/database_old_backup.db') {
  const fullBackupPath = path.resolve(backupDbPath);
  if (!fs.existsSync(fullBackupPath)) {
    return { success: false, message: 'Backup file not found' };
  }

  // Cek apakah tabel users di newDb sudah terisi
  const userCount = newDb.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount > 0) {
    return { success: false, message: `New database already has ${userCount} users. Skipped to prevent overwrite.` };
  }

  const oldDb = new Database(fullBackupPath);
  try {
    const row = oldDb.prepare("SELECT data FROM database WHERE id = 1").get();
    if (!row?.data) {
      oldDb.close();
      return { success: false, message: 'No data row with id = 1 in old database' };
    }

    const oldData = JSON.parse(row.data);
    oldDb.close();

    console.log(`[Migration] Mentransfer ${Object.keys(oldData.users || {}).length} user dan ${Object.keys(oldData.chats || {}).length} chat ke tabel baru...`);
    saveDatabase(newDb, oldData);

    const newUserCount = newDb.prepare('SELECT count(*) as count FROM users').get().count;
    const newChatCount = newDb.prepare('SELECT count(*) as count FROM chats').get().count;
    const newSettingCount = newDb.prepare('SELECT count(*) as count FROM settings').get().count;
    const newStatCount = newDb.prepare('SELECT count(*) as count FROM stats').get().count;

    console.log(`[Migration Berhasil] Users: ${newUserCount}, Chats: ${newChatCount}, Settings: ${newSettingCount}, Stats: ${newStatCount}`);
    return {
      success: true,
      users: newUserCount,
      chats: newChatCount,
      settings: newSettingCount,
      stats: newStatCount,
    };
  } catch (err) {
    try { oldDb.close(); } catch {}
    console.error('[Migration Error]', err);
    return { success: false, error: err.message };
  }
}

/**
 * Menyimpan / memperbarui 1 pemetaan LID <-> JID secara langsung
 */
export function saveLidMapping(db, lid, jid) {
  if (!db || !lid || !jid) return;
  try {
    db.prepare(`
      INSERT INTO lid_mappings (lid, jid, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(lid) DO UPDATE SET
        jid = excluded.jid,
        updated_at = excluded.updated_at
    `).run(lid, jid, Date.now());
  } catch (err) {
    console.error('[DB Save LID Mapping Error]', err.message);
  }
}

/**
 * Menghapus data user dari SQLite
 */
export function deleteUser(db, jid) {
  if (!db || !jid) return;
  try {
    db.prepare('DELETE FROM users WHERE jid = ?').run(jid);
  } catch (err) {
    console.error('[DB Delete User Error]', err.message);
  }
}

/**
 * Menghapus data chat dari SQLite
 */
export function deleteChat(db, jid) {
  if (!db || !jid) return;
  try {
    db.prepare('DELETE FROM chats WHERE jid = ?').run(jid);
  } catch (err) {
    console.error('[DB Delete Chat Error]', err.message);
  }
}

