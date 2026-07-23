const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', function () {

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    if (emailInput === 'admin' && passwordInput === '!Admin07') {

        window.location.href = 'admin.html';

    } else {

        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Email atau password yang Anda masukkan salah!',
            confirmButtonText: 'OK'
        });

    }

});