class EnjinDwiCartaToto {
    constructor() {
        this.MIRROR_MAP = {
            '0':'5', '1':'6', '2':'7', '3':'8', '4':'9',
            '5':'0', '6':'1', '7':'2', '8':'3', '9':'4'
        };
    }

    sortCombo(teksNombor) {
        if (!teksNombor) return '';
        return teksNombor.toString().split('').sort().join('');
    }

    binaMatrix4x4Tolak1(nomborBase) {
        let nomborKemas = (nomborBase || '3594').toString().replace(/[^0-9]/g, '');
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

    binaMatrix3x3LebahNaga(tarikhInput) {
        let tarikhObj;
        if (tarikhInput) {
            let parts = tarikhInput.split('-');
            if (parts.length === 3) {
                tarikhObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            } else {
                tarikhObj = new Date(tarikhInput);
            }
        } else {
            tarikhObj = new Date();
        }

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

        let c1 = dTens > 0 ? dTens : (dOnes > 0 ? dOnes : 3);
        let l1 = Math.pow(c1, 0); 
        let r1 = Math.pow(c1, 2) % 10; 
        if (l1 + c1 + r1 !== kunciNeptu) {
            r1 = (kunciNeptu - (l1 + c1)) % 10;
        }

        let l2 = yTens > 0 ? yTens : 2;
        let c2 = (l2 * 2) % 10; 
        let r2 = (kunciNeptu - (l2 + c2)) % 10; 
        if (r2 < 0) r2 += 10;

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

    // MATRIKS BAYANGAN (SHADOW INDEX +5)
    binaMatrixBayangan3x3(m3x3) {
        return m3x3.map(baris => baris.map(val => (val + 5) % 10));
    }

    // KESAN NOMBOR KUNCI / LOCK DOMINAN
    kesanNomborKunciLock(m4x4, m3x3, m3x3Bayangan) {
        let setUtama = new Set();
        m4x4.forEach(row => row.forEach(val => setUtama.add(val)));
        m3x3.forEach(row => row.forEach(val => setUtama.add(val)));

        let digitHilangUtama = [];
        for (let d = 0; d <= 9; d++) {
            if (!setUtama.has(d)) {
                digitHilangUtama.push(d);
            }
        }

        let lockDominan = [];
        digitHilangUtama.forEach(digit => {
            let adaDalamBayangan = m3x3Bayangan.some(row => row.includes(digit));
            if (adaDalamBayangan) {
                lockDominan.push(digit);
            }
        });

        return {
            digitHilang: digitHilangUtama,
            kunciLock: lockDominan.length > 0 ? lockDominan : digitHilangUtama
        };
    }

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

    ekstraksiKunci3DDinamik(sejarahCabutan) {
        let kunci3DSenarai = [];
        let top3 = sejarahCabutan.slice(0, 3);

        top3.forEach(numStr => {
            let digits = numStr.toString().padStart(4, '0').split('').map(Number);
            let d1 = digits[0], d2 = digits[1], d3 = digits[2], d4 = digits[3];

            let dx = d3 - d1;
            let dy = d4 - d2;
            let deltaJarak = Math.round(Math.sqrt(dx * dx + dy * dy)) % 10;

            let k1 = (d1 + d4) % 10;
            let k2 = deltaJarak;
            let k3 = (d2 + d3) % 10;

            let combo3D = this.sortCombo(`${k1}${k2}${k3}`);
            kunci3DSenarai.push({ combo: combo3D, k1, k2, k3 });
        });

        return kunci3DSenarai;
    }

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
            .sort((a, b) => b.skor - a.skor);
    }

    janaSenarai3D(m3x3, m3x3Bayangan, objek2D, senaraiObjekSkor, kunciLock, sejarahCabutan) {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let centerLebahNaga = m3x3[1][1].toString();
        let centerBayangan = m3x3Bayangan[1][1].toString();
        let senaraiCalon3D = [];

        let kunciKhas3D = this.ekstraksiKunci3DDinamik(sejarahCabutan);
        kunciKhas3D.forEach(itemKunci => {
            senaraiCalon3D.push({ kombo: itemKunci.combo, skor: 4.5 });
        });

        let top2D = objek2D.slice(0, 5);
        top2D.forEach(item2D => {
            let combo2D = item2D.kombo;
            let score2D = item2D.skor;

            let c1 = this.sortCombo(combo2D + centerLebahNaga);
            senaraiCalon3D.push({ kombo: c1, skor: score2D + (petaSkor[centerLebahNaga] || 0) * 1.5 });

            let c2 = this.sortCombo(combo2D + centerBayangan);
            senaraiCalon3D.push({ kombo: c2, skor: score2D + 1.8 });

            if (kunciLock.length > 0) {
                let lockDigit = kunciLock[0].toString();
                let c3 = this.sortCombo(combo2D + lockDigit);
                senaraiCalon3D.push({ kombo: c3, skor: score2D + 2.2 });
            }
        });

        let kedudukanPeta = new Map();
        senaraiCalon3D.forEach(item => {
            if (!kedudukanPeta.has(item.kombo) || kedudukanPeta.get(item.kombo) < item.skor) {
                kedudukanPeta.set(item.kombo, item.skor);
            }
        });

        return Array.from(kedudukanPeta.entries())
            .map(([kombo, skor]) => ({ kombo, skor }))
            .sort((a, b) => b.skor - a.skor);
    }

    jana(nombor4D, tarikhInput, sejarahResult, statusCermin) {
        let m4x4 = this.binaMatrix4x4Tolak1(nombor4D);
        let m3x3 = this.binaMatrix3x3LebahNaga(tarikhInput);
        let m3x3Bayangan = this.binaMatrixBayangan3x3(m3x3);

        let dataKunci = this.kesanNomborKunciLock(m4x4, m3x3, m3x3Bayangan);
        let missingDigits = dataKunci.digitHilang;
        let kunciLock = dataKunci.kunciLock;

        let senaraiObjekSkor = this.kiraTrajektori(sejarahResult);

        let objek2D = this.janaSenarai2D(m4x4, senaraiObjekSkor, statusCermin);
        let list2DText = objek2D.map(item => item.kombo);

        let objek3D = this.janaSenarai3D(m3x3, m3x3Bayangan, objek2D, senaraiObjekSkor, kunciLock, sejarahResult);
        let list3DText = objek3D.map(item => item.kombo).slice(0, 6);

        let top3DCore = list3DText[0] || '135';
        let lockDigitDominan = kunciLock.length > 0 ? kunciLock[0].toString() : '7';
        
        let target4D = this.sortCombo(top3DCore + lockDigitDominan);
        let list4D = [target4D];

        kunciLock.forEach(k => {
            list4D.push(this.sortCombo(top3DCore + k.toString()));
        });

        if (list3DText[1]) {
            let shiftDigit = ((parseInt(list3DText[1][0]) + 5) % 10).toString();
            list4D.push(this.sortCombo(list3DText[1] + shiftDigit));
        }

        return {
            matrix4x4: m4x4,
            matrix3x3: m3x3,
            matrixBayangan: m3x3Bayangan,
            missing: missingDigits,
            kunciLock: kunciLock,
            hasil2D: list2DText,
            hasil3D: list3DText,
            hasil4D: [...new Set(list4D)].slice(0, 8),
            pod: {
                top2D: list2DText.slice(0, 3).join(', '),
                top3D: list3DText.slice(0, 2).join(', '),
                top4D: target4D,
                lockDominan: lockDigitDominan
            }
        };
    }
}

const enjin = new EnjinDwiCartaToto();
let globalResult = null;

function lukisJadual4x4(matrix) {
    const table = document.getElementById('matrixTable4x4');
    if (!table) return;
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

function lukisGrid3x3(matrix, idElement, isShadow = false, lockDigits = []) {
    const grid = document.getElementById(idElement);
    if (!grid) return;
    grid.innerHTML = '';
    matrix.forEach(row => {
        row.forEach(val => {
            let div = document.createElement('div');
            let classNames = 'cell-3x3';
            if (isShadow) classNames += ' cell-shadow';
            if (lockDigits.includes(val)) classNames += ' cell-lock';
            
            div.className = classNames;
            div.innerText = val;
            grid.appendChild(div);
        });
    });
}

function tunjukSenarai(idElement, dataArray) {
    const container = document.getElementById(idElement);
    if (!container) return;
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
            historyArray = ["1508", "5241", "6336", "2203", "4065"];
        }

        globalResult = enjin.jana(inputNum1, inputDate, historyArray, statusCermin);

        lukisJadual4x4(globalResult.matrix4x4);
        lukisGrid3x3(globalResult.matrix3x3, 'matrixGrid3x3', false, []);
        lukisGrid3x3(globalResult.matrixBayangan, 'matrixGrid3x3Bayangan', true, globalResult.kunciLock);

        const elMissing = document.getElementById('missing-digits');
        if (elMissing) elMissing.innerText = globalResult.missing.length > 0 ? globalResult.missing.join(', ') : 'Tiada';
        
        const elLock = document.getElementById('lock-digit');
        if (elLock) elLock.innerText = globalResult.pod.lockDominan;

        const elPod2d = document.getElementById('pod-2d');
        if (elPod2d) elPod2d.innerText = globalResult.pod.top2D;

        const elPod3d = document.getElementById('pod-3d');
        if (elPod3d) elPod3d.innerText = globalResult.pod.top3D;

        const elPod4d = document.getElementById('pod-4d');
        if (elPod4d) elPod4d.innerText = globalResult.pod.top4D;

        tunjukSenarai('out-2d', globalResult.hasil2D);
        tunjukSenarai('out-3d', globalResult.hasil3D);
        tunjukSenarai('out-4d', globalResult.hasil4D);

        const elHasil = document.getElementById('hasil');
        if (elHasil) elHasil.style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Ralat semasa menjana carta: " + err.message);
    }
}

function resetBorang() {
    const elNum1 = document.getElementById('num1');
    if (elNum1) elNum1.value = '';

    const elDate = document.getElementById('drawDate');
    if (elDate) elDate.valueAsDate = new Date();

    const elHist = document.getElementById('history');
    if (elHist) elHist.value = '';

    const elHasil = document.getElementById('hasil');
    if (elHasil) elHasil.style.display = 'none';

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

// PENETAPAN TARIKH LANGSUNG DENGAN TRY-CATCH (TANPA EVENTLISTENER)
try {
    const elDate = document.getElementById('drawDate');
    if (elDate) {
        elDate.valueAsDate = new Date();
    }
} catch (e) {
    console.log("Tetapan tarikh dilewati secara selamat.");
}
