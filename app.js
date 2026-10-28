document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('tarikhCabutan');
    const btnJana = document.getElementById('btnJana');
    const btnReset = document.getElementById('btnReset');
    const btnScan = document.getElementById('btnScanBulan');

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        autoJanaBenihTarikh();
        dateInput.addEventListener('change', autoJanaBenihTarikh);
    }

    if (btnJana) {
        btnJana.addEventListener('click', () => janaKeputusanToto());
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetBorang);
    }

    if (btnScan) {
        btnScan.addEventListener('click', () => janaRingkasanBulan());
    }

    document.querySelectorAll('.btn-copy').forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-copy');
            if (targetId) {
                salin(targetId);
            }
        });
    });
});

function sanitizeDigits(value, maxLength = 10) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\D/g, '').slice(0, maxLength);
}

function autoJanaBenihTarikh() {
    const dateInput = document.getElementById('tarikhCabutan');
    if (!dateInput || !dateInput.value) return;

    const [year, month, day] = dateInput.value.split('-');
    if (!year || !month || !day) return;

    const shortYear = String(year).slice(-2);
    const sumMonth = Number(month[0]) + Number(month[1] || 0);
    const sumYear = Number(shortYear[0]) + Number(shortYear[1] || 0);

    const digit3 = (sumMonth + 3) % 10;
    const digit4 = (sumYear + 3) % 10;

    const benih4D = String(day) + String(digit3) + String(digit4);
    const numField = document.getElementById('num1');
    if (numField) numField.value = benih4D;
}

function sortCombo(str) {
    return (str || '').split('').sort().join('');
}

function sumDigits(num) {
    return String(num)
        .split('')
        .reduce((total, ch) => total + Number(ch || 0), 0);
}

function dateGuide(dateStr) {
    const raw = dateStr || new Date().toISOString().split('T')[0];
    const parts = raw.includes('/') ? raw.split('/') : raw.split('-');
    const isoMode = raw.includes('-') && String(parts[0]).length === 4;

    let dayValue = 0;
    let monthValue = 0;
    let year2 = 0;

    if (isoMode) {
        const [year, month, day] = parts;
        dayValue = Number(day);
        monthValue = Number(month);
        year2 = Number(String(year).slice(-2));
    } else {
        const [day, month, year] = parts;
        dayValue = Number(day);
        monthValue = Number(month);
        year2 = Number(String(year).slice(-2));
    }

    const dSum = sumDigits(dayValue);
    const mSum = sumDigits(monthValue);
    const ySum = sumDigits(year2);

    const root = [dSum % 10, mSum % 10, (dSum + mSum + ySum) % 10].map(String);
    const row1 = [...root];
    const row2 = row1.map((v) => String((Number(v) - 1 + 10) % 10));
    const row3 = row2.map((v) => String((Number(v) - 1 + 10) % 10));
    const shadow = root.map((v) => String((Number(v) + 5) % 10));
    const mirror = root.map((v) => String((9 - Number(v)) % 10));

    return { root, row1, row2, row3, shadow, mirror };
}

function isTotoDrawDay(dateObj) {
    const day = dateObj.getDay();
    return day === 3 || day === 6 || day === 0;
}

function getTotoDrawDates(year, monthIndex) {
    const dates = [];
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);

    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
        if (isTotoDrawDay(d)) {
            dates.push(new Date(d));
        }
    }

    return dates;
}

function scanMonthPattern(year, monthIndex) {
    const drawDates = getTotoDrawDates(year, monthIndex);
    const results = [];

    drawDates.forEach((dateObj) => {
        const dateStr = dateObj.toISOString().split('T')[0];
        const guide = dateGuide(dateStr);
        results.push({
            date: dateStr,
            root: guide.root.join(''),
            row1: guide.row1.join(''),
            row2: guide.row2.join(''),
            row3: guide.row3.join(''),
            shadow: guide.shadow.join(''),
            mirror: guide.mirror.join(''),
            day: dateObj.getDay()
        });
    });

    return results;
}

