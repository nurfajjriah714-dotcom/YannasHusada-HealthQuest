// Ganti dengan URL DEPLOY Google Apps Script Anda (WAJIB DEPLOY SEBAGAI WEB APP!)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw96Im4uEHCvtCsJbOnMi6A54bOe6GsfGJ-qRdphhOn3PQxvJ-CdpOVgOylvCVJmOyJ/exec'; 
let bankSoal = [];
let jawabanSiswa = [];
let nisSiswa = '';
let namaSiswa = '';
let kelasSiswa = '';
let skor = 0;

// --- Fungsi Utama ---

// 1. Memulai Game/Sistem Soal
async function fetchSoal() {
    try {
        const response = await fetch(APPS_SCRIPT_URL + '?action=getSoal', {
            method: 'GET', // Menggunakan GET untuk mengambil data
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            bankSoal = result.data;
            tampilkanHalamanSoal(); // Fungsi untuk menampilkan soal pertama
        } else {
            alert('Gagal mengambil soal: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching soal:', error);
        alert('Terjadi kesalahan koneksi.');
    }
}

// 2. Mengirim Hasil ke Backend
async function kirimHasil(skorAkhir) {
    const dataKirim = {
        action: 'saveHasil',
        data: JSON.stringify({
            nis: nisSiswa,
            nama: namaSiswa,
            kelas: kelasSiswa,
            skor: skorAkhir,
            totalSoal: bankSoal.length,
            jawabanSiswa: jawabanSiswa
        })
    };

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(dataKirim).toString(),
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            alert(`Pengerjaan selesai! Skor Anda: ${skorAkhir}. Hasil berhasil dicatat.`);
            // Arahkan ke halaman selesai atau menu utama
        } else {
            alert('Gagal mencatat hasil: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving hasil:', error);
        alert('Terjadi kesalahan saat menyimpan hasil.');
    }
}

// --- Logika Game (Contoh) ---
function prosesJawaban(soalId, pilihan) {
    // Di sini seharusnya ada logika untuk membandingkan jawaban siswa
    // dengan kunci jawaban (yang SCRIPT JS tidak miliki)
    // Untuk game yang benar-benar aman, penghitungan skor harusnya di Apps Script (Backend)

    // Untuk contoh sederhana: kita hanya mencatat jawaban
    jawabanSiswa.push({ soalId: soalId, jawaban: pilihan });

    // Pindah ke soal berikutnya atau panggil kirimHasil() jika sudah selesai
}

// --- Fungsi Admin (Contoh) ---
async function lihatDataAdmin(password) {
    if (password !== 'yannashusada2025') { // Ganti dengan password yang lebih kuat
        alert('Password Admin salah!');
        return;
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL + '?action=getHasilAdmin', { method: 'GET' });
        const result = await response.json();
        
        if (result.status === 'success') {
            // Logika untuk menampilkan data hasil pengerjaan (result.data) ke tabel di halaman admin
            console.log('Data Hasil Pengerjaan:', result.data);
            alert('Data Admin berhasil diambil. Lihat konsol untuk data mentah.');
        } else {
            alert('Gagal mengambil data admin: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi.');
    }
}
