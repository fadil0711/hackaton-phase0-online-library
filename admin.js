// ===============================================
// VARIABEL GLOBAL
// ===============================================
// "books" disimpan di level paling atas (global) supaya semua
// fungsi (renderTable, editBook, deleteBook, dst) bisa mengakses
// dan mengubah data yang SAMA, bukan salinan yang berbeda-beda.
let books = [];
let editIndex = null;

// Key (nama kunci) yang dipakai untuk menyimpan data di localStorage.
// Dibuat jadi konstanta biar kalau suatu saat mau ganti nama key,
// cukup ubah di satu tempat ini saja.
const STORAGE_KEY = 'books';


// ===============================================
// LOAD DATA — localStorage dulu, baru fallback ke books.json
// ===============================================
async function loadBooks() {
  try {
    // 1. Cek dulu apakah localStorage sudah punya data buku
    //    (artinya user pernah buka halaman ini sebelumnya).
    //    localStorage.getItem() akan return string JSON, atau
    //    null kalau belum pernah ada data tersimpan sama sekali.
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      // 2a. Kalau ADA data di localStorage -> pakai itu sebagai sumber utama.
      //     JSON.parse() dipakai karena localStorage cuma menyimpan STRING,
      //     jadi harus diubah dulu jadi array/object JS asli.
      books = JSON.parse(savedData);
      console.log('Data diambil dari localStorage');
    } else {
      // 2b. Kalau BELUM ADA data di localStorage (misal ini pertama kali
      //     halaman dibuka) -> ambil data awal dari file books.json.
      const booksRes = await fetch('./books.json');
      books = await booksRes.json();

      // Setelah berhasil ambil dari books.json, langsung simpan
      // ke localStorage juga, supaya reload berikutnya sudah
      // otomatis pakai localStorage (lihat langkah 2a di atas).
      saveToLocalStorage();
      console.log('Data awal diambil dari books.json, lalu disimpan ke localStorage');
    }

    // 3. Setelah "books" siap (dari manapun sumbernya), baru render ke tabel
    renderTable(books);

  } catch (error) {
    console.error("Gagal memuat data buku:", error);
  }
}

loadBooks();


