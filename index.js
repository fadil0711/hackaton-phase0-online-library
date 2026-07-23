// Mengambil elemen tombol login dari HTML
const loginBtn = document.getElementById('loginBtn');

// Menambahkan event listener ketika tombol login diklik
loginBtn.addEventListener('click', function () {
    // Mengambil nilai input dari elemen email dan password
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // Kondisi pengecekan
    if (emailInput === 'admin' && passwordInput === 'admin') {
        // Pindah ke halaman admin.html
        window.location.href = 'admin.html';
    } else {
        // Tampilkan peringatan jika tidak sesuai
        alert('email atau password yang anda masukan salah!');
    }
});