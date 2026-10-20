/* Divide il corpus in lotti per una passata di revisione.
   Run: node tools/it/audit/shard.js <passata> <lotti>
   Ogni passata sposta i confini dei lotti, così ogni unità capita accanto
   a vicini diversi e sotto occhi diversi. */
var fs = require("fs");
var path = require("path");
var OUT = path.join(__dirname, "out");
var pass = +process.argv[2] || 1, n = +process.argv[3] || 12;
var units = fs.readFileSync(path.join(OUT, "corpus.jsonl"), "utf8").trim().split("\n");
var total = units.reduce(function (a, u) { return a + u.length; }, 0);
var dir = path.join(OUT, "pass" + pass);
fs.mkdirSync(dir, { recursive: true });
// rotate by a pass-dependent offset so boundaries move
var off = Math.floor(units.length * ((pass * 0.37) % 1));
units = units.slice(off).concat(units.slice(0, off));
var per = total / n, cur = [], size = 0, k = 0;
function flush() { if (!cur.length) return; fs.writeFileSync(path.join(dir, "shard" + (++k) + ".jsonl"), cur.join("\n") + "\n"); cur = []; size = 0; }
units.forEach(function (u) { cur.push(u); size += u.length; if (size >= per && k < n - 1) flush(); });
flush();
console.log("passata " + pass + ": " + k + " lotti in " + dir);