function summarizeMonthResults(results) {
    const allDigits = results.flatMap((item) => [
        ...item.root.split(''),
        ...item.row1.split(''),
        ...item.row2.split(''),
        ...item.row3.split(''),
        ...item.shadow.split(''),
        ...item.mirror.split('')
    ]);

    const freq = {};
    allDigits.forEach((d) => {
        freq[d] = (freq[d] || 0) + 1;
    });

    const sortedDigits = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const strongest = results
        .map((item) => ({
            date: item.date,
            score: item.root.split('').reduce((sum, v) => sum + Number(v), 0) + item.shadow.split('').reduce((sum, v) => sum + Number(v), 0)
        }))
        .sort((a, b) => b.score - a.score)[0];

    const strongTriple = results
        .map((item) => item.root)
        .reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

    const strongestRoot = Object.entries(strongTriple).sort((a, b) => b[1] - a[1])[0];

    const commonPairs = [];
    for (let i = 0; i < 10; i++) {
        const count = allDigits.filter((d) => d === String(i)).length;
        if (count >= 2) {
            commonPairs.push({ digit: String(i), count });
        }
    }

    return {
        strongestDate: strongest ? strongest.date : '-',
        strongestScore: strongest ? strongest.score : 0,
        mostCommonDigits: sortedDigits.map(([digit, count]) => ({ digit, count })),
        strongestRoot: strongestRoot ? { root: strongestRoot[0], count: strongestRoot[1] } : { root: '-', count: 0 },
        repeatedDigits: commonPairs
    };
}

function janaRingkasanBulan() {
    const dateInput = document.getElementById('tarikhCabutan');
    if (!dateInput || !dateInput.value) {
        alert('Sila pilih tarikh cabutan terlebih dahulu.');
        return;
    }

    const chosen = new Date(dateInput.value);
    const year = chosen.getFullYear();
    const monthIndex = chosen.getMonth();
    const results = scanMonthPattern(year, monthIndex);
    const summary = summarizeMonthResults(results);

    const summaryBox = document.getElementById('summaryBulan');
    if (!summaryBox) {
        alert('Kotak ringkasan bulan tidak dijumpai.');
        return;
    }

    const strongDigits = summary.mostCommonDigits.slice(0, 5).map((item) => `${item.digit} (${item.count})`).join(', ') || '-';
    const repeated = summary.repeatedDigits.slice(0, 5).map((item) => `${item.digit} (${item.count})`).join(', ') || '-';

    summaryBox.innerHTML = `
        <div class="result-box" style="border-left-color:#2b6cb0; background:#f0f7ff;">
            <p style="margin:0; font-weight:bold;">📅 Ringkasan Pola Tarif Bulan Ini</p>
            <p style="margin:8px 0 0 0;"><strong>Tarikh Terkuat:</strong> ${summary.strongestDate} (score ${summary.strongestScore})</p>
            <p style="margin:6px 0 0 0;"><strong>Root Terkuat:</strong> ${summary.strongestRoot.root} (${summary.strongestRoot.count} kali)</p>
            <p style="margin:6px 0 0 0;"><strong>Digit Paling Kerap:</strong> ${strongDigits}</p>
            <p style="margin:6px 0 0 0;"><strong>Digit Berulang:</strong> ${repeated}</p>
        </div>
    `;
}

window.scanMonthPattern = scanMonthPattern;
window.summarizeMonthResults = summarizeMonthResults;
window.janaRingkasanBulan = janaRingkasanBulan;

