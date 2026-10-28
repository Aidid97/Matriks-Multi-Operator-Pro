document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('tarikhCabutan');
    const btnJana = document.getElementById('btnJana');
    const btnReset = document.getElementById('btnReset');

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        autoJanaBenihTarikh();
        dateInput.addEventListener('change', autoJanaBenihTarikh);
    }

    if (btnJana) {
        btnJana.addEventListener('click', janaKeputusanToto);
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetBorang);
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

function kiraPemberatToto(sejarahCabutan) {
    if (!Array.isArray(sejarahCabutan) || sejarahCabutan.length === 0) {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    }

    const skor = [];
    const t3 = sejarahCabutan.slice(0, 3).join('');
    const t5 = sejarahCabutan.slice(0, 5).join('');
    const t15 = sejarahCabutan.slice(0, 15).join('');

    const wMicro = 0.55;
    const wVelocity = 0.45;

    for (let i = 0; i <= 9; i++) {
        const digit = String(i);
        const fMikro = t3 ? (t3.split(digit).length - 1) : 0;
        const cT5 = t5 ? (t5.split(digit).length - 1) : 0;
        const cT15 = t15 ? (t15.split(digit).length - 1) : 0;

        const vel5 = t5 ? (cT5 / 5) : 0;
        const vel15 = t15 ? (cT15 / 15) : 0;
        const halaju = vel5 - vel15;

        skor.push({ digit, skorAkhir: (wMicro * fMikro) + (wVelocity * halaju) });
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

function janaKeputusanToto() {
    const seedInput = document.getElementById('num1');
    const drawIndukInput = document.getElementById('drawInduk');
    const historyInput = document.getElementById('history');

    if (!seedInput || !drawIndukInput || !historyInput) {
        alert('Elemen borang tidak dijumpai. Sila muat semula laman.');
        return;
    }

    const seedStr = sanitizeDigits(seedInput.value, 4);
    const drawIndukStr = sanitizeDigits(drawIndukInput.value, 4);
    const historyRaw = historyInput.value || '';

    if (seedStr.length !== 4) {
        alert('Nombor draw harini 4x4 mesti 4 digit.');
        return;
    }

    if (drawIndukStr.length < 3) {
        alert('Nombor draw induk 3x3 sekurang-kurangnya 3 digit.');
        return;
    }

    const matchHasil = historyRaw.match(/\d{4}/g) || [];
    const sejarahCabutan = matchHasil.map((num) => num.trim());

    const matrixK1 = binaMatriks4x4(seedStr);
    const matrix3x3 = binaMatriks3x3Induk(drawIndukStr);

    const set4x4 = new Set(matrixK1.flat());
    const set3x3 = new Set(matrix3x3.flat());
    let persilanganEmas = Array.from(set4x4).filter((d) => set3x3.has(d)).map(String);

    const sortedPemberat = kiraPemberatToto(sejarahCabutan);
    const anjakanData = kiraTrajektoriAnjakan(sortedPemberat);
    const hotDigits = anjakanData.paksi;

    if (persilanganEmas.length === 0) {
        persilanganEmas = anjakanData.sasaran;
    }

    const validPool = [...persilanganEmas, ...hotDigits];
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
    const num1 = document.getElementById('num1');
    const drawInduk = document.getElementById('drawInduk');

    if (hist) hist.value = '';
    if (num1) num1.value = '';
    if (drawInduk) drawInduk.value = '6205';
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
