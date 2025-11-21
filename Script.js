// Perintah ini "mendengarkan" halaman web. Ini memastikan bahwa semua kode 
        // JavaScript di dalamnya baru akan berjalan *setelah* seluruh elemen HTML 
        // (seperti tombol dan layar) selesai dimuat dengan sempurna.
        document.addEventListener('DOMContentLoaded', function() {
            
            // Bagian ini "mengambil" atau "menghubungkan" elemen-elemen penting 
            // dari file HTML agar bisa dikontrol oleh JavaScript:
            // - 'display' terhubung ke layar kalkulator (yang punya id="display").
            // - 'statusImage' terhubung ke gambar di atas kalkulator (yang punya id="statusImage").
            // - 'buttons' terhubung ke *semua* tombol kalkulator (yang punya kelas ".btn-calc").
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            // Ini adalah persiapan untuk menyimpan link (URL) gambar yang akan ditampilkan. 
            // Tiga variabel ini menyimpan link untuk tiga kondisi: 
            // gambar normal ('Kalkulator'), gambar 'Sukses!' (hijau), dan gambar 'Error!' (merah).
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
             * Ini adalah sebuah *function* (fungsi) yang dibuat khusus untuk 
             * **mengganti gambar** di atas kalkulator. Fungsi ini menerima 
             * satu parameter 'state' (status).
             * - Jika state-nya 'success', gambar 'Sukses!' (hijau) akan ditampilkan.
             * - Jika state-nya 'error', gambar 'Error!' (merah) akan ditampilkan.
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    // Jika status yang diberikan *bukan* 'success' atau 'error' 
                    // (misalnya 'normal'), maka kode ini akan mengembalikan 
                    // gambar ke kondisi normal (gambar imgNormal yang abu-abu).
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
             * Ini adalah fungsi yang bertugas untuk **membersihkan layar** kalkulator. 
             * Fungsi ini akan:
             * 1. Mengosongkan teks di layar ('display.value = ''').
             * 2. Memanggil fungsi changeImage('normal') untuk mengembalikan gambar ke status normal.
             * Fungsi ini akan dipanggil saat tombol 'C' ditekan.
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
             * Ini adalah fungsi untuk tombol 'DEL' (Delete).
             * Perintah 'display.value.slice(0, -1)' berarti "ambil semua teks di layar, 
             * kecuali satu karakter terakhir". Ini efektif menghapus karakter terakhir.
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
             * Ini adalah fungsi untuk **menambahkan teks** ke layar. 
             * Setiap kali tombol angka atau operator (seperti '7' atau '+') ditekan, 
             * fungsi ini akan mengambil 'value' (nilai) tombol itu dan 
             * menambahkannya ke akhir teks yang sudah ada di layar ('display.value += value').
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
             * Ini adalah fungsi "otak" dari kalkulator, yang akan dijalankan 
             * saat tombol '=' ditekan untuk **menghitung hasil akhir**.
             */
            function calculateResult() {
                // Pengecekan pertama: Jika pengguna menekan '=' saat layar masih kosong (''),
                // kalkulator akan menampilkan pesan 'Kosong!' dan gambar error.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    // Perintah ini memberi jeda waktu. Ini akan menjalankan fungsi 
                    // 'clearDisplay' (bersihkan layar) secara otomatis setelah 1500 milidetik (1.5 detik).
                    setTimeout(clearDisplay, 1500);
                    return; // Menghentikan fungsi agar tidak lanjut ke 'try'
                }

                try {
                    // Ini adalah inti dari perhitungan. Perintah 'eval()' mengambil 
                    // semua teks di layar (misalnya "5+2*3") dan menghitungnya 
                    // sebagai kode JavaScript untuk mendapatkan hasilnya.
                    let result = eval(display.value
                        .replace(/%/g, '/100') // Sebelum 'eval' dijalankan, kode ini mengganti semua simbol '%' dengan '/100'. Ini dilakukan agar kalkulator mengerti bahwa "50%" artinya "50 dibagi 100".
                    ); 
                    
                    // Setelah mendapat hasil, kode ini mengecek apakah hasilnya 'isFinite' 
                    // (angka yang valid, bukan 'Infinity' seperti hasil dari 1 dibagi 0).
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); // Jika perhitungan berhasil, panggil fungsi changeImage untuk menampilkan gambar 'Sukses!' yang berwarna hijau.
                    } else {
                        // Jika hasilnya tidak valid (misal 1/0), lemparkan error
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    // Blok 'catch' ini akan berjalan jika 'try' gagal (misal pengguna mengetik "5++2")
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); // Panggil fungsi changeImage untuk menampilkan gambar 'Error!' yang merah.
                    setTimeout(clearDisplay, 1500); // Bersihkan layar error setelah 1.5 detik
                }
            }


            // Kode ini melakukan *looping* (perulangan) pada *setiap* tombol 
            // kalkulator (semua tombol yang punya kelas '.btn-calc' yang sudah 
            // kita ambil di awal).
            buttons.forEach(button => {
                // Untuk setiap tombol, tambahkan 'event listener' yang menunggu 'click'.
                button.addEventListener('click', () => {
                    // Saat tombol di-klik, ambil nilainya dari atribut 'data-value'
                    const value = button.getAttribute('data-value');

                    // Ini adalah 'penyeleksi kondisi' (switch). Kode ini akan memeriksa 
                    // 'value' (nilai 'data-value' dari tombol yang ditekan) dan 
                    // memutuskan fungsi mana yang harus dijalankan.
                    switch(value) {
                        case 'C':
                            // Jika tombol yang ditekan adalah 'C', panggil fungsi clearDisplay (bersihkan layar).
                            clearDisplay();
                            break;
                        case 'DEL':
                            // Jika tombol yang ditekan adalah 'DEL', panggil fungsi deleteLastChar (hapus satu karakter terakhir).
                            deleteLastChar();
                            break;
                        case '=':
                            // Jika tombol yang ditekan adalah '=', panggil fungsi calculateResult (hitung hasil).
                            calculateResult();
                            break;
                        default:
                            // Ini adalah kasus 'default' (untuk semua tombol lain seperti angka '1', '2', '+', '/', dll.).
                            // Pertama, ia mengecek: jika gambar status sedang 'Sukses' atau 'Error' (hasil perhitungan sebelumnya),
                            // bersihkan dulu layar (clearDisplay()) sebelum mengetik angka baru.
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            // Panggil fungsi appendToDisplay(value) untuk menambahkan angka/operator ke layar.
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            // Ini adalah *event listener* tambahan yang "mendengarkan" keyboard. 
            // Ini memungkinkan kalkulator untuk digunakan dengan mengetik di keyboard, 
            // bukan hanya mengklik tombol. 'e' adalah data tombol yang ditekan.
            document.addEventListener('keydown', (e) => {
                const key = e.key; // Mengambil nama tombol yang ditekan (misal "7", "Enter", "Backspace")

                // Jika tombol yang ditekan adalah angka (0-9), titik, atau operator
                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    // Sama seperti logika klik, jika status 'Sukses'/'Error', bersihkan layar dulu
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key); // Tambahkan tombol keyboard ke layar
                    e.preventDefault(); // Mencegah aksi default browser (misal '/' membuka 'find')
                
                // Jika tombol yang ditekan adalah 'Enter' atau '='
                } else if (key === 'Enter' || key === '=') {
                    calculateResult(); // Hitung hasil
                    e.preventDefault();
                
                // Jika tombol yang ditekan adalah 'Backspace'
                } else if (key === 'Backspace') {
                    deleteLastChar(); // Hapus karakter terakhir
                    e.preventDefault();
                
                // Jika tombol yang ditekan adalah 'Escape' atau 'c'
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay(); // Bersihkan layar
                    e.preventDefault();
                }
            });

        });