function binaMatriks3x3Induk(drawStr) {
    const normalized = sanitizeDigits(drawStr || '6205', 4);
    const baseDigits = normalized.split('').map(Number);

    while (baseDigits.length < 3) {
        baseDigits.push(0);
    }

    const r1 = [baseDigits[0] || 0, baseDigits[1] || 0, baseDigits[2] || 0];
    const r2 = r1.map((val) => (val - 1 + 10) % 10);
    const r3 = r2.map((val) => (val - 1 + 10) % 10);

    const rawGrid = [...r1, ...r2, ...r3];
    const mirrorMap = { '0': '5', '1': '6', '2': '7', '3': '8', '4': '9', '5': '0', '6': '1', '7': '2', '8': '3', '9': '4' };
    const seen = new Set();
    const finalGrid = [];

    rawGrid.forEach((num) => {
        let val = num;
        while (seen.has(val)) {
            val = Number(mirrorMap[String(val)] || val);
            if (seen.has(val)) val = (val + 1) % 10;
        }
        seen.add(val);
        finalGrid.push(val);
    });

    return [
        [finalGrid[0], finalGrid[1], finalGrid[2]],
        [finalGrid[3], finalGrid[4], finalGrid[5]],
        [finalGrid[6], finalGrid[7], finalGrid[8]]
    ];
}

function binaMatriks4x4(seedStr) {
    const normalized = sanitizeDigits(seedStr || '6204', 4);
    let baseRow = normalized.split('').map(Number);
    while (baseRow.length < 4) baseRow.push(0);
    baseRow = baseRow.slice(0, 4);

    const matrix = [baseRow];
    for (let r = 1; r < 4; r++) {
        const row = [];
        for (let c = 0; c < 4; c++) {
            const val = (matrix[r - 1][c] - 1 + 10) % 10;
            row.push(val);
        }
        matrix.push(row);
    }
    return matrix;
}

function ekstrakPolaMatrix(matrix) {
    return {
        'Pola L (Biasa)': `${matrix[0][0]}${matrix[1][0]}${matrix[2][0]}${matrix[2][1]}`,
        'Pola L (Terbalik)': `${matrix[0][3]}${matrix[1][3]}${matrix[2][3]}${matrix[2][2]}`,
        'Pola T (Biasa)': `${matrix[0][0]}${matrix[0][1]}${matrix[0][2]}${matrix[1][1]}`,
        'Pola T (Terbalik)': `${matrix[3][0]}${matrix[3][1]}${matrix[3][2]}${matrix[2][1]}`,
        'Pola Y (Cabang)': `${matrix[0][1]}${matrix[0][3]}${matrix[1][2]}${matrix[2][2]}`,
        'Pola O (KotakDalam)': `${matrix[1][1]}${matrix[1][2]}${matrix[2][2]}${matrix[2][1]}`,
        'Pepenjuru Kanan': `${matrix[0][0]}${matrix[1][1]}${matrix[2][2]}${matrix[3][3]}`,
        'Pepenjuru Kiri': `${matrix[0][3]}${matrix[1][2]}${matrix[2][1]}${matrix[3][0]}`,
        'Zig Zag (Kiri)': `${matrix[0][0]}${matrix[1][1]}${matrix[2][0]}${matrix[3][1]}`,
        'Zig Zag (Kanan)': `${matrix[0][3]}${matrix[1][2]}${matrix[2][3]}${matrix[3][2]}`
    };
}

function renderPolaGrid(polaObj) {
    const gridEl = document.getElementById('gridPola');
    if (!gridEl) return;

    let html = '';
    Object.entries(polaObj).forEach(([label, value]) => {
        html += `<div class="pattern-box"><span class="pattern-sumber">${label}</span><span class="pattern-value">${value}</span></div>`;
    });
    gridEl.innerHTML = html;
}

function getHariPemberatProfile(dateStr) {
    const referenceDate = dateStr ? new Date(dateStr) : new Date();
    const hari = referenceDate.getDay();

    if (hari === 3) {
        return { wMicro: 0.65, wVelocity: 0.35, driftMultiplier: 1.0, label: 'stabil' };
    }

    if (hari === 6) {
        return { wMicro: 0.68, wVelocity: 0.32, driftMultiplier: 1.1, label: 'stabil-sederhana' };
    }

    if (hari === 0) {
        return { wMicro: 0.58, wVelocity: 0.42, driftMultiplier: 1.5, label: 'agresif' };
    }

    return { wMicro: 0.60, wVelocity: 0.40, driftMultiplier: 1.2, label: 'normal' };
}

