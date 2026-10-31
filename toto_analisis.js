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

    binaMatrixBayangan3x3(m3x3) {
        return m3x3.map(baris => baris.map(val => (val + 5) % 10));
    }

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

    // ALGORITMA RANTAIAN 8-JIRAN (SEMAKAN SEMUA POLA POLIFORM)
    janaLaluanRantaianGrid(grid) {
        let rows = grid.length;
        let cols = grid[0].length;
        let setLaluan = [];

        let dRow = [-1, -1, -1, 0, 0, 1, 1, 1];
        let dCol = [-1, 0, 1, -1, 1, -1, 0, 1];

        for (let r1 = 0; r1 < rows; r1++) {
            for (let c1 = 0; c1 < cols; c1++) {
                let v1 = grid[r1][c1].toString();

                for (let i = 0; i < 8; i++) {
                    let r2 = r1 + dRow[i];
                    let c2 = c1 + dCol[i];

                    if (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols) {
                        let v2 = grid[r2][c2].toString();

                        for (let j = 0; j < 8; j++) {
                            let r3 = r2 + dRow[j];
                            let c3 = c2 + dCol[j];

                            if (r3 >= 0 && r3 < rows && c3 >= 0 && c3 < cols && !(r3 === r1 && c3 === c1)) {
                                let v3 = grid[r3][c3].toString();
                                let combo = this.sortCombo(v1 + v2 + v3);
                                if (combo.length === 3) {
                                    setLaluan.push(combo);
                                }
                            }
                        }
                    }
                }
            }
        }
        return [...new Set(setLaluan)];
    }

    // MODUL BAHARU: CORNER-LOCK SCAN (IMBASAN 4 SUDUT PENJURU MATRIKS 4X4)
    ekstraksiCornerLock4x4(m4x4) {
        let c1 = m4x4[0][0].toString(); // Atas-Kiri
        let c2 = m4x4[0][3].toString(); // Atas-Kanan
        let c3 = m4x4[3][0].toString(); // Bawah-Kiri
        let c4 = m4x4[3][3].toString(); // Bawah-Kanan

        let raw4D = this.sortCombo(c1 + c2 + c3 + c4);
        let sub3D = [
            this.sortCombo(c1 + c2 + c3),
            this.sortCombo(c1 + c2 + c4),
            this.sortCombo(c1 + c3 + c4),
            this.sortCombo(c2 + c3 + c4)
        ];
        return { raw4D, sub3D };
    }

    janaSenarai2DUnjuranVektor(m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin) {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let petaKoordinat4x4 = {};
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let val = m4x4[r][c].toString();
                if (!petaKoordinat4x4[val]) petaKoordinat4x4[val] = [];
                petaKoordinat4x4[val].push({ r, c });
            }
        }

        let kiraanCarta = {};
        for (let d = 0; d <= 9; d++) kiraanCarta[d.toString()] = 0;

        m4x4.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 1));
        m3x3.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 2));
        m3x3Bayangan.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 2.5));

        let senaraiCalon2D = [];

        for (let d1 = 0; d1 <= 9; d1++) {
            for (let d2 = d1 + 1; d2 <= 9; d2++) {
                let s1 = d1.toString();
                let s2 = d2.toString();
                let kombo = this.sortCombo(s1 + s2);

                let minJarakEuclidean = 99;
                let listPos1 = petaKoordinat4x4[s1] || [];
                let listPos2 = petaKoordinat4x4[s2] || [];

                listPos1.forEach(p1 => {
                    listPos2.forEach(p2 => {
                        let dr = p2.r - p1.r;
                        let dc = p2.c - p1.c;
                        let dist = Math.sqrt((dr * dr) + (dc * dc));
                        if (dist < minJarakEuclidean) minJarakEuclidean = dist;
                    });
                });

                let skorVektorSpatial = 0;
                if (minJarakEuclidean <= 1.05) {
                    skorVektorSpatial = 3.5;
                } else if (minJarakEuclidean <= 1.5) {
                    skorVektorSpatial = 2.5;
                } else if (minJarakEuclidean <= 2.25) {
                    skorVektorSpatial = 1.0;
                } else {
                    skorVektorSpatial = 0.2;
                }

                let skorResonansAkhir = (skorVektorSpatial * 2.0) + 
                                       (kiraanCarta[s1] * kiraanCarta[s2] * 0.3) + 
                                       (petaSkor[s1] || 0) + (petaSkor[s2] || 0);

                senaraiCalon2D.push({ kombo: kombo, skor: skorResonansAkhir, jarak: minJarakEuclidean });
            }
        }

        if (statusCermin) {
            for (let d = 0; d <= 9; d++) {
                let s = d.toString();
                let m = this.MIRROR_MAP[s];
                if (m && parseInt(s) < parseInt(m)) {
                    let kombo = this.sortCombo(s + m);
                    let skorBonus = (kiraanCarta[s] + kiraanCarta[m]) * 1.5;
                    senaraiCalon2D.push({ kombo: kombo, skor: skorBonus, jarak: 1.0 });
                }
            }
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

    // FORMULA 3D SOLID TRIANGULASI TERBAIK (RANTAIAN 8-JIRAN + CORNER-LOCK)
    janaSenarai3DTriangulasi(m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor) {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let set3D = new Map();

        // 1. Imbas Laluan Rantaian (L, Y, T, X, Zigzag) dari Matriks 4x4
        let rantaian4x4 = this.janaLaluanRantaianGrid(m4x4);
        rantaian4x4.forEach(c3d => {
            set3D.set(c3d, 3.0);
        });

        // 2. Imbas Laluan Rantaian dari Matriks Bayangan 3x3 (+5)
        let rantaianBayangan = this.janaLaluanRantaianGrid(m3x3Bayangan);
        rantaianBayangan.forEach(c3d => {
            let markahSediaAda = set3D.get(c3d) || 0;
            set3D.set(c3d, markahSediaAda + 4.5);
        });

        // 3. SUNTIKAN CORNER-LOCK SCAN (4 SUDUT PENJURU CARTA 4X4)
        let cornerData = this.ekstraksiCornerLock4x4(m4x4);
        cornerData.sub3D.forEach(c3d => {
            let markahSediaAda = set3D.get(c3d) || 1.0;
            set3D.set(c3d, markahSediaAda + 4.0); // Bonus markah tinggi Corner-Lock
        });

        // 4. Suntikan Pengunci Lock Dominan
        let lockStr = kunciLock.length > 0 ? kunciLock[0].toString() : '';
        if (lockStr) {
            let top2D = objek2D.slice(0, 6);
            top2D.forEach(item2D => {
                let kombo = this.sortCombo(item2D.kombo + lockStr);
                if (kombo.length === 3) {
                    let currentScore = set3D.get(kombo) || 1.0;
                    set3D.set(kombo, currentScore + 3.0);
                }
            });
        }

        // 5. Pengiraan Pemberatan Skor Trajektori
        let hasilSusunan = [];
        set3D.forEach((skorAsas, kombo) => {
            let d1 = kombo[0], d2 = kombo[1], d3 = kombo[2];
            let skorTrajektori = (petaSkor[d1] || 0) + (petaSkor[d2] || 0) + (petaSkor[d3] || 0);
            let skorAkhir = skorAsas + (skorTrajektori * 0.5);

            hasilSusunan.push({ kombo: kombo, skor: skorAkhir });
        });

        return hasilSusunan.sort((a, b) => b.skor - a.skor);
    }

    jana(nombor4D, tarikhInput, sejarahResult, statusCermin) {
        let m4x4 = this.binaMatrix4x4Tolak1(nombor4D);
        let m3x3 = this.binaMatrix3x3LebahNaga(tarikhInput);
        let m3x3Bayangan = this.binaMatrixBayangan3x3(m3x3);

        let dataKunci = this.kesanNomborKunciLock(m4x4, m3x3, m3x3Bayangan);
        let missingDigits = dataKunci.digitHilang;
        let kunciLock = dataKunci.kunciLock;

        let senaraiObjekSkor = this.kiraTrajektori(sejarahResult);

        let objek2D = this.janaSenarai2DUnjuranVektor(m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin);
        let list2DText = objek2D.map(item => item.kombo);

        // Penjanaan 3D Solid Universal
        let objek3D = this.janaSenarai3DTriangulasi(m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor);
        let list3DText = objek3D.map(item => item.kombo).slice(0, 6);

        let lockDigitDominan = kunciLock.length > 0 ? kunciLock[0].toString() : (missingDigits[0] || '7').toString();
        let top3DCore = list3DText[0] || '789';

        let list4D = [];

        // Masukkan Terus Raw 4D hasil Corner-Lock Scan 4x4
        let cornerData = this.ekstraksiCornerLock4x4(m4x4);
        if (cornerData.raw4D.length === 4) {
            list4D.push(cornerData.raw4D);
        }

        list3DText.slice(0, 5).forEach(t3d => {
            list4D.push(this.sortCombo(t3d + lockDigitDominan));
            if (missingDigits.length > 0) {
                list4D.push(this.sortCombo(t3d + missingDigits[0].toString()));
            }
        });

        let target4D = list4D[0] || this.sortCombo(top3DCore + lockDigitDominan);

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
                top3D: list3DText.slice(0, 3).join(', '),
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
            historyArray = ["1508", "5241", "6336"];
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

try {
    const elDate = document.getElementById('drawDate');
    if (elDate) {
        elDate.valueAsDate = new Date();
    }
} catch (e) {
    console.log("Tetapan tarikh dilewati secara selamat.");
}
