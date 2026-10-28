(function () {
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

    if (mode === '4x4') {
      return `${dd}${a}${b}${c}`.slice(0, 4).padStart(4, '0');
    }

    if (mode === '3x3') {
      return `${a}${b}${c}`.slice(0, 3).padStart(3, '0');
    }

    return '';
  }

  function resolveSeed(inputId, mode, dateValue) {
    const input = document.getElementById(inputId);
    const manual = sanitizeDigits(input?.value || '', mode === '4x4' ? 4 : 3);
    if (manual) return manual.padStart(mode === '4x4' ? 4 : 3, '0');
    return getAutoSeedFromDate(dateValue, mode);
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

  function matrixSum(matrix) {
    return matrix.flat().reduce((sum, value) => sum + value, 0);
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

  function computeGeometry(seed4, seed3) {
    const variants = new Set();
    const digits4 = String(seed4).split('');
    const digits3 = String(seed3).split('');

    for (const arr of [digits4, digits3]) {
      variants.add(arr.slice().reverse().join(''));
      if (arr.length >= 2) {
        const swapped = [...arr];
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        variants.add(swapped.join(''));
      }
    }

    const values = [...variants].filter(Boolean);
    const mirror = values.length > 0 ? values[0] : '000';

    return {
      label: values.length > 0 ? `Mirror / Geometry OK (${mirror})` : 'Geometry neutral',
      score: values.length * 10
    };
  }

  function computeTrajectory(dateValue, seed4, seed3) {
    const raw = dateValue || new Date().toISOString().split('T')[0];
    const [year, month, day] = raw.split('-');
    const yy = Number(String(year || '2026').slice(-2));
    const mm = Number(month || '1');
    const dd = Number(day || '1');

    const total = yy + mm + dd;
    const seedTotal = digitsOf(seed4, 4).reduce((sum, v) => sum + v, 0) + digitsOf(seed3, 3).reduce((sum, v) => sum + v, 0);
    const delta = (total - seedTotal) % 10;

    return {
      label: delta >= 5 ? 'Trajectory upward' : 'Trajectory stable',
      score: delta + 1
    };
  }

  function computeWeightedScore({ freqMap, matrix4x4, matrix3x3, geometry, trajectory }) {
    const sortedDigits = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
    const topDigit = sortedDigits[0] ? sortedDigits[0][0] : 0;
    const score =
      (sortedDigits[0]?.[1] ?? 0) * 2.2 +
      matrix4x4 * 0.8 +
      matrix3x3 * 1.0 +
      geometry.score * 0.9 +
      trajectory.score * 1.4;

    let label = 'Medium zone';
    if (score >= 90) label = 'High priority zone';
    else if (score >= 70) label = 'Strong signal';
    else if (score >= 50) label = 'Watch zone';

    return { label, score, topDigit };
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
    const seed4 = resolveSeed('matrixSeed4x4', '4x4', dateValue);
    const seed3 = resolveSeed('matrixSeed3x3', '3x3', dateValue);

    const matrix4x4 = buildMatrix4x4(seed4);
    const matrix3x3 = buildMatrix3x3(seed3);
    const freqMap = getFrequency([seed4, seed3]);
    const matrix4Score = matrixSum(matrix4x4);
    const matrix3Score = matrixSum(matrix3x3);
    const geometry = computeGeometry(seed4, seed3);
    const trajectory = computeTrajectory(dateValue, seed4, seed3);
    const weighted = computeWeightedScore({
      freqMap,
      matrix4x4: matrix4Score,
      matrix3x3: matrix3Score,
      geometry,
      trajectory
    });

    renderMatrix('matrix4x4', matrix4x4);
    renderMatrix('matrix3x3', matrix3x3);

    const status = document.getElementById('finalStatus');
    if (status) {
      status.innerHTML = `
        <div><strong>Seed 4x4:</strong> ${seed4}</div>
        <div><strong>Seed 3x3:</strong> ${seed3}</div>
        <div><strong>Top digit:</strong> ${weighted.topDigit}</div>
        <div><strong>Matrix 4x4:</strong> ${matrix4Score}</div>
        <div><strong>Matrix 3x3:</strong> ${matrix3Score}</div>
        <div><strong>Geometry:</strong> ${geometry.label}</div>
        <div><strong>Trajectory:</strong> ${trajectory.label}</div>
        <div><strong>Weighted rank:</strong> ${weighted.label}</div>
        <div><strong>Score:</strong> ${weighted.score.toFixed(2)}</div>
      `;
    }

    const finalCandidate = document.getElementById('finalCandidate');
    if (finalCandidate) {
      finalCandidate.textContent = `${seed4} / ${seed3}`;
    }
  }

  function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = today;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setDefaultDates();

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', renderProtocol);
    }

    const startDate = document.getElementById('startDate');
    if (startDate) {
      startDate.addEventListener('change', renderProtocol);
    }

    const endDate = document.getElementById('endDate');
    if (endDate) {
      endDate.addEventListener('change', renderProtocol);
    }

    renderProtocol();
  });
})();