function evaluateHistory(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return { strength: 0.5, volatility: 0.5, mirrorScore: 0.5, recency: 0.5 };
    }

    const recent = history.slice(0, 10);
    const digitFreq = {};

    recent.join('').split('').forEach((digit) => {
        digitFreq[digit] = (digitFreq[digit] || 0) + 1;
    });

    const strength = Object.values(digitFreq).reduce((total, value) => total + value, 0) / (recent.length * 4);
    const volatility = 1 - strength;

    return {
        strength: Math.min(Math.max(strength, 0), 1),
        volatility: Math.min(Math.max(volatility, 0), 1),
        mirrorScore: 0.5,
        recency: 0.7
    };
}

function adaptWeights(history, dateStr) {
    const profile = getHariPemberatProfile(dateStr);
    const stats = evaluateHistory(history);

    let wMicro = profile.wMicro;
    let wVelocity = profile.wVelocity;
    let driftMultiplier = profile.driftMultiplier;

    if (stats.strength > 0.6) {
        wMicro += 0.06;
    } else {
        wMicro -= 0.03;
    }

    if (stats.volatility > 0.5) {
        wVelocity += 0.06;
        driftMultiplier += 0.2;
    } else {
        wVelocity -= 0.02;
        driftMultiplier -= 0.05;
    }

    wMicro = Math.min(Math.max(wMicro, 0.45), 0.75);
    wVelocity = Math.min(Math.max(wVelocity, 0.20), 0.55);
    driftMultiplier = Math.min(Math.max(driftMultiplier, 0.8), 1.8);

    return { wMicro, wVelocity, driftMultiplier };
}

function parseResultMatches(rawText) {
    if (!rawText) return [];
    const matches = rawText.match(/\d{4}/g) || [];
    return matches.map((num) => num.trim());
}

function normalizeRemoteHistory(payload) {
    if (!payload) return [];

    if (Array.isArray(payload)) {
        return payload
            .map((entry) => {
                if (typeof entry === 'string') return entry;
                if (entry && typeof entry === 'object') {
                    return entry.result || entry.draw || entry.drawNumber || entry.number || entry.num || entry.value || '';
                }
                return '';
            })
            .filter((value) => /\d{4}/.test(String(value)))
            .map((value) => String(value).replace(/\D/g, '').slice(0, 4));
    }

    if (typeof payload === 'object') {
        const candidates = [payload.results, payload.data, payload.history, payload.draws, payload.toto, payload.items, payload.list];
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return normalizeRemoteHistory(candidate);
            }
        }
    }

    return parseResultMatches(String(payload));
}

async function muatDataLuaran() {
    const sourceInput = document.getElementById('resultSource');
    if (!sourceInput || !sourceInput.value) {
        return [];
    }

    try {
        const response = await fetch(sourceInput.value, { method: 'GET' });
        if (!response.ok) {
            return [];
        }

        const payload = await response.json();
        return normalizeRemoteHistory(payload);
    } catch (error) {
        return [];
    }
}

function kiraPemberatToto(sejarahCabutan, dateStr) {
    if (!Array.isArray(sejarahCabutan) || sejarahCabutan.length === 0) {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    }

    const adaptive = adaptWeights(sejarahCabutan, dateStr);
    const skor = [];
    const t3 = sejarahCabutan.slice(0, 3).join('');
    const t5 = sejarahCabutan.slice(0, 5).join('');
    const t15 = sejarahCabutan.slice(0, 15).join('');

    for (let i = 0; i <= 9; i++) {
        const digit = String(i);
        const fMikro = t3 ? (t3.split(digit).length - 1) : 0;
        const cT5 = t5 ? (t5.split(digit).length - 1) : 0;
        const cT15 = t15 ? (t15.split(digit).length - 1) : 0;

        const vel5 = t5 ? (cT5 / 5) : 0;
        const vel15 = t15 ? (cT15 / 15) : 0;
        const halaju = (vel5 - vel15) * adaptive.driftMultiplier;

        skor.push({
            digit,
            skorAkhir: (adaptive.wMicro * fMikro) + (adaptive.wVelocity * halaju)
        });
    }

    return skor.sort((a, b) => b.skorAkhir - a.skorAkhir).map((x) => x.digit);
}

