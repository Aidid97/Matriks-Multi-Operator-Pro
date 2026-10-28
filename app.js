(function () {
  const DEFAULT_4X4 = '6204';
  const DEFAULT_3X3 = '620';

  function sanitizeDigits(value, length) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.slice(0, length);
  }

  function digitsOf(value, length = 4) {
    const cleaned = sanitizeDigits(value, length);
    return cleaned.padStart(length, '0').slice(0, length).split('').map(Number);
  }

  function getAutoSeedFromDate(dateValue, mode) {
    const raw = dateValue || new Date().toISOString().split('T')[0];
    const [year, month, day] = raw.split('-');

    const yy = Number(String(year || '2026').slice(-2));
    const mm = Number(month || '1');
    const dd = Number(day || '1');

    const a = (yy + mm + dd) % 10;
    const b = (mm + dd) % 10;
    const c = (yy + dd) % 10;
    const d = (yy + mm) % 10;

    if (mode === '4x4') {
      return `${dd}${a}${b}${c}`.slice(0, 4).padStart(4, '0');
    }

    if (mode === '3x3') {
      return `${a}${b}${c}`.slice(0, 3).padStart(3, '0');
    }

    return '';
  }

  function resolveSeed(inputId, autoMode) {
    const input = document.getElementById(inputId);
    const dateValue = document.getElementById('startDate')?.value || document.getElementById('endDate')?.value || new Date().toISOString().split('T')[0];
    const manual = sanitizeDigits(input?.value || '', autoMode === '4x4' ? 4 : 3);

    if (manual) return manual.padStart(autoMode === '4x4' ? 4 : 3, '0');
    return getAutoSeedFromDate(dateValue, autoMode);
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
    const score4 = matrix4x4.flat().reduce((sum, v) => sum + v, 0);
    const score3 = matrix3x3.flat().reduce((sum, v) => sum + v, 0);

    return `Tarikh digunakan untuk auto-seed. Digit utama pada zon ${top}. Skor matrix 4x4 = ${score4}, matrix 3x3 = ${score3}. Protokol aktif: normalize → frequency → matrix → geometry → trajectory → weighted ranking.`;
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
    const dateValue = document.getElementById('startDate')?.value || new Date().toISOString().split('T')[0];
    const value4 = resolveSeed('matrixSeed4x4', '4x4');
    const value3 = resolveSeed('matrixSeed3x3', '3x3');

    const matrix4x4 = buildMatrix4x4(value4 || getAutoSeedFromDate(dateValue, '4x4'));
    const matrix3x3 = buildMatrix3x3(value3 || getAutoSeedFromDate(dateValue, '3x3'));
    const freqMap = getFrequency([value4 || getAutoSeedFromDate(dateValue, '4x4'), value3 || getAutoSeedFromDate(dateValue, '3x3')]);

    renderMatrix('matrix4x4', matrix4x4);
    renderMatrix('matrix3x3', matrix3x3);

    const status = document.getElementById('finalStatus');
    if (status) status.textContent = makeStatusText(freqMap, matrix4x4, matrix3x3);
  }

  function initDates() {
    const today = new Date().toISOString().split('T')[0];
    const start = document.getElementById('startDate');
    const end = document.getElementById('endDate');

    if (start) start.value = today;
    if (end) end.value = today;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDates();

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', renderProtocol);
    }

    const startDate = document.getElementById('startDate');
    if (startDate) {
      startDate.addEventListener('change', renderProtocol);
    }

    renderProtocol();
  });
})();
