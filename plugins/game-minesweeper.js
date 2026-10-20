const handler = async (m, { conn, args, command }) => {
    const generate = (x, y, bombs) => {
      const field = Array.from({ length: x }, () => Array(y).fill(0));
  
      for (let i = 0; i < bombs; i++) {
        let xBomb, yBomb;
        do {
          xBomb = Math.floor(Math.random() * x);
          yBomb = Math.floor(Math.random() * y);
        } while (field[xBomb][yBomb] === 'x');
  
        field[xBomb][yBomb] = 'x';
      }
  
      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          if (field[i][j] !== 'x') {
            for (let k = -1; k <= 1; k++) {
              for (let l = -1; l <= 1; l++) {
                const ni = i + k;
                const nj = j + l;
                if (ni >= 0 && ni < x && nj >= 0 && nj < y && field[ni][nj] === 'x') {
                  field[i][j]++;
                }
              }
            }
          }
        }
      }
  
      return field;
    };
  
    const generateEmpty = (x, y) => Array.from({ length: x }, () => Array(y).fill(0));
  
    const translate = (value) => {
      switch (value) {
        case 0: return '⬜';
        case 1: return '1️⃣';
        case 2: return '2️⃣';
        case 3: return '3️⃣';
        case 4: return '4️⃣';
        case 5: return '5️⃣';
        case 6: return '6️⃣';
        case 7: return '7️⃣';
        case 8: return '8️⃣';
        case 'x': return '💣';
        case 'e': return '⏹';
        case 'f': return '🚩';
      }
    };
  
    const generateString = (map) => map.map(row => row.map(cell => translate(cell)).join('')).join('\n');
  
    const detectZero = (map, x, y) => {
      const queue = [[x, y]];
      const result = [];
      const visited = new Set();
  
      while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        if (!visited.has(`${cx},${cy}`)) {
          visited.add(`${cx},${cy}`);
          result.push([cx, cy]);
  
          if (map[cx][cy] === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const ni = cx + i;
                const nj = cy + j;
                if (ni >= 0 && ni < map.length && nj >= 0 && nj < map[0].length) {
                  queue.push([ni, nj]);
                }
              }
            }
          }
        }
      }
  
      return result;
    };
  
    let x = 10, y = 10, bombs = 15;
    let orgs = args[0];
    let oX = args[1];
    let oY = args[2];
    let F = args[3];
  
    if (!orgs) {
      return m.reply(`🕹 *Minesweeper Game* 🕹\n*▶ ${command} go* - Start the Game\n*🔓 ${command} open* - Open a cell\n*🔽 ${command} surrender* - Surrender\n\n*Example:* ${command} go`);
    }
  
    switch (orgs.toLowerCase()) {
      case "go":
      case "start":
        const map = generate(x, y, bombs);
        const empty = generateEmpty(x, y);
        let gameState = {
          map,
          current: empty,
          key: await m.reply('🕹 Minesweeper Game 🕹\n\n*Board*\n' + generateString(empty)),
        };
        conn.minessweeper = conn.minessweeper || {};
        conn.minessweeper[m.chat] = gameState;
        return;
  
      case "surrender":
      case "stop":
      case "end":
        if (!conn.minessweeper[m.chat]) {
          return m.reply('🚨 No active game session.');
        }
        delete conn.minessweeper[m.chat];
        return m.reply('🏳 You surrendered.');
  
      case "open":
      case "o":
      case "buka":
        if (!conn.minessweeper[m.chat]) {
          return m.reply('🚨 No active game session.');
        }
        if (oX > 10 || !oX || !oY) {
          return m.reply(`🚨 *Invalid parameters. Example: ${command} open 2 5*`);
        }
  
        let g = conn.minessweeper[m.chat];
  
        if (F === 'f') {
          g.current[oY - 1][oX - 1] = '🚩';
        } else {
          const openedCell = g.map[oX - 1][oY - 1];
  
          if (openedCell === 0) {
            const zero = detectZero(g.map, oX - 1, oY - 1);
            for (const coords of zero) {
              g.current[coords[0]][coords[1]] = g.map[coords[0]][coords[1]];
            }
          } else if (openedCell === 'x') {
            delete conn.minessweeper[m.chat];
            return m.reply('💥 BOOM! 💣 You opened a bomb.');
          } else {
            g.current[oY - 1][oX - 1] = openedCell;
          }
        }
  
        await conn.sendMessage(m.chat, { delete: g.key });
        g.key = await m.reply('🕹 Minesweeper Game 🕹\n\n*Board*\n' + generateString(g.current));
        return;
    }
  };
  
  handler.help = ['msp','Minesweeper'];
  handler.command = ['msp','Minesweeper'];
  handler.tags = ['game','fun'];
  
  export default handler;
  