function kiraTrajektoriAnjakan(sortedPemberat) {
    const paksiKekal = sortedPemberat.slice(0, 3);
    const sasaranSisipan = sortedPemberat.slice(-3);
    const janaan4D = new Set();
    const blokAsas = paksiKekal.join('');

    sasaranSisipan.forEach((sasaran) => {
        janaan4D.add(blokAsas + sasaran);
        janaan4D.add(paksiKekal[0] + sasaran + paksiKekal[1] + paksiKekal[2]);
    });

    return {
        paksi: paksiKekal,
        sasaran: sasaranSisipan,
        janaan4D: Array.from(janaan4D).slice(0, 6)
    };
}

async function janaKeputusanToto() {
    const seedInput = document.getElementById('num1');
    const drawIndukInput = document.getElementById('drawInduk');
    const historyInput = document.getElementById('history');
    const tarikhCabutanInput = document.getElementById('tarikhCabutan');

    if (!seedInput || !drawIndukInput || !historyInput) {
        alert('Elemen borang tidak dijumpai. Sila muat semula laman.');
        return;
    }

    const seedStr = sanitizeDigits(seedInput.value, 4);
    const drawIndukStr = sanitizeDigits(drawIndukInput.value, 4);
    const historyManual = historyInput.value || '';
    const tarikhCabutan = tarikhCabutanInput ? tarikhCabutanInput.value : '';

    if (seedStr.length !== 4) {
        alert('Nombor draw harini 4x4 mesti 4 digit.');
        return;
    }

    if (drawIndukStr.length < 3) {
        alert('Nombor draw induk 3x3 sekurang-kurangnya 3 digit.');
        return;
    }

    const historyLuaran = await muatDataLuaran();
    const historyManualList = parseResultMatches(historyManual);
    const combinedHistory = [...new Set([...historyLuaran, ...historyManualList])];

    const guide = dateGuide(tarikhCabutan || new Date().toISOString().split('T')[0]);
    const guidePool = [
        ...guide.root,
        ...guide.row1,
        ...guide.row2,
        ...guide.row3,
        ...guide.shadow,
        ...guide.mirror
    ];

    const matrixK1 = binaMatriks4x4(seedStr);
    const matrix3x3 = binaMatriks3x3Induk(drawIndukStr);

    const set4x4 = new Set(matrixK1.flat());
    const set3x3 = new Set(matrix3x3.flat());
    let persilanganEmas = Array.from(set4x4).filter((d) => set3x3.has(d)).map(String);

    const sortedPemberat = kiraPemberatToto(combinedHistory, tarikhCabutan);
    const anjakanData = kiraTrajektoriAnjakan(sortedPemberat);
    const hotDigits = anjakanData.paksi;

    if (persilanganEmas.length === 0) {
        persilanganEmas = anjakanData.sasaran;
    }

    const validPool = [...new Set([...persilanganEmas, ...hotDigits, ...guidePool])];
    const uniquePool = Array.from(new Set(validPool));

    const c1 = uniquePool[0] || '0';
    const c2 = uniquePool[1] || uniquePool[0] || '1';
    const c3 = uniquePool[2] || uniquePool[1] || '2';
    const c4 = uniquePool[3] || uniquePool[0] || '3';

    const core3D_1 = sortCombo(c1 + c2 + c3);
    const core3D_2 = sortCombo(c1 + c2 + c4);
    const core3D_3 = sortCombo(c2 + c3 + c4);

    const d2_1 = sortCombo(c1 + c2);
    const d2_2 = sortCombo(c1 + c3);

    const t4_1 = sortCombo(core3D_1 + c4);
    const t4_2 = sortCombo(core3D_2 + c1);

    lukisJadual4x4(matrixK1, 'matrixTable');
    lukisJadual3x3(matrix3x3, 'matrix3x3Table');
    renderPolaGrid(ekstrakPolaMatrix(matrixK1));

    const masterKey = document.getElementById('master-key');
    const intersectionKey = document.getElementById('intersection-key');
    const s4d = document.getElementById('s4d');
    const anjakanPaksi = document.getElementById('anjakan-paksi');
    const anjakanSasaran = document.getElementById('anjakan-sasaran');

    if (masterKey) masterKey.textContent = hotDigits.join(' / ');
    if (intersectionKey) intersectionKey.textContent = persilanganEmas.join(' / ');
    if (s4d) s4d.textContent = t4_1;
    if (anjakanPaksi) anjakanPaksi.textContent = anjakanData.paksi.join(' - ');
    if (anjakanSasaran) anjakanSasaran.textContent = anjakanData.sasaran.join(', ');

    tunjukSenarai('out-anjakan-4d', anjakanData.janaan4D);
    tunjukSenarai('out-2d', [d2_1, d2_2, sortCombo(c2 + c3)]);
    tunjukSenarai('out-3d', [core3D_1, core3D_2, core3D_3]);

    const output4D = [t4_1, t4_2];
    if (anjakanData.janaan4D[0]) output4D.push(sortCombo(anjakanData.janaan4D[0]));
    tunjukSenarai('out-4d', [...new Set(output4D)]);

    const hasil = document.getElementById('hasil');
    if (hasil) hasil.style.display = 'block';
}