// ===============================================
// FUNGSI BANTUAN — simpan "books" ke localStorage
// ===============================================
// Dipisah jadi fungsi sendiri karena akan dipanggil berkali-kali:
// setelah Add, setelah Edit, dan setelah Delete.
function saveToLocalStorage() {
  // JSON.stringify() dipakai karena localStorage HANYA bisa
  // menyimpan string, sedangkan "books" adalah array of objects.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}


// ===============================================
// RENDER — tampilkan array "data" ke dalam tabel HTML
// ===============================================
function renderTable(data) {
    const tbody = document.getElementById('bookTableBody');

    // Kosongkan dulu isi tabel sebelum diisi ulang,
    // supaya tidak dobel/menumpuk tiap kali renderTable dipanggil.
    tbody.innerHTML = '';

    data.forEach((book, index) => {
        // "index" di sini penting -> dipakai sebagai penunjuk posisi
        // buku ini di dalam array "books", supaya tombol Edit/Delete
        // tahu buku MANA yang harus diubah/dihapus.
        tbody.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>
                    <img src="${book.imageUrl}" class="book-image">
                </td>
                <td class="url-cell">${book.imageUrl}</td>
                <td>${book.title}</td>
                <td>${book.genres.join(', ')}</td>
                <td>${book.language}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2"
                        onclick="editBook(${index})">
                        Edit
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="deleteBook(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ===============================================
// TAMBAH / UPDATE BUKU (submit form modal)
// ===============================================
document.getElementById('bookForm').addEventListener('submit', function (e) {
    // Mencegah form melakukan reload halaman (perilaku default HTML form)
    e.preventDefault();

    // Ambil semua nilai dari input di dalam modal
    const bookData = {
        id: document.getElementById('bookId').value,
        title: document.getElementById('bookTitle').value,
        imageUrl: document.getElementById('bookImageUrl').value,
        genres: document.getElementById('bookGenre').value
            .split(',')        // pisah string "Fantasy, Adventure" jadi array ["Fantasy", " Adventure"]
            .map(g => g.trim()), // hilangkan spasi berlebih di tiap elemen array
        language: document.getElementById('bookLanguage').value
    };

    if (editIndex === null) {
        // Mode TAMBAH: editIndex masih null artinya user belum klik "Edit"
        // sebelumnya, jadi ini data buku baru -> tambahkan ke akhir array.
        books.push(bookData);
    } else {
        // Mode EDIT: editIndex berisi angka index buku yang sedang diedit
        // (di-set sebelumnya oleh fungsi editBook di bawah).
        // Timpa data lama di index tsb dengan data baru dari form.
        books[editIndex] = bookData;
        editIndex = null; // reset lagi supaya submit berikutnya dianggap "tambah baru"
    }

    // Setelah "books" berubah (baik nambah atau edit),
    // WAJIB simpan ulang ke localStorage supaya perubahan tidak hilang
    // saat halaman di-refresh.
    saveToLocalStorage();

    // Render ulang tabel supaya tampilan sesuai data terbaru
    renderTable(books);

    // Kosongkan lagi semua input di form
    this.reset();

    // Tutup modal secara otomatis setelah simpan
    bootstrap.Modal.getInstance(
        document.getElementById('bookModal')
    ).hide();
});


// ===============================================
// EDIT — isi form modal dengan data buku yang mau diedit
// ===============================================
function editBook(index) {
    // Ambil objek buku sesuai index yang diklik dari tabel
    const book = books[index];

    // Simpan index ini ke variabel global "editIndex", supaya nanti
    // pas form di-submit, kode tahu bahwa ini operasi EDIT
    // (bukan tambah baru) dan tahu index mana yang harus ditimpa.
    editIndex = index;

    // Isi ulang semua field form dengan data buku yang lama,
    // supaya user bisa lihat & ubah dari data yang sudah ada.
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookImageUrl').value = book.imageUrl;
    document.getElementById('bookGenre').value = book.genres.join(', ');
    document.getElementById('bookLanguage').value = book.language;

    // Tampilkan modal secara manual lewat JavaScript
    // (karena tombol Edit di tabel tidak pakai atribut data-bs-toggle)
    const modal = new bootstrap.Modal(
        document.getElementById('bookModal')
    );
    modal.show();
}


// ===============================================
// DELETE — hapus 1 buku dari array "books"
// ===============================================
function deleteBook(index) {
    // Konfirmasi dulu ke user sebelum benar-benar menghapus,
    // untuk mencegah penghapusan tidak sengaja.
    const confirmDelete = confirm(
        'Apakah Anda yakin ingin menghapus buku ini?'
    );

    if (confirmDelete) {
        // splice(index, 1) artinya: mulai dari posisi "index",
        // hapus sebanyak 1 item dari array "books".
        books.splice(index, 1);

        // Simpan perubahan (hasil penghapusan) ke localStorage,
        // supaya buku yang dihapus tidak muncul lagi walau di-refresh.
        saveToLocalStorage();

        // Render ulang tabel tanpa buku yang baru dihapus
        renderTable(books);
    }
}


// ===============================================
// SEARCH — filter buku berdasarkan id, judul, atau genre
// ===============================================
document.getElementById('searchInput').addEventListener('input', function (e) {
    const keyword = e.target.value.toLowerCase().trim();

    // Kalau kosong, tampilkan semua buku lagi
    if (keyword === '') {
        renderTable(books);
        return;
    }

    // Filter berdasarkan id, judul, ATAU genre yang cocok dengan keyword
    const filteredBooks = books.filter(function (book) {
        return (
            book.id.toLowerCase().includes(keyword) ||
            book.title.toLowerCase().includes(keyword) ||
            book.language.toLowerCase().includes(keyword) ||
            book.genres.some(function (genre) {
                return genre.toLowerCase().includes(keyword);
            })
        );
    });

    renderTable(filteredBooks);
});


// ===============================================
// CATATAN PENTING
// ===============================================
// 1. File books.json TIDAK PERNAH diubah oleh kode ini.
//    Dia hanya dibaca SATU KALI saat localStorage masih kosong,
//    sebagai data awal/starter. Semua perubahan (add/edit/delete)
//    selanjutnya hidup di localStorage, bukan di file JSON.
//
// 2. Kalau kamu ingin "reset" data ke kondisi awal books.json lagi
//    (misal karena testing), buka Console (F12) lalu ketik:
//       localStorage.removeItem('books')
//    lalu refresh halaman. Kode akan otomatis fetch ulang dari
//    books.json karena localStorage sudah kosong lagi.
//
// 3. localStorage ini sifatnya per-browser & per-device.
//    Kalau kamu buka admin.html dari browser/laptop lain,
//    localStorage-nya kosong lagi dan akan mulai dari books.json.