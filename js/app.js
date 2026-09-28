/*!
 * AkihiroLabs — NumConv — app logic
 * https://github.com/AkihiroZayar/numconv
 */
      const inputs = { dec: document.getElementById('inp-dec'), bin: document.getElementById('inp-bin'), hex: document.getElementById('inp-hex'), oct: document.getElementById('inp-oct') };
      const errors = { dec: document.getElementById('err-dec'), bin: document.getElementById('err-bin'), hex: document.getElementById('err-hex'), oct: document.getElementById('err-oct') };
      const cards = { dec: document.getElementById('card-dec'), bin: document.getElementById('card-bin'), hex: document.getElementById('card-hex'), oct: document.getElementById('card-oct') };
      const radixes = { dec: 10, bin: 2, hex: 16, oct: 8 };
      const patterns = { dec: /^-?\d*$/, bin: /^[01]*$/, hex: /^[0-9a-fA-F]*$/, oct: /^[0-7]*$/ };
      const labels = { dec: 'Decimal', bin: 'Binary', hex: 'Hexadecimal', oct: 'Octal' };
      let updating = false, history = [];
      let quizState = { correct: 0, wrong: 0, streak: 0, answered: false, answer: 0 };

      function showPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('page-' + id).classList.add('active');
        event.target.classList.add('active');
        if (id === 'reference') buildRefTable();
        if (id === 'ascii') buildAscii();
        if (id === 'quiz') newQuiz();
        if (id === 'history') renderHistory();
      }

      function setActive(id) {
        Object.keys(cards).forEach(k => { cards[k].classList.remove('active'); errors[k].textContent = ''; });
        if (id) cards[id].classList.add('active');
      }

      function convert(src) {
        if (updating) return;
        updating = true;
        const raw = inputs[src].value.trim();
        Object.keys(errors).forEach(k => errors[k].textContent = '');
        if (!raw || raw === '-') {
          Object.keys(inputs).forEach(k => { if (k !== src) inputs[k].value = ''; });
          renderBits(null); renderSteps(null); updating = false; return;
        }
        if (!patterns[src].test(raw)) {
          errors[src].textContent = 'Invalid ' + labels[src].toLowerCase() + ' character';
          updating = false; return;
        }
        const dec = parseInt(raw, radixes[src]);
        if (isNaN(dec)) { errors[src].textContent = 'Invalid number'; updating = false; return; }
        Object.keys(inputs).forEach(k => { if (k !== src) inputs[k].value = dec.toString(radixes[k]).toUpperCase(); });
        renderBits(dec); renderSteps(dec, src); addHistory(dec); updating = false;
      }

      function renderBits(dec) {
        const grid = document.getElementById('bit-grid');
        if (dec === null || isNaN(dec) || dec < 0) {
          grid.innerHTML = '<span style="color:var(--text3);font-family:var(--mono);font-size:13px;">Enter a number above to see its bits</span>';
          return;
        }
        const bits = (dec === 0 ? '0' : dec.toString(2)).padStart(Math.max(dec.toString(2).length, 8), '0');
        grid.innerHTML = '';
        const padded = bits.padStart(Math.ceil(bits.length / 4) * 4, '0');
        for (let g = 0; g < padded.length; g += 4) {
          const grp = document.createElement('div');
          grp.className = 'bit-group';
          for (let i = g; i < g + 4; i++) {
            const pos = padded.length - 1 - i;
            const b = padded[i];
            grp.innerHTML += `<div class="bit-cell"><div class="bit-box ${b === '1' ? 'one' : 'zero'}">${b}</div><div class="bit-pos">2<sup>${pos}</sup></div></div>`;
          }
          grid.appendChild(grp);
        }
      }

      function renderSteps(dec, src) {
        const el = document.getElementById('steps-content');
        if (dec === null) { el.innerHTML = 'Enter a number to see the conversion steps'; return; }
        let html = '';
        if (dec === 0) {
          html += `<span style="color:var(--primary);">Dec → Bin:</span> 0 = <span style="color:var(--green);">0000 0000</span><br>`;
        } else {
          let n = dec, steps = [], rem = [];
          while (n > 0) {
            rem.push(n % 2);
            steps.push(`${n} ÷ 2 = ${Math.floor(n / 2)} remainder <span style="color:var(--green);">${n % 2}</span>`);
            n = Math.floor(n / 2);
          }
          html += `<span style="color:var(--primary);">Dec → Bin (divide by 2):</span><br>` +
            steps.map(s => `&nbsp;&nbsp;${s}`).join('<br>') +
            `<br>&nbsp;&nbsp;Read remainders bottom-up: <span style="color:var(--green);">${rem.reverse().join('')}</span><br><br>`;
        }
        const hexStr = dec.toString(16).toUpperCase();
        html += `<span style="color:var(--primary);">Dec → Hex:</span> ${dec} = ${Math.floor(dec / 16)}×16 + ${dec % 16} → <span style="color:var(--green);">${hexStr}</span><br><br>`;
        const octStr = dec.toString(8);
        html += `<span style="color:var(--primary);">Dec → Oct:</span> ${dec} in base 8 = <span style="color:var(--green);">${octStr}</span>`;
        el.innerHTML = html;
      }

      function addHistory(dec) {
        if (isNaN(dec)) return;
        history = [{ dec, bin: dec.toString(2), oct: dec.toString(8), hex: dec.toString(16).toUpperCase(), time: new Date().toLocaleTimeString() },
          ...history.filter(h => h.dec !== dec)].slice(0, 30);
      }

      function renderHistory() {
        const el = document.getElementById('hist-list');
        if (!history.length) { el.innerHTML = '<p style="font-size:13px;color:var(--text3);">No history yet — start converting!</p>'; return; }
        el.innerHTML = history.map(h =>
          `<div class="history-row" onclick="loadDec(${h.dec})">
            <span class="history-dec">${h.dec}</span>
            <span class="history-rest">Bin: ${h.bin} · Oct: ${h.oct} · Hex: ${h.hex}</span>
            <span class="history-time">${h.time}</span>
          </div>`).join('');
      }

      function loadDec(n) {
        inputs.dec.value = n; setActive('dec'); convert('dec'); showPageDirect('converter');
      }

      function showPageDirect(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('page-' + id).classList.add('active');
        document.querySelectorAll('.nav-tab')[0].classList.add('active');
      }

      function clearAll() {
        Object.keys(inputs).forEach(k => { inputs[k].value = ''; errors[k].textContent = ''; });
        setActive(null); renderBits(null); renderSteps(null);
      }

      function randomNum() { const n = Math.floor(Math.random() * 256); inputs.dec.value = n; setActive('dec'); convert('dec'); }
      function loadExample(n) { inputs.dec.value = n; setActive('dec'); convert('dec'); }

      function copyVal(id) {
        const v = inputs[id].value; if (!v) return;
        navigator.clipboard.writeText(v).then(() => {
          const btn = document.querySelector(`#card-${id} .base-copy`);
          const orig = btn.textContent;
          btn.textContent = 'Copied!'; btn.style.color = 'var(--green)';
          setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1200);
        });
      }

      function copyAll() {
        const lines = Object.keys(inputs).map(k => `${labels[k]}: ${inputs[k].value || '—'}`).join('\n');
        navigator.clipboard.writeText(lines);
      }

      Object.keys(inputs).forEach(id => {
        inputs[id].addEventListener('input', () => { setActive(id); convert(id); });
        inputs[id].addEventListener('focus', () => setActive(id));
      });

      let refData = [];
      function buildRefTable() {
        if (refData.length) { filterRef(); return; }
        refData = Array.from({ length: 256 }, (_, i) => ({
          dec: i, bin: i.toString(2).padStart(8, '0'),
          oct: i.toString(8), hex: i.toString(16).toUpperCase(),
          pow: (i & (i - 1)) === 0 && i > 0
        }));
        filterRef();
      }

      function filterRef() {
        const q = document.getElementById('ref-search').value.trim();
        const filtered = q ? refData.filter(r => r.dec.toString().includes(q) || r.hex.includes(q.toUpperCase()) || r.bin.includes(q)) : refData;
        document.getElementById('ref-count').textContent = `${filtered.length} rows`;
        document.getElementById('ref-tbody').innerHTML = filtered.map(r =>
          `<tr class="${r.pow ? 'hl' : ''}"><td>${r.dec}</td><td>${r.bin}</td><td>${r.oct}</td><td>${r.hex}</td><td>${r.pow ? '✓ 2^' + Math.log2(r.dec) : ''}</td></tr>`
        ).join('');
      }

      function buildAscii() {
        const grid = document.getElementById('ascii-grid');
        if (grid.innerHTML) return;
        const printable = [];
        for (let i = 32; i < 127; i++) printable.push(i);
        grid.innerHTML = printable.map(c => {
          const ch = c === 32 ? 'SPC' : String.fromCharCode(c);
          return `<div class="ascii-cell" onclick="loadDec(${c})">
            <div class="ascii-char">${ch}</div>
            <div class="ascii-vals">Dec: ${c}<br>Hex: ${c.toString(16).toUpperCase()}<br>Bin: ${c.toString(2).padStart(8, '0')}</div>
          </div>`;
        }).join('');
      }

      const quizTypes = [
        { q: n => `Convert ${n} (decimal) to binary`, hint: 'Base 10 → Base 2', src: 'dec', tgt: 'bin' },
        { q: n => `Convert ${n.toString(2)} (binary) to decimal`, hint: 'Base 2 → Base 10', src: 'bin', tgt: 'dec' },
        { q: n => `Convert ${n} (decimal) to hexadecimal`, hint: 'Base 10 → Base 16', src: 'dec', tgt: 'hex' },
        { q: n => `Convert ${n.toString(16).toUpperCase()} (hex) to decimal`, hint: 'Base 16 → Base 10', src: 'hex', tgt: 'dec' },
        { q: n => `Convert ${n} (decimal) to octal`, hint: 'Base 10 → Base 8', src: 'dec', tgt: 'oct' },
        { q: n => `Convert ${n.toString(8)} (octal) to decimal`, hint: 'Base 8 → Base 10', src: 'oct', tgt: 'dec' },
      ];

      function newQuiz() {
        quizState.correct = 0; quizState.wrong = 0; quizState.streak = 0;
        updateScoreUI(); nextQuiz();
      }

      function nextQuiz() {
        quizState.answered = false;
        document.getElementById('q-next').style.display = 'none';
        document.getElementById('q-feedback').textContent = '';
        const type = quizTypes[Math.floor(Math.random() * quizTypes.length)];
        const n = Math.floor(Math.random() * 64) + 1;
        quizState.answer = n; quizState.type = type;
        const display = type.src === 'dec' ? n : type.src === 'bin' ? n.toString(2) : type.src === 'hex' ? n.toString(16).toUpperCase() : n.toString(8);
        document.getElementById('q-question').textContent = type.q(n);
        document.getElementById('q-number').textContent = display;
        document.getElementById('q-hint').textContent = type.hint;
        const correct = type.tgt === 'dec' ? n.toString() : type.tgt === 'bin' ? n.toString(2) : type.tgt === 'hex' ? n.toString(16).toUpperCase() : n.toString(8);
        const wrongs = new Set();
        while (wrongs.size < 3) {
          const fake = n + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
          if (fake > 0 && fake !== n) {
            const fakeStr = type.tgt === 'dec' ? fake.toString() : type.tgt === 'bin' ? fake.toString(2) : type.tgt === 'hex' ? fake.toString(16).toUpperCase() : fake.toString(8);
            if (fakeStr !== correct) wrongs.add(fakeStr);
          }
        }
        const opts = [correct, ...[...wrongs]].sort(() => Math.random() - 0.5);
        document.getElementById('q-options').innerHTML = opts.map(o =>
          `<button class="quiz-opt" onclick="answerQuiz('${o}','${correct}')">${o}</button>`
        ).join('');
      }

      function answerQuiz(chosen, correct) {
        if (quizState.answered) return;
        quizState.answered = true;
        document.querySelectorAll('.quiz-opt').forEach(o => {
          o.disabled = true;
          if (o.textContent === correct) o.classList.add('correct');
          if (o.textContent === chosen && chosen !== correct) o.classList.add('wrong');
        });
        const fb = document.getElementById('q-feedback');
        if (chosen === correct) {
          quizState.correct++; quizState.streak++;
          fb.style.color = 'var(--green)';
          fb.textContent = `Correct! Streak: ${quizState.streak}`;
        } else {
          quizState.wrong++; quizState.streak = 0;
          fb.style.color = 'var(--red)';
          fb.textContent = `Wrong — answer was ${correct}`;
        }
        updateScoreUI();
        document.getElementById('q-next').style.display = 'block';
      }

      function updateScoreUI() {
        document.getElementById('q-correct').textContent = quizState.correct;
        document.getElementById('q-wrong').textContent = quizState.wrong;
        document.getElementById('q-streak').textContent = quizState.streak;
      }
