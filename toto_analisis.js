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

    // Paksi Dinamik berubah setiap hari & berbeza antara GD dan Toto
    binaMatriksTarikh(tarikhInput, operatorMode = "GDLOTTO") {
        let tarikhObj = this.parseTarikh(tarikhInput);
        let hari = tarikhObj.getDate();
        let bulan = tarikhObj.getMonth() + 1;
        let tahun2Digit = tarikhObj.getFullYear() % 100;

        let paksiGD = (hari + bulan + tahun2Digit) % 10;
        let paksi = operatorMode === "GDLOTTO" ? paksiGD : (paksiGD + 5) % 10;

        const d = (offset) => (paksi + offset) % 10;

        return [
            [d(2), d(7), d(6)],
            [d(4), paksi, d(5)],
            [d(8), d(3), d(1)]
        ];
    }

    ekstrak3DMatriksTarikh(carta) {
        let senarai3D = [];
        let tambah = (a, b, c) => {
            senarai3D.push(this.sortCombo(`${a}${b}${c}`));
        };

        // Melintang & Menegak
        tambah(carta[0][0], carta[0][1], carta[0][2]);
        tambah(carta[1][0], carta[1][1], carta[1][2]);
        tambah(carta[2][0], carta[2][1], carta[2][2]);
        tambah(carta[0][0], carta[1][0], carta[2][0]);
        tambah(carta[0][1], carta[1][1], carta[2][1]);
        tambah(carta[0][2], carta[1][2], carta[2][2]);

        // Pepenjuru & Tarikan V
        tambah(carta[0][0], carta[1][1], carta[2][2]);
        tambah(carta[0][2], carta[1][1], carta[2][0]);
        tambah(carta[0][0], carta[1][1], carta[0][2]);
        tambah(carta[2][0], carta[1][1], carta[2][2]);

        return [...new Set(senarai3D)].filter(x => x.length === 3);
    }

    // Ekstrak bentuk-T & paksi 4D terus daripada Matriks Tarikh Baru
    ekstrak4DBentukTMatriks(carta) {
        let senarai = [
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[2][1]}`),
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[0][1]}`),
            this.sortCombo(`${carta[0][1]}${carta[1][1]}${carta[2][1]}${carta[1][0]}`),
            this.sortCombo(`${carta[0][1]}${carta[1][1]}${carta[2][1]}${carta[1][2]}`)
        ];
        return [...new Set(senarai)].filter(x => x.length === 4);
    }

    // Ekstrak bentuk-L 4D terus daripada Carta Bayangan (+5)
    ekstrak4DBentukLBayangan(carta) {
        let senarai = [
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[2][2]}`),
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[2][0]}`),
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[0][2]}`),
            this.sortCombo(`${carta[1][0]}${carta[1][1]}${carta[1][2]}${carta[0][0]}`),
            this.sortCombo(`${carta[2][0]}${carta[2][1]}${carta[2][2]}${carta[1][2]}`),
            this.sortCombo(`${carta[2][0]}${carta[2][1]}${carta[2][2]}${carta[1][0]}`)
        ];
        return [...new Set(senarai)].filter(x => x.length === 4);
    }

    // Semak nisbah Ganjil/Genap mengikut hari cabutan Toto
    semakNisbahHariToto(nombor4D, dayIdx) {
        let arr = nombor4D.toString().split('');
        if (arr.length !== 4) return false;
        let ganjil = arr.filter(d => parseInt(d, 10) % 2 !== 0).length;
        let genap = 4 - ganjil;

        if (dayIdx === 3) {
            return ganjil === 2 && genap === 2;
        }
        if (dayIdx === 6) {
            return (ganjil === 3 && genap === 1) || (ganjil === 2 && genap === 2);
        }
        if (dayIdx === 0) {
            return (ganjil === 2 && genap === 2) || (ganjil === 1 && genap === 3);
        }
        return ganjil === 2 && genap === 2;
    }

    // Modul Peta 10 Pasangan (0-9) 3D Panas <-> Shadow (+5) + Penapis Hari
    janaPetaPasangan3D(teras3D, hariCabutan = "RABU", podiumTerkini = []) {
        const semuaDigit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const hari = hariCabutan.toUpperCase();
        const petaHari = { "AHAD": 0, "RABU": 3, "SABTU": 6 };
        const dayIdx = petaHari[hari] !== undefined ? petaHari[hari] : 3;

        const bersih3D = teras3D.toString().replace(/\D/g, '').slice(0, 3);
        const blokAsal = bersih3D.split('').sort().join('');
        const blokShadow = bersih3D
            .split('')
            .map(d => ((parseInt(d, 10) + 5) % 10).toString())
            .sort()
            .join('');

        const digitAda = new Set(podiumTerkini.join('').split(''));
        const digitHilang = podiumTerkini.length > 0
            ? semuaDigit.filter(d => !digitAda.has(d))
            : [];

        const semakStruktur = (nombor4D) => {
            const arr = nombor4D.split('');
            const ganjil = arr.filter(d => parseInt(d, 10) % 2 !== 0).length;
            const genap = 4 - ganjil;
            const adaTwin = new Set(arr).size < 4;
            const skorHilang = [...new Set(arr)].filter(d => digitHilang.includes(d)).length;
            return {
                nombor: nombor4D,
                nisbah: `${ganjil}G ${genap}E`,
                ganjil,
                genap,
                adaTwin,
                skorHilang,
                lulusHari: this.semakNisbahHariToto(nombor4D, dayIdx)
            };
        };

        const petaPenuh = [];
        const senaraiTapis = [];

        for (let d = 0; d <= 9; d++) {
            const dAsal = d.toString();
            const dShadow = ((d + 5) % 10).toString();

            const setAsal = this.sortCombo(blokAsal + dAsal);
            const setShadow = this.sortCombo(blokShadow + dShadow);

            const infoAsal = semakStruktur(setAsal);
            const infoShadow = semakStruktur(setShadow);

            petaPenuh.push({
                pasanganDigit: `${dAsal} ↔ ${dShadow}`,
                asal: infoAsal,
                shadow: infoShadow
            });

            if (infoAsal.lulusHari) senaraiTapis.push({ laluan: blokAsal, ...infoAsal });
            if (infoShadow.lulusHari) senaraiTapis.push({ laluan: blokShadow, ...infoShadow });
        }

        const susunTapis = senaraiTapis.sort((a, b) => b.skorHilang - a.skorHilang);

        return {
            hari,
            blokAsal,
            blokShadow,
            digitHilang,
            petaPenuh,
            hasilTapis: susunTapis
        };
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

    // FORMULA MASTER EUCLIDEAN + MODULO + BAYANGAN (+5)
    kiraVektorKoordinatGD(nomborBase) {
        let input = (nomborBase || '0000').toString().replace(/[^0-9]/g, '');
        if (input.length < 4) input = input.padEnd(4, '0');

        let d1 = parseInt(input.charAt(0), 10);
        let d2 = parseInt(input.charAt(1), 10);
        let d3 = parseInt(input.charAt(2), 10);
        let d4 = parseInt(input.charAt(3), 10);

        let selisihX2 = Math.pow((d3 - d1), 2);
        let selisihY2 = Math.pow((d4 - d2), 2);
        let jumlahKuasa = selisihX2 + selisihY2;
        let jarakTepat = Math.sqrt(jumlahKuasa);

        let kunci2D_1 = (d1 + d4) % 10;
        let kunci2D_2 = Math.round(jarakTepat) % 10;
        let susunan2D = kunci2D_1.toString() + kunci2D_2.toString();

        let bayang1 = (kunci2D_1 + 5) % 10;
        let bayang2 = (kunci2D_2 + 5) % 10;
        let susunanBayang = bayang1.toString() + bayang2.toString();

        return {
            dx: Math.abs(d3 - d1),
            dy: Math.abs(d4 - d2),
            distSq: jumlahKuasa,
            jarak: jarakTepat,
            pasanganAsal: susunan2D,
            pasanganBayang: susunanBayang
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

    // Kekalkan pemberat lama Toto 0.70 / 0.35 (GD kekal 0.65 / 0.55)
    kiraTrajektori(sejarahCabutan, operatorMode = "TOTO") {
        // Had automatik: GD maks 21 nombor (7 draw), Toto maks 12 nombor (4 draw)
        let hadMaks = operatorMode === "GDLOTTO" ? 21 : 12;
        let sejarahHad = sejarahCabutan.slice(0, hadMaks);

        let senaraiSkor = [];
        let panjang = sejarahHad.length;
        let p3 = Math.min(3, panjang);
        let p5 = Math.min(9, panjang);

        let str3 = sejarahHad.slice(0, p3).join('');
        let str5 = sejarahHad.slice(0, p5).join('');
        let strSemua = sejarahHad.join('');

        let beratTerkini = operatorMode === "GDLOTTO" ? 0.65 : 0.15;
        let beratSederhana = operatorMode === "GDLOTTO" ? 0.55 : 0.35;
        let beratKeseluruhan = 0.30;

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

    janaSenarai2DUnjuranVektor(m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin, senaraiVektorGD = [], dataJawa = null, dataBazi = null, operatorMode = "TOTO") {
        if (operatorMode === "GDLOTTO" && Array.isArray(senaraiVektorGD) && senaraiVektorGD.length > 0) {
            let petaGD = new Map();
            senaraiVektorGD.forEach((v, idx) => {
                let skorAsas = 99 - (idx * 2);
                if (!petaGD.has(v.pasanganAsal)) petaGD.set(v.pasanganAsal, skorAsas);
                if (!petaGD.has(v.pasanganBayang)) petaGD.set(v.pasanganBayang, skorAsas - 1);
            });
            return Array.from(petaGD.entries())
                .map(([kombo, skor]) => ({ kombo, skor, jarak: 1.0 }))
                .sort((a, b) => b.skor - a.skor);
        }

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

    janaSenarai3DTriangulasi(m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor, missingDigits, tarikhObj, senaraiVektorGD = [], dataJawa = null, dataBazi = null, operatorMode = "TOTO", m3x3Tarikh = null) {
        let petaSkor = {};
        senaraiObjekSkor.forEach(item => { petaSkor[item.digitSasaran] = item.markahAkhir; });

        let set3D = new Map();
        let hari = tarikhObj.getDay();
        let isRabu = (hari === 3);
        let isHujungMinggu = (hari === 0 || hari === 6);

        if (operatorMode === "GDLOTTO" && Array.isArray(senaraiVektorGD) && senaraiVektorGD.length > 0) {
            senaraiVektorGD.forEach((v, idx) => {
                let vAsal = v.pasanganAsal;
                let vBayang = v.pasanganBayang;
                let skorPodium = 100 - (idx * 3);

                missingDigits.forEach((mDigit, mIdx) => {
                    let mStr = mDigit.toString();
                    let kBayang = this.sortCombo(vBayang + mStr);
                    let kAsal = this.sortCombo(vAsal + mStr);

                    if (kBayang.length === 3) {
                        set3D.set(kBayang, (set3D.get(kBayang) || 0) + skorPodium - mIdx);
                    }
                    if (kAsal.length === 3) {
                        set3D.set(kAsal, (set3D.get(kAsal) || 0) + (skorPodium - 5) - mIdx);
                    }
                });

                let silang = [
                    this.sortCombo(vBayang + vAsal[0]),
                    this.sortCombo(vBayang + vAsal[1]),
                    this.sortCombo(vAsal + vBayang[0]),
                    this.sortCombo(vAsal + vBayang[1])
                ];
                silang.forEach(k3d => {
                    if (k3d.length === 3) {
                        set3D.set(k3d, (set3D.get(k3d) || 0) + (skorPodium - 15));
                    }
                });
            });
        } else {
            // MOD TOTO: Utamakan laluan Bayangan (+5), Matriks Tarikh Baru & Digit Hilang
            let rantaian4x4 = this.janaLaluanRantaianGrid(m4x4);
            rantaian4x4.forEach(c3d => set3D.set(c3d, 3.0));

            let rantaianBayangan = this.janaLaluanRantaianGrid(m3x3Bayangan);
            rantaianBayangan.forEach(c3d => {
                let markah = set3D.get(c3d) || 0;
                set3D.set(c3d, markah + 5.5);
            });

            for (let i = 0; i < 3; i++) {
                let barisBayang = this.sortCombo(m3x3Bayangan[i].join(''));
                let lajurBayang = this.sortCombo(`${m3x3Bayangan[0][i]}${m3x3Bayangan[1][i]}${m3x3Bayangan[2][i]}`);
                set3D.set(barisBayang, (set3D.get(barisBayang) || 2.0) + 7.5);
                set3D.set(lajurBayang, (set3D.get(lajurBayang) || 2.0) + 5.5);
            }

            if (m3x3Tarikh) {
                let garisTarikh = this.ekstrak3DMatriksTarikh(m3x3Tarikh);
                garisTarikh.forEach(c3d => {
                    let markah = set3D.get(c3d) || 2.0;
                    set3D.set(c3d, markah + 4.5);
                });
                let barisTengahTarikh = this.sortCombo(m3x3Tarikh[1].join(''));
                set3D.set(barisTengahTarikh, (set3D.get(barisTengahTarikh) || 2.0) + 4.0);
            }

            let cornerData = this.ekstraksiCornerLock4x4(m4x4);
            cornerData.sub3D.forEach(c3d => {
                let markah = set3D.get(c3d) || 1.0;
                set3D.set(c3d, markah + 3.0);
            });

            let lockStr = kunciLock.length > 0 ? kunciLock[0].toString() : '';
            if (lockStr) {
                let top2D = objek2D.slice(0, 6);
                top2D.forEach(item2D => {
                    let kombo = this.sortCombo(item2D.kombo + lockStr);
                    if (kombo.length === 3) {
                        let markah = set3D.get(kombo) || 1.0;
                        set3D.set(kombo, markah + 2.5);
                    }
                });
            }

            if (missingDigits.length > 0) {
                let missingStrList = missingDigits.map(d => d.toString());
                let bonusMissing = isRabu ? 6.5 : 6.0;
                set3D.forEach((skor, kombo) => {
                    let unikKombo = [...new Set(kombo.split(''))];
                    let jumlahMissing = unikKombo.filter(d => missingStrList.includes(d)).length;
                    if (jumlahMissing > 0) {
                        set3D.set(kombo, skor + (jumlahMissing * bonusMissing));
                    }
                });
            }

            if (isHujungMinggu) {
                let terasBayang = new Set();
                m3x3Bayangan.forEach(row => row.forEach(val => terasBayang.add(val.toString())));
                let terasStrList = Array.from(terasBayang);

                set3D.forEach((skor, kombo) => {
                    let unikKombo = [...new Set(kombo.split(''))];
                    let jumlahTeras = unikKombo.filter(d => terasStrList.includes(d)).length;
                    if (jumlahTeras === 3) {
                        set3D.set(kombo, skor + 3.5);
                    }
                });
            }
        }

        let pekaliTrajektori = operatorMode === "GDLOTTO" ? 0.5 : 0.20;
        let hasilSusunan = [];
        set3D.forEach((skorAsas, kombo) => {
            let d1 = kombo[0], d2 = kombo[1], d3 = kombo[2];
            let skorTrajektori = (petaSkor[d1] || 0) + (petaSkor[d2] || 0) + (petaSkor[d3] || 0);
            let skorAkhir = skorAsas + (skorTrajektori * pekaliTrajektori);
            hasilSusunan.push({ kombo: kombo, skor: skorAkhir });
        });

        return hasilSusunan.sort((a, b) => b.skor - a.skor);
    }

    jana(nombor4D, tarikhInput, sejarahResult, statusCermin, operatorMode = "GDLOTTO") {
        let tarikhObj = this.parseTarikh(tarikhInput);
        let dataJawa = this.dapatkanKalendarJawa(tarikhObj);
        let dataBazi = this.dapatkanElemenBazi(tarikhObj);

        let senaraiPodium = [];
        if (nombor4D && /^\d{4}$/.test(nombor4D.trim())) {
            senaraiPodium.push(nombor4D.trim());
        }
        if (sejarahResult && sejarahResult.length > 0) {
            sejarahResult.forEach(r => {
                if (!senaraiPodium.includes(r) && senaraiPodium.length < 3) {
                    senaraiPodium.push(r);
                }
            });
        }
        if (senaraiPodium.length === 0) senaraiPodium = ['0000'];

        let senaraiVektorGD = senaraiPodium.map(num => this.kiraVektorKoordinatGD(num));

        let senaraiObjekSkor = this.kiraTrajektori(sejarahResult, operatorMode);
        let m4x4 = this.binaMatrix4x4Dinamik(nombor4D, dataJawa, dataBazi, senaraiObjekSkor);

        let m3x3 = operatorMode === "GDLOTTO"
            ? this.binaMatrix3x3GDLotto(tarikhObj)
            : this.binaMatrix3x3LebahNaga(tarikhObj);
        let m3x3Bayangan = this.binaMatrixBayangan3x3(m3x3);
        let m3x3Tarikh = this.binaMatriksTarikh(tarikhInput, operatorMode);

        let dataKunci = this.kesanNomborKunciLock(
            m4x4, m3x3, m3x3Bayangan, operatorMode, dataJawa, dataBazi, senaraiObjekSkor
        );
        let missingDigits = dataKunci.digitHilang;
        let kunciLock = dataKunci.kunciLock;

        if (senaraiPodium.length > 0) {
            let gabungPodium = senaraiPodium.join('');
            let cariHilang = [];
            for (let i = 0; i <= 9; i++) {
                if (!gabungPodium.includes(i.toString())) {
                    cariHilang.push(i);
                }
            }
            if (cariHilang.length > 0) {
                missingDigits = cariHilang.slice(0, 5);
            }
        }

        let objek2D = this.janaSenarai2DUnjuranVektor(
            m4x4, m3x3, m3x3Bayangan, senaraiObjekSkor, statusCermin, senaraiVektorGD, dataJawa, dataBazi, operatorMode
        );
        let list2DText = objek2D.map(item => item.kombo);

        let objek3D = this.janaSenarai3DTriangulasi(
            m4x4, m3x3Bayangan, m3x3, objek2D, kunciLock, senaraiObjekSkor, missingDigits, tarikhObj, senaraiVektorGD, dataJawa, dataBazi, operatorMode, m3x3Tarikh
        );

        let list3DTarikh = this.ekstrak3DMatriksTarikh(m3x3Tarikh);
        let hasil3DHot = [];
        let semua3DText = objek3D.map(item => item.kombo);
        let list3DText = [];

        if (operatorMode === "GDLOTTO") {
            // Kekalkan logik GD Lotto asal 100%
            list3DText = semua3DText.slice(0, 24);
            list3DText.forEach(k3d => {
                if (list3DTarikh.includes(k3d)) {
                    hasil3DHot.push(k3d);
                }
            });
            hasil3DHot = [...new Set(hasil3DHot)].slice(0, 6);
        } else {
            // Hot Match Toto: WAJIB wujud dalam Matriks Tarikh Baru + bawa Digit Hilang
            list3DText = semua3DText.slice(0, 36);
            let missingStrList = missingDigits.map(String);

            semua3DText.forEach(k3d => {
                if (!list3DTarikh.includes(k3d)) return;
                let unikDigit = [...new Set(k3d.split(''))];
                let bilHilang = unikDigit.filter(d => missingStrList.includes(d)).length;

                if (missingStrList.length > 0) {
                    if (bilHilang >= 1) {
                        hasil3DHot.push(k3d);
                    }
                } else {
                    hasil3DHot.push(k3d);
                }
            });

            if (hasil3DHot.length < 3) {
                semua3DText.forEach(k3d => {
                    if (list3DTarikh.includes(k3d) && !hasil3DHot.includes(k3d)) {
                        hasil3DHot.push(k3d);
                    }
                });
            }

            hasil3DHot = [...new Set(hasil3DHot)].slice(0, 6);
        }

        let hasil3DNormal = list3DText.filter(x => !hasil3DHot.includes(x)).slice(0, 6);

        let lockDigitDominan = kunciLock.length > 0
            ? kunciLock[0].toString()
            : (missingDigits[0] !== undefined ? missingDigits[0].toString() : m3x3Bayangan[1][1].toString());
        let top3DCore = hasil3DHot.length > 0 ? hasil3DHot[0] : (hasil3DNormal[0] || this.sortCombo(m3x3Bayangan[0].join('')));

        let list4D = [];
        let hariIdx = tarikhObj.getDay();
        let isRabu = hariIdx === 3;
        let isHujungMinggu = (hariIdx === 0 || hariIdx === 6);

        if (operatorMode === "GDLOTTO") {
            // Kekalkan logik 4D GD Lotto asal 100%
            let senaraiPengikat4D = [...missingDigits.map(String)];
            this.GD_KEY_NUMBERS.forEach(k => {
                if (!senaraiPengikat4D.includes(k.toString())) {
                    senaraiPengikat4D.push(k.toString());
                }
            });

            let target3DSource = hasil3DHot.length > 0 ? hasil3DHot : hasil3DNormal;
            target3DSource.slice(0, 4).forEach(t3d => {
                senaraiPengikat4D.slice(0, 3).forEach(kDigit => {
                    list4D.push(this.sortCombo(t3d + kDigit));
                });
            });

            let setJawaBazi = this.sortCombo(
                `${dataBazi.digit[0]}${dataBazi.digit[1]}${dataJawa.digitJawa1}${lockDigitDominan}`
            );
            list4D.push(setJawaBazi);

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

            let sumber4DGabung = [...hasil3DHot, ...hasil3DNormal];
            sumber4DGabung.slice(0, 5).forEach(t3d => {
                list4D.push(this.sortCombo(t3d + lockDigitDominan));

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
        } else {
            // Bina 4D Toto daripada Bayangan (+5), Baris 2 4x4 (Jawa+Bazi), Matriks Tarikh & Digit Hilang
            let calonSkor = new Map();
            let tambahCalon = (nombor4D, bonusSumber = 0) => {
                let bersih = this.sortCombo(nombor4D);
                if (bersih.length !== 4) return;
                let sediaAda = calonSkor.get(bersih) || 0;
                if (bonusSumber > sediaAda) calonSkor.set(bersih, bonusSumber);
            };

            for (let r = 0; r < 3; r++) {
                let barisBayangStr = m3x3Bayangan[r].join('');
                missingDigits.slice(0, 3).forEach((mDigit, idx) => {
                    tambahCalon(barisBayangStr + mDigit.toString(), 12 - idx);
                });
                tambahCalon(barisBayangStr + lockDigitDominan, 5);
            }

            // Baris 2 Matriks 4x4 (Jawa + Bazi, cth: 2-9-1-6 -> 1269)
            if (m4x4 && m4x4[1] && m4x4[1].length === 4) {
                tambahCalon(m4x4[1].join(''), 14);
            }

            let bentukLBayangan = this.ekstrak4DBentukLBayangan(m3x3Bayangan);
            bentukLBayangan.forEach(num => tambahCalon(num, 13));

            let bentukTTarikh = this.ekstrak4DBentukTMatriks(m3x3Tarikh);
            bentukTTarikh.forEach(num => tambahCalon(num, 13));

            let paksiTarikhStr = m3x3Tarikh[1][1].toString();
            hasil3DHot.slice(0, 6).forEach(t3d => {
                missingDigits.slice(0, 3).forEach((mDigit, idx) => {
                    tambahCalon(t3d + mDigit.toString(), 11 - idx);
                });
                tambahCalon(t3d + paksiTarikhStr, 9);
                tambahCalon(t3d + lockDigitDominan, 6);
            });

            let cornerData = this.ekstraksiCornerLock4x4(m4x4);
            if (cornerData.bridge4D && cornerData.bridge4D.length === 4) tambahCalon(cornerData.bridge4D, 5);
            if (cornerData.raw4D && cornerData.raw4D.length === 4) tambahCalon(cornerData.raw4D, 5);

            hasil3DNormal.slice(0, 4).forEach(t3d => {
                if (missingDigits.length > 0) tambahCalon(t3d + missingDigits[0].toString(), 8);
                tambahCalon(t3d + lockDigitDominan, 4);
            });

            let missingStrList = missingDigits.map(String);
            let susunToto4D = Array.from(calonSkor.entries()).map(([nombor, skorSumber]) => {
                let unikDigit = [...new Set(nombor.split(''))];
                let bilHilang = unikDigit.filter(d => missingStrList.includes(d)).length;
                let lulusHari = this.semakNisbahHariToto(nombor, hariIdx);
                let adaTwin = unikDigit.length < 4;

                let skorAkhir = skorSumber + (bilHilang * 6.5) + (lulusHari ? 15 : 0);

                let kiraDigit = {};
                nombor.split('').forEach(d => { kiraDigit[d] = (kiraDigit[d] || 0) + 1; });
                if (Object.values(kiraDigit).some(v => v >= 3)) {
                    skorAkhir -= 12;
                }

                if (!adaTwin) skorAkhir += 2.5;

                return { nombor, skorAkhir };
            });

            susunToto4D.sort((a, b) => b.skorAkhir - a.skorAkhir);
            list4D = susunToto4D.map(item => item.nombor);
        }

        let unik4D = [...new Set(list4D)].slice(0, 10);
        let target4D = unik4D[0] || this.sortCombo(top3DCore + lockDigitDominan);

        let petaPasangan3D = this.janaPetaPasangan3D(top3DCore, dataJawa.hari, senaraiPodium);

        return {
            matrix4x4: m4x4,
            matrix3x3: m3x3,
            matrixBayangan: m3x3Bayangan,
            matrixTarikh: m3x3Tarikh,
            missing: missingDigits,
            kunciLock: kunciLock,
            hasil2D: list2DText,
            hasil3DHot: hasil3DHot,
            hasil3DNormal: hasil3DNormal,
            hasil4D: unik4D,
            petaPasangan3D: petaPasangan3D,
            pod: {
                top2D: list2DText.slice(0, 3).join(', '),
                top3D: hasil3DHot.length > 0 ? hasil3DHot.join(', ') : hasil3DNormal.slice(0, 3).join(', '),
                top4D: target4D,
                lockDominan: lockDigitDominan
            }
        };
    }
}

const enjin = new EnjinDwiCartaToto();
let globalResult = null;

// =========================================================================
// SISTEM PENANDA WARNA 3D INTERAKTIF PADA 4 CARTA (TANPA UBAH INDEX.HTML)
// =========================================================================
const PALET_WARNA_3D = [
    '#e63946', // Merah Terang
    '#2563eb', // Biru Diraja
    '#16a34a', // Hijau Zamrud
    '#ea580c', // Oren Pekat
    '#9333ea', // Ungu
    '#0891b2', // Sian / Teal
    '#db2777', // Magenta
    '#65a30d', // Hijau Limau
    '#b45309', // Tembaga
    '#4f46e5', // Indigo
    '#0f766e', // Teal Gelap
    '#c026d3'  // Fuchsia
];
const WARNA_3D_MANUAL = '#111827';

let petaWarna3D = new Map();
let pilihan3DAktif = new Set();
let custom3DAktif = '';

function pasangGayaWarna3D() {
    if (document.getElementById('gaya-warna-3d')) return;
    const style = document.createElement('style');
    style.id = 'gaya-warna-3d';
    style.textContent = `
        .panel-warna-3d {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px 14px;
            margin: 12px 0;
            font-size: 13px;
        }
        .panel-warna-header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
        }
        .panel-warna-tajuk {
            font-weight: 700;
            color: #1e293b;
        }
        .panel-warna-butang-grup {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
        }
        .btn-warna-kecil {
            border: none;
            border-radius: 6px;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            background: #1e293b;
            color: #ffffff;
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .btn-warna-kecil:hover {
            opacity: 0.9;
        }
        .btn-warna-sekunder {
            background: #e2e8f0;
            color: #1e293b;
        }
        .input-uji-3d {
            width: 110px;
            padding: 4px 8px;
            border: 1px solid #94a3b8;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
        }
        .baris-chip-3d {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
            margin-top: 6px;
        }
        .label-baris-chip {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            min-width: 64px;
        }
        .chip-3d-pantas {
            padding: 4px 10px;
            border-radius: 6px;
            color: #ffffff;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            border: 2px solid transparent;
            transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
        }
        .tag-3d-warna {
            cursor: pointer !important;
            user-select: none;
            border: 2px solid transparent !important;
            transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
        }
        .tag-3d-aktif, .chip-3d-aktif {
            box-shadow: 0 0 0 2.5px #111827, 0 3px 8px rgba(0, 0, 0, 0.25) !important;
            transform: scale(1.07);
            opacity: 1 !important;
        }
        .tag-3d-malap {
            opacity: 0.62;
        }
        .cell-3d-aktif {
            font-weight: 800 !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
            transition: all 0.15s ease;
        }
        .status-warna-info {
            margin-top: 8px;
            font-size: 12px;
            color: #334155;
        }
    `;
    document.head.appendChild(style);
}

function sediakanPetaWarna3D(listHot, listNormal) {
    petaWarna3D.clear();
    pilihan3DAktif.clear();
    custom3DAktif = '';

    const gabungan = [...new Set([...(listHot || []), ...(listNormal || [])])];
    gabungan.forEach((kombo, idx) => {
        petaWarna3D.set(kombo, PALET_WARNA_3D[idx % PALET_WARNA_3D.length]);
    });
}

function binaPanelKawalanWarna3D(listHot, listNormal) {
    pasangGayaWarna3D();

    let panel = document.getElementById('panel-kawalan-warna-3d');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'panel-kawalan-warna-3d';
        panel.className = 'panel-warna-3d';

        const hotBox = document.querySelector('.hot-match-box');
        const elHasil = document.getElementById('hasil');
        if (hotBox && hotBox.parentNode) {
            hotBox.parentNode.insertBefore(panel, hotBox);
        } else if (elHasil) {
            elHasil.prepend(panel);
        } else {
            return;
        }
    }

    const binaChips = (senarai) => {
        if (!senarai || senarai.length === 0) return '<span style="color:#94a3b8;font-size:12px;">Tiada</span>';
        return senarai.map(k => {
            const warna = petaWarna3D.get(k) || '#334155';
            return `<span class="chip-3d-pantas" data-kombo="${k}" style="background:${warna};" onclick="togolWarna3D('${k}')" title="Klik untuk nyalakan ${k} dalam semua 4 carta">${k}</span>`;
        }).join('');
    };

    panel.innerHTML = `
        <div class="panel-warna-header">
            <div class="panel-warna-tajuk">🎨 Penanda Warna 3D Dalam Carta (Klik 3D Untuk Nilai)</div>
            <div class="panel-warna-butang-grup">
                <button type="button" class="btn-warna-kecil" onclick="nyalakanSemuaHot3D()">Papar Semua Hot 3D</button>
                <button type="button" class="btn-warna-kecil btn-warna-sekunder" onclick="padamSemuaWarna3D()">Padam Warna</button>
                <input type="text" id="input-uji-3d" class="input-uji-3d" maxlength="3" placeholder="Uji 3D (cth: 916)" onkeydown="if(event.key==='Enter'){event.preventDefault();uji3DManual();}">
                <button type="button" class="btn-warna-kecil" onclick="uji3DManual()">Nyalakan</button>
            </div>
        </div>
        <div class="baris-chip-3d">
            <span class="label-baris-chip">🔥 Hot 3D:</span>
            ${binaChips(listHot)}
        </div>
        <div class="baris-chip-3d">
            <span class="label-baris-chip">📌 Solid 3D:</span>
            ${binaChips(listNormal)}
        </div>
        <div id="status-warna-3d" class="status-warna-info"></div>
    `;
    panel.style.display = 'block';
}

function togolWarna3D(kombo) {
    if (!kombo) return;
    if (pilihan3DAktif.has(kombo)) {
        pilihan3DAktif.delete(kombo);
    } else {
        pilihan3DAktif.add(kombo);
    }
    kemaskiniWarnaCarta();
}

function nyalakanSemuaHot3D() {
    if (!globalResult) return;
    pilihan3DAktif.clear();
    (globalResult.hasil3DHot || []).forEach(k => pilihan3DAktif.add(k));
    kemaskiniWarnaCarta();
}

function padamSemuaWarna3D() {
    pilihan3DAktif.clear();
    custom3DAktif = '';
    const elInput = document.getElementById('input-uji-3d');
    if (elInput) elInput.value = '';
    kemaskiniWarnaCarta();
}

function uji3DManual() {
    const elInput = document.getElementById('input-uji-3d');
    if (!elInput) return;
    const bersih = elInput.value.replace(/\D/g, '').slice(0, 3);
    if (bersih.length !== 3) {
        custom3DAktif = '';
        kemaskiniWarnaCarta();
        return;
    }
    custom3DAktif = enjin.sortCombo(bersih);
    elInput.value = bersih;
    kemaskiniWarnaCarta();
}

function kemaskiniWarnaCarta() {
    const senaraiAktif = [];
    pilihan3DAktif.forEach(k => {
        senaraiAktif.push({ kombo: k, warna: petaWarna3D.get(k) || '#2563eb' });
    });
    if (custom3DAktif && custom3DAktif.length === 3) {
        senaraiAktif.push({ kombo: custom3DAktif, warna: WARNA_3D_MANUAL, manual: true });
    }

    const adaAktif = senaraiAktif.length > 0;

    // 1. Kemaskini semua petak dalam 4 carta (Matriks 4x4, Teras 3x3, Bayangan +5, Matriks Tarikh Baru)
    const semuaPetak = document.querySelectorAll(
        '#matrixTable4x4 td, #matrixGrid3x3 .cell-3x3, #matrixGrid3x3Bayangan .cell-3x3, #matrixGrid3x3Tarikh .cell-3x3'
    );

    semuaPetak.forEach(petak => {
        const digit = (petak.dataset.digit !== undefined ? petak.dataset.digit : petak.innerText).trim();
        const padanan = senaraiAktif.filter(item => item.kombo.includes(digit));

        if (!adaAktif) {
            petak.style.background = '';
            petak.style.color = '';
            petak.style.borderColor = '';
            petak.style.boxShadow = '';
            petak.style.opacity = '';
            petak.classList.remove('cell-3d-aktif');
        } else if (padanan.length === 0) {
            petak.style.background = '';
            petak.style.color = '';
            petak.style.borderColor = '';
            petak.style.boxShadow = '';
            petak.style.opacity = '0.42';
            petak.classList.remove('cell-3d-aktif');
        } else if (padanan.length === 1) {
            const w = padanan[0].warna;
            petak.style.background = w;
            petak.style.color = '#ffffff';
            petak.style.borderColor = w;
            petak.style.boxShadow = '0 0 0 2px rgba(17, 24, 39, 0.28)';
            petak.style.opacity = '1';
            petak.classList.add('cell-3d-aktif');
        } else {
            // Jika 2 atau lebih 3D berkongsi angka yang sama -> belang warna jelas
            const langkah = 100 / padanan.length;
            const hentian = padanan.map((item, idx) =>
                `${item.warna} ${(idx * langkah).toFixed(1)}%, ${item.warna} ${((idx + 1) * langkah).toFixed(1)}%`
            ).join(', ');
            petak.style.background = `linear-gradient(135deg, ${hentian})`;
            petak.style.color = '#ffffff';
            petak.style.borderColor = '#111827';
            petak.style.boxShadow = '0 0 0 2px #111827';
            petak.style.opacity = '1';
            petak.classList.add('cell-3d-aktif');
        }
    });

    // 2. Segerakkan gaya aktif pada kotak 3D di panel atas & kotak senarai asal
    const semuaTag = document.querySelectorAll('.tag-3d-warna, .chip-3d-pantas');
    semuaTag.forEach(tag => {
        const k = tag.dataset.kombo;
        const aktif = pilihan3DAktif.has(k);
        tag.classList.toggle('tag-3d-aktif', aktif);
        tag.classList.toggle('chip-3d-aktif', aktif);
        tag.classList.toggle('tag-3d-malap', adaAktif && !aktif);
    });

    // 3. Kemaskini teks status
    const elStatus = document.getElementById('status-warna-3d');
    if (elStatus) {
        if (!adaAktif) {
            elStatus.innerHTML = 'Klik mana-mana kotak 3D berwarna di atas (atau bawah) untuk nyalakan laluan angkanya dalam keempat-empat carta.';
        } else {
            const lencana = senaraiAktif.map(item =>
                `<span style="display:inline-block;background:${item.warna};color:#fff;padding:1px 7px;border-radius:4px;font-weight:700;margin-right:4px;">${item.kombo}${item.manual ? ' (Manual)' : ''}</span>`
            ).join('');
            elStatus.innerHTML = `Sedang menyala dalam carta: ${lencana} <span style="color:#64748b;">(Petak berbelang = angka bertindan lebih daripada 1 3D)</span>`;
        }
    }
}

// =========================================================================
// FUNGSI PAPARAN CARTA & BORANG
// =========================================================================
function lukisJadual4x4(matrix) {
    const table = document.getElementById('matrixTable4x4');
    if (!table) return;
    table.innerHTML = '';
    matrix.forEach(row => {
        let tr = document.createElement('tr');
        row.forEach(val => {
            let td = document.createElement('td');
            td.dataset.digit = String(val);
            td.innerText = val;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function lukisGrid3x3(matrix, idElement, isShadow = false, lockDigits = [], isTarikh = false) {
    const grid = document.getElementById(idElement);
    if (!grid) return;
    grid.innerHTML = '';

    let centerRow = 1;
    let centerCol = 1;

    matrix.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
            let div = document.createElement('div');
            let classNames = 'cell-3x3';

            if (isShadow) classNames += ' cell-shadow';
            if (lockDigits.includes(val)) classNames += ' cell-lock';

            if (isTarikh && rIdx === centerRow && cIdx === centerCol) {
                classNames += ' cell-date-core';
            }

            div.className = classNames;
            div.dataset.digit = String(val);
            div.innerText = val;
            grid.appendChild(div);
        });
    });
}

function tunjukSenarai(idElement, dataArray, isHot = false) {
    const container = document.getElementById(idElement);
    if (!container) return;
    container.innerHTML = '';
    dataArray.forEach(item => {
        let div = document.createElement('div');
        div.className = 'number-tag';
        if (isHot) div.classList.add('tag-hot');
        div.innerText = item;
        container.appendChild(div);
    });
}

function tunjukSenarai3DWarna(idElement, dataArray, isHot = false) {
    const container = document.getElementById(idElement);
    if (!container) return;
    container.innerHTML = '';
    dataArray.forEach(item => {
        let div = document.createElement('div');
        div.className = 'number-tag tag-3d-warna';
        if (isHot) div.classList.add('tag-hot');
        const warna = petaWarna3D.get(item) || '#2563eb';
        div.style.background = warna;
        div.style.color = '#ffffff';
        div.dataset.kombo = item;
        div.title = `Klik untuk nyalakan 3D ${item} dalam semua carta`;
        div.innerText = item; // Kekalkan teks bersih supaya fungsi salin() tak terganggu
        div.onclick = () => togolWarna3D(item);
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
        lukisGrid3x3(globalResult.matrixTarikh, 'matrixGrid3x3Tarikh', false, [], true);

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

        // Sediakan warna unik setiap 3D & bina panel penilai interaktif
        sediakanPetaWarna3D(globalResult.hasil3DHot, globalResult.hasil3DNormal);

        tunjukSenarai('out-2d', globalResult.hasil2D);
        tunjukSenarai3DWarna('out-3d-hot', globalResult.hasil3DHot, true);
        tunjukSenarai3DWarna('out-3d', globalResult.hasil3DNormal, false);
        tunjukSenarai('out-4d', globalResult.hasil4D);

        binaPanelKawalanWarna3D(globalResult.hasil3DHot, globalResult.hasil3DNormal);

        // Automatik nyalakan Hot 3D pertama supaya terus nampak warna hidup pada carta
        const pertama3D = (globalResult.hasil3DHot && globalResult.hasil3DHot[0]) ||
                          (globalResult.hasil3DNormal && globalResult.hasil3DNormal[0]);
        if (pertama3D) {
            pilihan3DAktif.add(pertama3D);
        }
        kemaskiniWarnaCarta();

        const hotBox = document.querySelector('.hot-match-box');
        if (hotBox) {
            hotBox.style.opacity = globalResult.hasil3DHot.length === 0 ? '0.5' : '1';
        }

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

    ['matrixTable4x4', 'matrixGrid3x3', 'matrixGrid3x3Bayangan', 'matrixGrid3x3Tarikh', 'out-2d', 'out-3d-hot', 'out-3d', 'out-4d'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    petaWarna3D.clear();
    pilihan3DAktif.clear();
    custom3DAktif = '';

    const panelWarna = document.getElementById('panel-kawalan-warna-3d');
    if (panelWarna) panelWarna.style.display = 'none';

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
    pasangGayaWarna3D();
    const elDate = document.getElementById('drawDate');
    if (elDate && !elDate.value) {
        const sekarang = new Date();
        const yyyy = sekarang.getFullYear();
        const mm = String(sekarang.getMonth() + 1).padStart(2, '0');
        const dd = String(sekarang.getDate()).padStart(2, '0');
        elDate.value = `${yyyy}-${mm}-${dd}`;
    }
});
