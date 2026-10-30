class EnjinDwiCartaToto {
    constructor() {
        this.MIRROR_MAP = {
            '0':'5', '1':'6', '2':'7', '3':'8', '4':'9',
            '5':'0', '6':'1', '7':'2', '8':'3', '9':'4'
        };
    }

    sortCombo(teksNombor) {
        if (!teksNombor) return '';
        return teksNombor.split('').sort().join('');
    }

    // 1. CARTA MATRIKS 4x4 (FORMULA TOLAK 1)
    binaMatrix4x4Tolak1(nomborBase) {
        let nomborKemas = (nomborBase || '3594').replace(/[^0-9]/g, '');
        if (nomborKemas.length < 4) nomborKemas = '3594';

        let barisAsas = nomborKemas.substring(0, 4).split('').map(Number);
        let matriksLengkap = [barisAsas];

        for (let baris = 1; baris < 4; baris++) {
            let barisBaru = [];
            for (let lajur = 0; lajur < 4; lajur++) {
                let nilaiKiraan = (matriksLengkap[baris - 1][lajur] + 9) % 10;
                barisBaru.push(nilaiKiraan);
            }
            matriksLengkap.push(barisBaru);
        }
        return matriksLengkap;
    }

    // 2. CARTA MATRIKS 3x3 (FORMULA TARIKH LEBAH NAGA)
    binaMatrix3x3LebahNaga(tarikhInput) {
        let tarikhObj = tarikhInput ? new Date(tarikhInput) : new Date();
        if (isNaN(tarikhObj.getTime())) tarikhObj = new Date();

        let dd = tarikhObj.getDate();
        let mm = tarikhObj.getMonth() + 1;
        let yy = tarikhObj.getFullYear() % 100;

        let dTens = Math.floor(dd / 10);
        let dOnes = dd % 10;
        let mOnes = mm % 10;
        let yTens = Math.floor(yy / 10);

        let sumDigits = (dTens + dOnes) + (Math.floor(mm / 10) + mOnes) + (yTens + (yy % 10));
        let kunciNeptu = sumDigits > 0 ? (sumDigits + 1) : 13; 

        // BARIS 1: Asas Hari (Pola Geometri 3^n -> 139)
        let c1 = dTens > 0 ? dTens : (dOnes > 0 ? dOnes : 3);
        let l1 = Math.pow(c1, 0); 
        let r1 = Math.pow(c1, 2) % 10; 
        if (l1 + c1 + r1 !== kunciNeptu) {
            r1 = (kunciNeptu - (l1 + c1)) % 10;
        }

        // BARIS 2: Asas Tahun (Gandaan Paksi 2x -> 247)
        let l2 = yTens > 0 ? yTens : 2;
        let c2 = (l2 * 2) % 10; 
        let r2 = (kunciNeptu - (l2 + c2)) % 10; 
        if (r2 < 0) r2 += 10;

        // BARIS 3: Asas Bulan & Sifar Tarikh (508)
        let c3 = dOnes; 
        let l3 = Math.abs(kunciNeptu - 8); 
        let r3 = (kunciNeptu - (l3 + c3)) % 10; 
        if (r3 < 0) r3 += 10;

        return [
            [Math.abs(l1), Math.abs(c1), Math.abs(r1)],
            [Math.abs(l2), Math.abs(c2), Math.abs(r2)],
            [Math.abs(l3), Math.abs(c3), Math.abs(r3)]
        ];
    }

    // PENGESAN DIGIT HILANG (KEY MISSING DIGITS 0-9)
    kesanDigitHilang(m4x4, m3x3) {
        let setSemuaDigit = new Set();
        m4x4.forEach(row => row.forEach(val => setSemuaDigit.add(val)));
        m3x3.forEach(row => row.forEach(val => setSemuaDigit.add(val)));

        let digitHilang = [];
        for (let d = 0; d <= 9; d++) {
            if (!setSemuaDigit.has(d)) {
                digitHilang.push(d);
            }
        }
        return digitHilang;
    }

    // ANALISIS TRAJEKTORI SEJARAH RESULT TOTO
    kiraTrajektori(sejarahCabutan) {
        let senaraiSkor = [];
        let panjang = sejarahCabutan.length;
        let p3 = Math.min(3, panjang);
        let p5 = Math.min(5, panjang);

        let str3 = sejarahCabutan.slice(0, p3).join('');
        let str5 = sejarahCabutan.slice(0, p5).join('');

        for (let d = 0; d <= 9; d++) {
            let digitStr = d.toString();
            let freq3 = p3 > 0 ? (str3.split(digitStr).length - 1) : 0;
            let freq5 = p5 > 0 ? (str5.split(digitStr).length - 1) : 0;

            let markah = (freq3 * 0.75) + (freq5 * 0.4);
            senaraiSkor.push({ digitSasaran: digitStr, markahAkhir: markah });
        }

        senaraiSkor.sort((a, b) => b.markahAkhir - a.markahAkhir);
        return senaraiSkor;
    }

    // MODUL 2D: TRAJECTORY WEIGHT + EUCLIDEAN DISTANCE VECTOR
    janaSenarai2D(m4x4, senaraiObjekSkor, statusCermin) {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let petaKoordinat = {};
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let val = m4x4[r][c].toString();
                if (!petaKoordinat[val]) {
                    petaKoordinat[val] = [];
                }
                petaKoordinat[val].push({ x: c, y: r });
            }
        }

        let digitPanas = senaraiObjekSkor.slice(0, 6).map(item => item.digitSasaran);
        let senaraiCalon2D = [];

        for (let i = 0; i < digitPanas.length; i++) {
            for (let j = i + 1; j < digitPanas.length; j++) {
                let d1 = digitPanas[i];
                let d2 = digitPanas[j];
                let kombo = this.sortCombo(d1 + d2);

                let pos1 = petaKoordinat[d1] ? petaKoordinat[d1][0] : { x: 0, y: 0 };
                let pos2 = petaKoordinat[d2] ? petaKoordinat[d2][0] : { x: 3, y: 3 };

                // Formula Jarak Euclidean: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
                let deltaX = pos2.x - pos1.x;
                let deltaY = pos2.y - pos1.y;
                let jarakEuclidean = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

                let faktorVektor = jarakEuclidean > 0 ? (1 / jarakEuclidean) : 1.5;
                let skorProbabiliti = ((petaSkor[d1] || 0) + (petaSkor[d2] || 0)) * (1 + faktorVektor);

                senaraiCalon2D.push({ kombo: kombo, skor: skorProbabiliti });
            }
        }

        if (statusCermin) {
            digitPanas.forEach(d => {
                let mirrorD = this.MIRROR_MAP[d];
                if (mirrorD) {
                    let kombo = this.sortCombo(d + mirrorD);
                    let skorBonus = ((petaSkor[d] || 0) + (petaSkor[mirrorD] || 0)) * 1.25;
                    senaraiCalon2D.push({ kombo: kombo, skor: skorBonus });
                }
            });
        }

        let kedudukanPeta = new Map();
        senaraiCalon2D.forEach(item => {
            if (!kedudukanPeta.has(item.kombo) || kedudukanPeta.get(item.kombo) < item.skor) {
                kedudukanPeta.set(item.kombo, item.skor);
            }
        });

        return Array.from(kedudukanPeta.entries())
            .map(([kombo, skor]) => ({ kombo, skor }))
            .sort((a, b) => b.skor - a.skor)
            .map(item => item.kombo);
    }

    jana(nombor4D, tarikhInput, sejarahResult, statusCermin) {
        let m4x4 = this.binaMatrix4x4Tolak1(nombor4D);
        let m3x3 = this.binaMatrix3x3LebahNaga(tarikhInput);
        let missingDigits = this.kesanDigitHilang(m4x4, m3x3);
        let senaraiObjekSkor = this.kiraTrajektori(sejarahResult);

        let digitPanas = senaraiObjekSkor.map(item => item.digitSasaran);

        // Penjanaan 2D Berasaskan Vektor Jarak Euclidean & Trajektori
        let list2D = this.janaSenarai2D(m4x4, senaraiObjekSkor, statusCermin);

        // Penjanaan 3D Pilihan (Hot 2D + Center Lebah Naga)
        let centerLebahNaga = m3x3[1][1].toString();
        let core3D = this.sortCombo(digitPanas[0] + digitPanas[1] + centerLebahNaga);
        let alt3D = this.sortCombo(digitPanas[0] + digitPanas[2] + (missingDigits[0] !== undefined ? missingDigits[0] : '6'));
        let list3D = [...new Set([core3D, alt3D])];

        // Penjanaan 4D POD (3D Core + Key Missing Digit)
        let keyDigit = missingDigits.length > 0 ? missingDigits[0].toString() : '6';
        let target4D = this.sortCombo(core3D + keyDigit);

        let list4D = [target4D];
        missingDigits.forEach(m => {
            list4D.push(this.sortCombo(core3D + m.toString()));
        });

        return {
            matrix4x4: m4x4,
            matrix3x3: m3x3,
            missing: missingDigits,
            hasil2D: list2D,
            hasil3D: list3D,
            hasil4D: [...new Set(list4D)].slice(0, 8),
            pod: {
                top2D: list2D.slice(0, 3).join(', '),
                top3D: core3D,
                top4D: target4D
            }
        };
    }
}