function lukisJadual4x4(matrix, elementId) {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;

    let html = '';
    for (let r = 0; r < matrix.length; r++) {
        html += '<tr>';
        for (let c = 0; c < matrix[r].length; c++) {
            const bg = (r === 0) ? 'background:#fed7d7; color:#9b2c2c;' : '';
            html += `<td style="${bg}; width: 25%;">${matrix[r][c]}</td>`;
        }
        html += '</tr>';
    }
    tableEl.innerHTML = html;
}

function lukisJadual3x3(matrix, elementId) {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;

    let html = '';
    for (let r = 0; r < matrix.length; r++) {
        html += '<tr>';
        for (let c = 0; c < matrix[r].length; c++) {
            const bg = (r === 0) ? 'background:#e2e8f0; color:#1a365d;' : '';
            html += `<td style="${bg}; width: 33.33%;">${matrix[r][c]}</td>`;
        }
        html += '</tr>';
    }
    tableEl.innerHTML = html;
}

function tunjukSenarai(elementId, arr) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let html = '';
    arr.forEach((item) => {
        if (item) html += `<div class="number-tag" data-raw="${item}">${item}</div>`;
    });
    el.innerHTML = html;
}

function resetBorang() {
    const hist = document.getElementById('history');
    const hasil = document.getElementById('hasil');
    const summary = document.getElementById('summaryBulan');
    const num1 = document.getElementById('num1');
    const drawInduk = document.getElementById('drawInduk');
    const sourceUrl = document.getElementById('resultSource');

    if (hist) hist.value = '';
    if (num1) num1.value = '';
    if (drawInduk) drawInduk.value = '6205';
    if (sourceUrl) sourceUrl.value = '';
    if (summary) summary.innerHTML = '';
    if (hasil) hasil.style.display = 'none';
    autoJanaBenihTarikh();
}

function salin(id) {
    const container = document.getElementById(id);
    if (!container) return;

    const text = Array.from(container.querySelectorAll('.number-tag'))
        .map((el) => el.getAttribute('data-raw'))
        .filter(Boolean)
        .join(', ');

    if (!text) {
        alert('Tiada data untuk disalin.');
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Disalin: ' + text))
            .catch(() => alert('Clipboard tidak tersedia. Salinan teks: ' + text));
        return;
    }

    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        alert('Disalin: ' + text);
    } catch (error) {
        alert('Clipboard tidak tersedia. Salinan teks: ' + text);
    }
    document.body.removeChild(tempInput);
}
