(function () {
  const labelBank = [
    'HOT','PAIR','AXIS','MIRROR','TREND','FLOW','CROSS','GAP',
    'ENTRY','CYCLE','SYNC','STABLE','LAG','LAYER','OPEN','CLOSE',
    'SEAR','SHIFT','EDGE','LOCK','WAVE','ZIG','DRIFT','SPARK','PATH',
    'CORE','BEND','LINK','RANGE','PLAIN','SEAL','WIDE','SPAN'
  ];

  function normalizeDigits(value, targetLength, fallback = '0000') {
    const raw = String(value ?? '').replace(/\D/g, '');
    if (!raw) return String(fallback).slice(0, targetLength).padStart(targetLength, '0');
    return raw.slice(0, targetLength).padStart(targetLength, '0');
  }

  function digitsOf(value, length = 4) {
    return String(value ?? '').replace(/\D/g, '').padStart(length, '0').slice(0, length).split('').map(Number);
  }

  function buildMatrix4x4(seed) {
    const digits = digitsOf(seed, 4);
    const matrix = [digits.slice()];

    for (let r = 1; r < 4; r++) {
      const row = [];
      for (let c = 0; c < 4; c++) {
        row.push((matrix[r - 1][c] + 1) % 10);
      }
      matrix.push(row);
    }

    return matrix;
  }

  function buildMatrix3x3(seed) {
    const digits = digitsOf(seed, 3);
    const matrix = [digits.slice()];

    for (let r = 1; r < 3; r++) {
      const row = [];
      for (let c = 0; c < 3; c++) {
        row.push((matrix[r - 1][c] + 2) % 10);
      }
      matrix.push(row);
    }

    return matrix;
  }

  function getFrequency(results) {
    const map = new Map();
    for (const value of results) {
      const digits = digitsOf(value, 4);
      for (const digit of digits) {
        map.set(digit, (map.get(digit) || 0) + 1);
      }
    }
    return map;
  }

  function makeStatusText(freqMap, matrix4x4, matrix3x3) {
    const sortedDigits = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
    const top = sortedDigits[0] ? sortedDigits[0][0] : 0;
    const rowScore = matrix4x4.flat().reduce((sum, v) => sum + v, 0);
    const threeScore = matrix3x3.flat().reduce((sum, v) => sum + v, 0);

    return `Normalisasi data aktif. Digit utama pada zon ${top}. Skor matrix 4x4 = ${rowScore}, matrix 3x3 = ${threeScore}. Protokol berjalan dalam urutan: normalize → frequency → matrix → geometry → trajectory → weighted ranking.`;
  }

  function renderMatrix(targetId, matrix) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerHTML = '';

    matrix.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = `${rowIndex + 1}:${colIndex + 1}`;

        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = String(cellValue);

        cell.appendChild(tag);
        cell.appendChild(number);
        target.appendChild(cell);
      });
    });
  }

  function renderProtocol() {
    const seed4x4 = document.getElementById('matrixSeed4x4');
    const seed3x3 = document.getElementById('matrixSeed3x3');
    const resultBox = document.getElementById('finalStatus');

    const value4x4 = normalizeDigits(seed4x4?.value || '6204', 4, '6204');
    const value3x3 = normalizeDigits(seed3x3?.value || '620', 3, '620');

    const matrix4x4 = buildMatrix4x4(value4x4);
    const matrix3x3 = buildMatrix3x3(value3x3);
    const freqMap = getFrequency([value4x4, value3x3]);

    renderMatrix('matrix4x4', matrix4x4);
    renderMatrix('matrix3x3', matrix3x3);

    resultBox.textContent = makeStatusText(freqMap, matrix4x4, matrix3x3);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const generateBtn = document.getElementById('generateBtn');
    const seed4x4 = document.getElementById('matrixSeed4x4');
    const seed3x3 = document.getElementById('matrixSeed3x3');

    if (startDate) startDate.value = '2026-10-01';
    if (endDate) endDate.value = '2026-10-28';
    if (seed4x4) seed4x4.value = '6204';
    if (seed3x3) seed3x3.value = '620';

    if (generateBtn) {
      generateBtn.addEventListener('click', renderProtocol);
    }

    renderProtocol();
  });
})();