const enjin = new EnjinDwiCartaToto();
let globalResult = null;

function lukisJadual4x4(matrix) {
    const table = document.getElementById('matrixTable4x4');
    table.innerHTML = '';
    matrix.forEach(row => {
        let tr = document.createElement('tr');
        row.forEach(val => {
            let td = document.createElement('td');
            td.innerText = val;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function lukisGrid3x3(matrix) {
    const grid = document.getElementById('matrixGrid3x3');
    grid.innerHTML = '';
    matrix.forEach(row => {
        row.forEach(val => {
            let div = document.createElement('div');
            div.className = 'cell-3x3';
            div.innerText = val;
            grid.appendChild(div);
        });
    });
}

function tunjukSenarai(idElement, dataArray) {
    const container = document.getElementById(idElement);
    container.innerHTML = '';
    dataArray.forEach(item => {
        let div = document.createElement('div');
        div.className = 'number-tag';
        div.innerText = item;
        container.appendChild(div);
    });
}

function janaKeputusan() {
    try {
        const inputNum1 = document.getElementById('num1').value.trim();
        const inputDate = document.getElementById('drawDate').value;
        const inputHistory = document.getElementById('history').value.trim();
        const statusCermin = document.getElementById('useMirror').checked;

        let historyArray = inputHistory.match(/\b\d{4}\b/g) || [];
        if (historyArray.length < 3) {
            historyArray = ["1508", "5241", "6336", "2203", "4065", "2464", "0431"];
        }

        globalResult = enjin.jana(inputNum1, inputDate, historyArray, statusCermin);

        lukisJadual4x4(globalResult.matrix4x4);
        lukisGrid3x3(globalResult.matrix3x3);

        document.getElementById('missing-digits').innerText = globalResult.missing.length > 0 ? globalResult.missing.join(', ') : 'Tiada (Semua Digit Wujud)';
        document.getElementById('pod-2d').innerText = globalResult.pod.top2D;
        document.getElementById('pod-3d').innerText = globalResult.pod.top3D;
        document.getElementById('pod-4d').innerText = globalResult.pod.top4D;

        tunjukSenarai('out-2d', globalResult.hasil2D);
        tunjukSenarai('out-3d', globalResult.hasil3D);
        tunjukSenarai('out-4d', globalResult.hasil4D);

        document.getElementById('hasil').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Ralat semasa menjana carta: " + err.message);
    }
}

function resetBorang() {
    document.getElementById('num1').value = '';
    document.getElementById('drawDate').valueAsDate = new Date();
    document.getElementById('history').value = '';
    document.getElementById('hasil').style.display = 'none';
    globalResult = null;
}

function salin(idElement) {
    const targetDiv = document.getElementById(idElement);
    if (!targetDiv) return;
    const tags = targetDiv.querySelectorAll('.number-tag');
    let text = Array.from(tags).map(t => t.innerText).join(', ');
    if (text) {
        navigator.clipboard.writeText(text).then(() => alert("Berjaya disalin: " + text));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('drawDate').valueAsDate = new Date();
});
