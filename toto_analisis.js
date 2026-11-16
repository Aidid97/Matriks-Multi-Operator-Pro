class EnjinDwiCartaToto {
    constructor() {
        this.MIRROR_MAP = {
            '0':'5', '1':'6', '2':'7', '3':'8', '4':'9',
            '5':'0', '6':'1', '7':'2', '8':'3', '9':'4'
        };
        this.GD_MAIN_MATRIX = [
            [5, 8, 2],
            [1, 0, 6],
            [3, 8, 1]
        ];
        this.GD_SHADOW_MATRIX = [
            [0, 3, 7],
            [6, 5, 1],
            [8, 3, 6]
        ];
        this.GD_KEY_NUMBERS = [4, 7, 9];
    }

    sortCombo(teksNombor) {
        if (!teksNombor) return '';
        return teksNombor.toString().split('').sort().join('');
    }

    parseTarikh(tarikhInput) {
        if (tarikhInput instanceof Date && !isNaN(tarikhInput.getTime())) {
            return new Date(tarikhInput.getFullYear(), tarikhInput.getMonth(), tarikhInput.getDate(), 12, 0, 0);
        }

        if (tarikhInput) {
            let cleanStr = tarikhInput.toString().trim();
            let parts = null;

            if (cleanStr.includes('-')) {
                parts = cleanStr.split('-');
            } else if (cleanStr.includes('/')) {
                parts = cleanStr.split('/');
            }

            if (parts && parts.length === 3) {
                let y, m, d;
                if (parts[0].length === 4) {
                    y = parseInt(parts[0], 10);
                    m = parseInt(parts[1], 10) - 1;
                    d = parseInt(parts[2], 10);
                } else {
                    d = parseInt(parts[0], 10);
                    m = parseInt(parts[1], 10) - 1;
                    y = parseInt(parts[2], 10);
                }
                let tarikhTepat = new Date(y, m, d, 12, 0, 0);
                if (!isNaN(tarikhTepat.getTime())) {
                    return tarikhTepat;
                }
            }
        }

        let sekarang = new Date();
        return new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate(), 12, 0, 0);
    }

    dapatkanKalendarJawa(tarikhStr) {
        const d = this.parseTarikh(tarikhStr);
        const neptuHariList = [5, 4, 3, 7, 8, 6, 9];
        const namaHariList = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
        
        const dayIdx = d.getDay();
        const neptuHari = neptuHariList[dayIdx];

        const utcHari = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        const daysSinceEpoch = Math.floor(utcHari / 86400000);
        
        const pasaranList = [
            { nama: "Legi", neptu: 5 },
            { nama: "Pahing", neptu: 9 },
            { nama: "Pon", neptu: 7 },
            { nama: "Wage", neptu: 4 },
            { nama: "Kliwon", neptu: 8 }
        ];

        const pasaranIdx = ((daysSinceEpoch + 3) % 5 + 5) % 5;
        const pasaranObj = pasaranList[pasaranIdx];
        const totalNeptu = neptuHari + pasaranObj.neptu;

        const digitJawa1 = totalNeptu % 10;
        const digitJawa2 = (digitJawa1 + 5) % 10;
        const paksiTengah = (7 + totalNeptu) % 10;
        const bayanganTengah = (paksiTengah + 5) % 10;

        return {
            hari: namaHariList[dayIdx],
            pasaran: pasaranObj.nama,
            neptuHari: neptuHari,
            neptuPasaran: pasaranObj.neptu,
            totalNeptu: totalNeptu,
            digitJawa1: digitJawa1,
            digitJawa2: digitJawa2,
            paksiTengah: paksiTengah,
            bayanganTengah: bayanganTengah
        };
    }

    dapatkanElemenBazi(tarikhStr) {
        const d = this.parseTarikh(tarikhStr);
        const utcHari = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        const daysSinceEpoch = Math.floor(utcHari / 86400000);

        const senaraiBatang = [
            { batang: "Jia", elemen: "Kayu", digit: [3, 8] },
            { batang: "Yi", elemen: "Kayu", digit: [3, 8] },
            { batang: "Bing", elemen: "Api", digit: [2, 7] },
            { batang: "Ding", elemen: "Api", digit: [2, 7] },
            { batang: "Wu", elemen: "Tanah", digit: [5, 0] },
            { batang: "Ji", elemen: "Tanah", digit: [5, 0] },
            { batang: "Geng", elemen: "Logam", digit: [4, 9] },
            { batang: "Xin", elemen: "Logam", digit: [4, 9] },
            { batang: "Ren", elemen: "Air", digit: [1, 6] },
            { batang: "Gui", elemen: "Air", digit: [1, 6] }
        ];

        const idx = ((daysSinceEpoch + 6) % 10 + 10) % 10;
        return senaraiBatang[idx];
    }

    binaMatrix4x4Dinamik(nomborBase, dataJawa, dataBazi, senaraiObjekSkor) {
        let nomborKemas = (nomborBase || '0000').toString().replace(/[^0-9]/g, '');
        if (nomborKemas.length < 4) nomborKemas = nomborKemas.padEnd(4, '0');

        let baris1 = nomborKemas.substring(0, 4).split('').map(Number);

        let baris2 = [
            dataJawa.digitJawa1,
            dataJawa.paksiTengah,
            dataBazi.digit[0],
            dataBazi.digit[1]
        ];

        let baris3 = senaraiObjekSkor.slice(0, 4).map(item => parseInt(item.digitSasaran, 10));
        let baris4 = senaraiObjekSkor.slice(-4).reverse().map(item => parseInt(item.digitSasaran, 10));

        return [baris1, baris2, baris3, baris4];
    }

    binaMatrix3x3LebahNaga(tarikhInput) {
        const dataJawa = this.dapatkanKalendarJawa(tarikhInput);
        const totalNeptu = dataJawa.totalNeptu;

        const baseGrid = [
            [5, 8, 3],
            [2, 7, 9],
            [4, 1, 6]
        ];

        return baseGrid.map(row => 
            row.map(val => (val + totalNeptu) % 10)
        );
    }

    binaMatrix3x3GDLotto(tarikhInput) {
        const dataJawa = this.dapatkanKalendarJawa(tarikhInput);
        const anjakan = dataJawa.digitJawa1;

        return this.GD_MAIN_MATRIX.map(row =>
            row.map(val => (val + anjakan) % 10)
        );
    }

    binaMatrixBayangan3x3(m3x3) {
        return m3x3.map(baris => baris.map(val => (val + 5) % 10));
    }

    kiraVektorKoordinatGD(nomborBase) {
        let s = (nomborBase || '0000').toString().replace(/[^0-9]/g, '');
        if (s.length < 4) s = s.padEnd(4, '0');

        let x1 = parseInt(s[0], 10);
        let y1 = parseInt(s[1], 10);
        let x2 = parseInt(s[2], 10);
        let y2 = parseInt(s[3], 10);

        let dx = Math.abs(x1 - x2);
        let dy = Math.abs(y1 - y2);
        let distSq = (dx * dx) + (dy * dy);

        let d2Str = distSq.toString().padStart(2, '0');
        if (d2Str.length > 2) d2Str = d2Str.slice(-2);

        let v1 = parseInt(d2Str[0], 10);
        let v2 = parseInt(d2Str[1], 10);
        let s1 = (v1 + 5) % 10;
        let s2 = (v2 + 5) % 10;

        let bezaPaksi = Math.abs(dx - dy) % 10;
        let jumlahPaksi = (dx + dy) % 10;

        let pasanganAsal = `${v1}${v2}`;
        let pasanganBayang = `${s1}${s2}`;
        let silang1 = `${v2}${bezaPaksi}`;
        let silang2 = `${s2}${bezaPaksi}`;

        return {
            dx: dx,
            dy: dy,
            distSq: distSq,
            v1: v1,
            v2: v2,
            s1: s1,
            s2: s2,
            bezaPaksi: bezaPaksi,
            jumlahPaksi: jumlahPaksi,
            pasanganAsal: pasanganAsal,
            pasanganBayang: pasanganBayang,
            silang1: silang1,
            silang2: silang2
        };
    }

    kesanNomborKunciLock(m4x4, m3x3, m3x3Bayangan, operatorMode = "TOTO", dataJawa = null, dataBazi = null, senaraiObjekSkor = []) {
        let set4x4 = new Set();
        m4x4.forEach(row => row.forEach(val => set4x4.add(val)));

        let set3x3 = new Set();
        m3x3.forEach(row => row.forEach(val => set3x3.add(val)));

        let setBayangan = new Set();
        m3x3Bayangan.forEach(row => row.forEach(val => setBayangan.add(val)));

        let hilang4x4 = [];
        let hilang3x3 = [];

        for (let d = 0; d <= 9; d++) {
            if (!set4x4.has(d)) hilang4x4.push(d);
            if (!set3x3.has(d)) hilang3x3.push(d);
        }

        let gabunganHilang = [...new Set([...hilang4x4, ...hilang3x3])];
        if (gabunganHilang.length === 0) {
            gabunganHilang = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !setBayangan.has(d));
        }

        let skorKunci = gabunganHilang.map(digit => {
            let skor = 0;
            if (hilang4x4.includes(digit)) skor += 3.5;
            if (hilang3x3.includes(digit)) skor += 2.0;
            if (setBayangan.has(digit)) skor += 2.5;

            if (dataJawa) {
                if (digit === dataJawa.digitJawa1 || digit === dataJawa.digitJawa2) skor += 4.0;
                if (digit === dataJawa.paksiTengah || digit === dataJawa.bayanganTengah) skor += 3.5;
            }
            if (dataBazi && dataBazi.digit.includes(digit)) {
                skor += 4.0;
            }

            if (operatorMode === "GDLOTTO" && this.GD_KEY_NUMBERS.includes(digit)) {
                skor += 1.5;
            }

            let objTraj = senaraiObjekSkor.find(item => item.digitSasaran === digit.toString());
            if (objTraj) {
                skor += (objTraj.markahAkhir * 0.5);
            }

            return { digit, skor };
        });

        skorKunci.sort((a, b) => b.skor - a.skor);

        let digitHilangUtama = skorKunci.map(item => item.digit).slice(0, 4);
        let lockDominan = skorKunci.map(item => item.digit).slice(0, 2);

        if (lockDominan.length === 0) {
            lockDominan = [m3x3Bayangan[1][1]];
        }

        return {
            digitHilang: digitHilangUtama,
            kunciLock: lockDominan
        };
    }

    kiraTrajektori(sejarahCabutan, operatorMode = "TOTO") {
        let senaraiSkor = [];
        let panjang = sejarahCabutan.length;
        let p3 = Math.min(3, panjang);
        let p5 = Math.min(8, panjang);

        let str3 = sejarahCabutan.slice(0, p3).join('');
        let str5 = sejarahCabutan.slice(0, p5).join('');
        let strSemua = sejarahCabutan.join('');

        let beratTerkini = operatorMode === "GDLOTTO" ? 0.95 : 0.80;
        let beratSederhana = operatorMode === "GDLOTTO" ? 0.35 : 0.45;
        let beratKeseluruhan = 0.15;

        for (let d = 0; d <= 9; d++) {
            let digitStr = d.toString();
            let freq3 = p3 > 0 ? (str3.split(digitStr).length - 1) : 0;
            let freq5 = p5 > 0 ? (str5.split(digitStr).length - 1) : 0;
            let freqSemua = panjang > 0 ? (strSemua.split(digitStr).length - 1) : 0;

            let markah = (freq3 * beratTerkini) + (freq5 * beratSederhana) + (freqSemua * beratKeseluruhan);
            senaraiSkor.push({ digitSasaran: digitStr, markahAkhir: markah, kekerapan: freqSemua });
        }

        senaraiSkor.sort((a, b) => b.markahAkhir - a.markahAkhir);
        return senaraiSkor;
    }

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

    ekstraksiCornerLock4x4(m4x4) {
        let c1 = m4x4[0][0].toString(); 
        let c2 = m4x4[0][3].toString(); 
        let c3 = m4x4[3][0].toString(); 
        let c4 = m4x4[3][3].toString(); 

        let j1 = m4x4[0][1].toString();
        let j2 = m4x4[0][3].toString();
        let j3 = m4x4[1][2].toString();
        let j4 = m4x4[2][1].toString();

        let raw4D = this.sortCombo(c1 + c2 + c3 + c4);
        let bridge4D = this.sortCombo(j1 + j2 + j3 + j4);

        let sub3D = [
            this.sortCombo(c1 + c2 + c3),
            this.sortCombo(c1 + c2 + c4),
            this.sortCombo(j1 + j2 + j3),
            this.sortCombo(m4x4[0][1].toString() + m4x4[0][2].toString() + m4x4[0][3].toString())
        ];
        return { raw4D, bridge4D, sub3D };
    }

    janaSenarai2DUnjuranVektor(m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin, vektorGD = null, dataJawa = null, dataBazi = null, operatorMode = "TOTO") {
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

        m4x4.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 1.5));
        m3x3.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 2.0));
        m3x3Bayangan.forEach(r => r.forEach(v => kiraanCarta[v.toString()] += 2.5));

        if (dataBazi && dataJawa) {
            dataBazi.digit.forEach(d => { kiraanCarta[d.toString()] += 1.5; });
            kiraanCarta[dataJawa.paksiTengah.toString()] += 1.5;
            kiraanCarta[dataJawa.bayanganTengah.toString()] += 1.5;
        }

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

        if (operatorMode === "GDLOTTO" && vektorGD) {
            let bonusVektor2D = [
                this.sortCombo(vektorGD.pasanganAsal),
                this.sortCombo(vektorGD.pasanganBayang),
                this.sortCombo(vektorGD.silang1),
                this.sortCombo(vektorGD.silang2)
            ];
            bonusVektor2D.forEach((k2d, idx) => {
                if (k2d.length === 2 && k2d[0] !== k2d[1]) {
                    senaraiCalon2D.push({ kombo: k2d, skor: 18.0 - (idx * 1.5), jarak: 1.0 });
                }
            });
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
            .sort((a, b) => b.skor - a.skor)
            .slice(0, 12);
    }

    janaSenarai3DTriangulasi(m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor, missingDigits, tarikhObj, vektorGD = null, dataJawa = null, dataBazi = null, operatorMode = "TOTO") {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let set3D = new Map();
        let hari = tarikhObj.getDay();
        let isRabu = (hari === 3); 
        let isHujungMinggu = (hari === 0 || hari === 6);

        if (operatorMode === "GDLOTTO") {
            let top2DList = objek2D.slice(0, 6);
            top2DList.forEach((item2D, idx) => {
                let a = item2D.kombo[0];
                let b = item2D.kombo[1];
                let c = this.MIRROR_MAP[a];
                let d = this.MIRROR_MAP[b];

                let berat2D = 16.0 - (idx * 1.5);

                let silang1 = this.sortCombo(a + b + c);
                let silang2 = this.sortCombo(a + b + d);
                let silang3 = this.sortCombo(c + d + a);
                let silang4 = this.sortCombo(c + d + b);

                [silang1, silang2, silang3, silang4].forEach((k3d, sIdx) => {
                    if (k3d.length === 3) {
                        set3D.set(k3d, (set3D.get(k3d) || 0) + berat2D - (sIdx * 0.4));
                    }
                });

                if (idx < 3) {
                    let doubleA = this.sortCombo(a + a + b);
                    let doubleB = this.sortCombo(a + b + b);
                    set3D.set(doubleA, (set3D.get(doubleA) || 0) + (berat2D * 0.85));
                    set3D.set(doubleB, (set3D.get(doubleB) || 0) + (berat2D * 0.85));
                }

                if (dataJawa && dataBazi && idx < 4) {
                    let pengikatHari = [
                        dataJawa.bayanganTengah.toString(),
                        dataJawa.paksiTengah.toString(),
                        dataBazi.digit[0].toString(),
                        dataBazi.digit[1].toString()
                    ];
                    pengikatHari.forEach((pDigit, pIdx) => {
                        let kAsal = this.sortCombo(a + b + pDigit);
                        let kBayang = this.sortCombo(c + d + pDigit);
                        if (kAsal.length === 3) {
                            set3D.set(kAsal, (set3D.get(kAsal) || 0) + (11.0 - idx - pIdx * 0.5));
                        }
                        if (kBayang.length === 3) {
                            set3D.set(kBayang, (set3D.get(kBayang) || 0) + (10.5 - idx - pIdx * 0.5));
                        }
                    });
                }
            });

            if (vektorGD) {
                let vAsal = vektorGD.pasanganAsal;
                let vBayang = vektorGD.pasanganBayang;
                let vSilang1 = this.sortCombo(vAsal + vBayang[0]);
                let vSilang2 = this.sortCombo(vAsal + vBayang[1]);
                let vSilang3 = this.sortCombo(vBayang + vAsal[0]);
                let vSilang4 = this.sortCombo(vBayang + vAsal[1]);

                [vSilang1, vSilang2, vSilang3, vSilang4].forEach(vk => {
                    if (vk.length === 3) {
                        set3D.set(vk, (set3D.get(vk) || 0) + 14.0);
                    }
                });
            }

            if (missingDigits.length > 0) {
                let missingStrList = missingDigits.map(d => d.toString());
                set3D.forEach((skor, kombo) => {
                    let jumlahMissing = 0;
                    missingStrList.forEach(mDigit => {
                        if (kombo.includes(mDigit)) jumlahMissing++;
                    });
                    if (jumlahMissing > 0) {
                        set3D.set(kombo, skor + (jumlahMissing * 4.5));
                    }
                });
            }
        } else {
            let rantaian4x4 = this.janaLaluanRantaianGrid(m4x4);
            rantaian4x4.forEach(c3d => set3D.set(c3d, 3.5));

            let rantaianBayangan = this.janaLaluanRantaianGrid(m3x3Bayangan);
            rantaianBayangan.forEach(c3d => {
                let markah = set3D.get(c3d) || 0;
                set3D.set(c3d, markah + 4.5);
            });

            for (let i = 0; i < 3; i++) {
                let barisBayang = this.sortCombo(m3x3Bayangan[i].join(''));
                let lajurBayang = this.sortCombo(`${m3x3Bayangan[0][i]}${m3x3Bayangan[1][i]}${m3x3Bayangan[2][i]}`);
                set3D.set(barisBayang, (set3D.get(barisBayang) || 2.0) + 6.5);
                set3D.set(lajurBayang, (set3D.get(lajurBayang) || 2.0) + 5.0);
            }

            let cornerData = this.ekstraksiCornerLock4x4(m4x4);
            cornerData.sub3D.forEach(c3d => {
                let markah = set3D.get(c3d) || 1.0;
                set3D.set(c3d, markah + 4.5);
            });

            let lockStr = kunciLock.length > 0 ? kunciLock[0].toString() : '';
            if (lockStr) {
                let top2D = objek2D.slice(0, 8);
                top2D.forEach(item2D => {
                    let kombo = this.sortCombo(item2D.kombo + lockStr);
                    if (kombo.length === 3) {
                        let markah = set3D.get(kombo) || 1.0;
                        set3D.set(kombo, markah + 4.0);
                    }
                });
            }

            if (missingDigits.length > 0) {
                let missingStrList = missingDigits.map(d => d.toString());
                let bonusMissing = isRabu ? 4.5 : 3.0;
                set3D.forEach((skor, kombo) => {
                    let jumlahMissing = 0;
                    missingStrList.forEach(mDigit => {
                        if (kombo.includes(mDigit)) jumlahMissing++;
                    });
                    if (jumlahMissing > 0) {
                        set3D.set(kombo, skor + (jumlahMissing * bonusMissing));
                    }
                });
            }

            if (isHujungMinggu) {
                let terasMatriks = new Set();
                m3x3.forEach(row => row.forEach(val => terasMatriks.add(val.toString())));
                m3x3Bayangan.forEach(row => row.forEach(val => terasMatriks.add(val.toString())));
                
                let terasStrList = Array.from(terasMatriks);

                set3D.forEach((skor, kombo) => {
                    let jumlahTeras = 0;
                    terasStrList.forEach(tDigit => {
                        if (kombo.includes(tDigit)) jumlahTeras++;
                    });
                    if (jumlahTeras === 3) {
                        set3D.set(kombo, skor + 5.0);
                    } else if (jumlahTeras === 2) {
                        set3D.set(kombo, skor + 2.5);
                    }
                });
            }
        }

        let hasilSusunan = [];
        set3D.forEach((skorAsas, kombo) => {
            let d1 = kombo[0], d2 = kombo[1], d3 = kombo[2];
            let skorTrajektori = (petaSkor[d1] || 0) + (petaSkor[d2] || 0) + (petaSkor[d3] || 0);
            let skorAkhir = skorAsas + (skorTrajektori * 0.5);
            hasilSusunan.push({ kombo: kombo, skor: skorAkhir });
        });

        return hasilSusunan.sort((a, b) => b.skor - a.skor);
    }

    // Jana pasangan pembayang (+5) untuk 4D sasaran utama
    janaPembayang4D(kombo4D, lockStr) {
        let digits = kombo4D.split('');
        let ditukar = false;
        // Tukar digit bukan kunci (lockStr) kepada bayangannya (+5)
        let bayang1Arr = digits.map(d => {
            if (!ditukar && d !== lockStr && this.MIRROR_MAP[d]) {
                ditukar = true;
                return this.MIRROR_MAP[d];
            }
            return d;
        });
        let bayang1 = this.sortCombo(bayang1Arr.join(''));

        // Variasi kedua: tukar kunci utama (lockStr) kepada bayangannya (+5)
        let bayang2Arr = digits.map(d => (d === lockStr && this.MIRROR_MAP[d]) ? this.MIRROR_MAP[d] : d);
        let bayang2 = this.sortCombo(bayang2Arr.join(''));

        let hasilUnik = [bayang1, bayang2].filter(b => b && b !== kombo4D);
        return [...new Set(hasilUnik)];
    }

    jana(nombor4D, tarikhInput, sejarahResult, statusCermin, operatorMode = "GDLOTTO") {
        let tarikhObj = this.parseTarikh(tarikhInput);
        let dataJawa = this.dapatkanKalendarJawa(tarikhObj);
        let dataBazi = this.dapatkanElemenBazi(tarikhObj);
        let vektorGD = this.kiraVektorKoordinatGD(nombor4D);

        let senaraiObjekSkor = this.kiraTrajektori(sejarahResult, operatorMode);
        let m4x4 = this.binaMatrix4x4Dinamik(nombor4D, dataJawa, dataBazi, senaraiObjekSkor);

        let m3x3 = operatorMode === "GDLOTTO" 
            ? this.binaMatrix3x3GDLotto(tarikhObj) 
            : this.binaMatrix3x3LebahNaga(tarikhObj);
        let m3x3Bayangan = this.binaMatrixBayangan3x3(m3x3);

        let dataKunci = this.kesanNomborKunciLock(
            m4x4, m3x3, m3x3Bayangan, operatorMode, dataJawa, dataBazi, senaraiObjekSkor
        );
        let missingDigits = dataKunci.digitHilang;
        let kunciLock = dataKunci.kunciLock;

        let objek2D = this.janaSenarai2DUnjuranVektor(
            m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin, vektorGD, dataJawa, dataBazi, operatorMode
        );
        let list2DText = objek2D.map(item => item.kombo);

        let objek3D = this.janaSenarai3DTriangulasi(
            m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor, missingDigits, tarikhObj, vektorGD, dataJawa, dataBazi, operatorMode
        );
        let list3DText = objek3D.map(item => item.kombo).slice(0, 6);

        let lockDigitDominan = kunciLock.length > 0 
            ? kunciLock[0].toString() 
            : (missingDigits[0] !== undefined ? missingDigits[0].toString() : m3x3Bayangan[1][1].toString());
        let top3DCore = list3DText[0] || this.sortCombo(m3x3Bayangan[0].join(''));

        let list4D = [];

        if (operatorMode === "GDLOTTO") {
            let senaraiPengikat4D = [...missingDigits.map(String)];
            this.GD_KEY_NUMBERS.forEach(k => {
                if (!senaraiPengikat4D.includes(k.toString())) {
                    senaraiPengikat4D.push(k.toString());
                }
            });

            // 1. Gabungan 3D teratas dengan Nombor Kunci & Digit Hilang + Pembayang (+5)
            list3DText.slice(0, 3).forEach(t3d => {
                senaraiPengikat4D.slice(0, 3).forEach(kDigit => {
                    let komboAsal = this.sortCombo(t3d + kDigit);
                    list4D.push(komboAsal);
                    // Selitkan terus versi pembayang (+5) supaya terperangkap macam 0255 -> 2557 / 2555
                    let pembayangList = this.janaPembayang4D(komboAsal, lockDigitDominan);
                    pembayangList.forEach(pb => list4D.push(pb));
                });
            });

            let setJawaBazi = this.sortCombo(
                `${dataBazi.digit[0]}${dataBazi.digit[1]}${dataJawa.digitJawa1}${lockDigitDominan}`
            );
            list4D.push(setJawaBazi);
        }

        for (let r = 0; r < 3; r++) {
            let barisBayangStr = m3x3Bayangan[r].join('');
            list4D.push(this.sortCombo(barisBayangStr + lockDigitDominan));
        }

        let cornerData = this.ekstraksiCornerLock4x4(m4x4);
        if (cornerData.bridge4D && cornerData.bridge4D.length === 4) {
            list4D.push(cornerData.bridge4D);
        }
        let ekorBaris1 = `${m4x4[0][1]}${m4x4[0][2]}${m4x4[0][3]}`;
        list4D.push(this.sortCombo(ekorBaris1 + m3x3Bayangan[0][0].toString()));

        if (cornerData.raw4D.length === 4) {
            list4D.push(cornerData.raw4D);
        }

        let isRabu = tarikhObj.getDay() === 3;
        let isHujungMinggu = (tarikhObj.getDay() === 0 || tarikhObj.getDay() === 6);

        list3DText.slice(0, 5).forEach(t3d => {
            let kUtama = this.sortCombo(t3d + lockDigitDominan);
            list4D.push(kUtama);
            this.janaPembayang4D(kUtama, lockDigitDominan).forEach(pb => list4D.push(pb));
            
            if (isRabu && missingDigits.length > 0) {
                 list4D.push(this.sortCombo(t3d + missingDigits[0].toString()));
                 if (missingDigits.length > 1) {
                     list4D.push(this.sortCombo(t3d + missingDigits[1].toString()));
                 }
            } else if (isHujungMinggu) {
                 let terasRaw = m3x3[1][1].toString();
                 list4D.push(this.sortCombo(t3d + terasRaw));
                 if (missingDigits.length > 0) {
                     list4D.push(this.sortCombo(t3d + missingDigits[0].toString())); 
                 }
            } else {
                 if (missingDigits.length > 0) {
                     list4D.push(this.sortCombo(t3d + missingDigits[0].toString()));
                 }
            }
        });

        let unik4D = [...new Set(list4D)].slice(0, 10);
        let target4DUtama = unik4D[0] || this.sortCombo(top3DCore + lockDigitDominan);
        let senaraiBayangTarget = this.janaPembayang4D(target4DUtama, lockDigitDominan);
        let paparanPod4D = senaraiBayangTarget.length > 0 
            ? `${target4DUtama} (Bayang: ${senaraiBayangTarget.join(' / ')})`
            : target4DUtama;

        return {
            matrix4x4: m4x4,
            matrix3x3: m3x3,
            matrixBayangan: m3x3Bayangan,
            missing: missingDigits,
            kunciLock: kunciLock,
            hasil2D: list2DText,
            hasil3D: list3DText,
            hasil4D: unik4D,
            pod: {
                top2D: list2DText.slice(0, 3).join(', '),
                top3D: list3DText.slice(0, 3).join(', '),
                top4D: paparanPod4D,
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
        
        const elMode = document.getElementById('operatorMode');
        const operatorMode = elMode ? elMode.value : "GDLOTTO";

        let historyArray = inputHistory.match(/\b\d{4}\b/g) || [];
        if (historyArray.length === 0) {
            historyArray = ["1508", "5241", "6336"];
        }

        globalResult = enjin.jana(inputNum1, inputDate, historyArray, statusCermin, operatorMode);

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
    if (elDate) {
        const sekarang = new Date();
        const yyyy = sekarang.getFullYear();
        const mm = String(sekarang.getMonth() + 1).padStart(2, '0');
        const dd = String(sekarang.getDate()).padStart(2, '0');
        elDate.value = `${yyyy}-${mm}-${dd}`;
    }

    const elHist = document.getElementById('history');
    if (elHist) elHist.value = '';

    ['matrixTable4x4', 'matrixGrid3x3', 'matrixGrid3x3Bayangan', 'out-2d', 'out-3d', 'out-4d'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

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

document.addEventListener('DOMContentLoaded', () => {
    const elDate = document.getElementById('drawDate');
    if (elDate && !elDate.value) {
        const sekarang = new Date();
        const yyyy = sekarang.getFullYear();
        const mm = String(sekarang.getMonth() + 1).padStart(2, '0');
        const dd = String(sekarang.getDate()).padStart(2, '0');
        elDate.value = `${yyyy}-${mm}-${dd}`;
    }
});
