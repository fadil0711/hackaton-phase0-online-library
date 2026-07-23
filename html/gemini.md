Siap. Kita akan membuat CRUD Buku tanpa Search menggunakan HTML + CSS + JavaScript murni.

Saya akan beri 3 bagian:

dashboard.js → kode JavaScript lengkap

Yang harus ditambahkan di HTML

Yang harus ditambahkan di CSS

1. Buat file dashboard.js

Buat file baru bernama dashboard.js lalu isi dengan kode berikut:

const books = [
    {
        id: 'book-1',
        title: 'Harry Potter and the Philosopher's Stone',
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg',
        genres: ['Fantasy', 'Young Adult', 'Adventure'],
        language: 'English'
    },
    {
        id: 'book-2',
        title: 'The Hobbit',
        imageUrl: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
        genres: ['Fantasy', 'Adventure'],
        language: 'English'
    },
    {
        id: 'book-3',
        title: 'Bumi',
        imageUrl: 'https://covers.openlibrary.org/b/id/10909258-L.jpg',
        genres: ['Fantasy', 'Adventure'],
        language: 'Indonesia'
    }
];

let editIndex = null;

// Tampilkan data ke tabel
function renderTable() {
    const tbody = document.getElementById('bookTableBody');
    tbody.innerHTML = '';

    books.forEach((book, index) => {
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

// Tambah / Update buku
document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const bookData = {
        id: document.getElementById('bookId').value,
        title: document.getElementById('bookTitle').value,
        imageUrl: document.getElementById('bookImageUrl').value,
        genres: document.getElementById('bookGenre').value
            .split(',')
            .map(g => g.trim()),
        language: document.getElementById('bookLanguage').value
    };

    if (editIndex === null) {
        books.push(bookData);
    } else {
        books[editIndex] = bookData;
        editIndex = null;
    }

    renderTable();

    // reset form
    this.reset();

    // tutup modal
    bootstrap.Modal.getInstance(
        document.getElementById('bookModal')
    ).hide();
});

// Edit
function editBook(index) {
    const book = books[index];
    editIndex = index;

    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookImageUrl').value = book.imageUrl;
    document.getElementById('bookGenre').value = book.genres.join(', ');
    document.getElementById('bookLanguage').value = book.language;

    const modal = new bootstrap.Modal(
        document.getElementById('bookModal')
    );

    modal.show();
}

// Delete
function deleteBook(index) {
    const confirmDelete = confirm(
        'Apakah Anda yakin ingin menghapus buku ini?'
    );

    if (confirmDelete) {
        books.splice(index, 1);
        renderTable();
    }
}

// Pertama kali halaman dibuka
renderTable();
2. Yang harus ditambahkan di file HTML
A. Tambahkan link dashboard.js

Letakkan sebelum ``.

<script src="dashboard.js"></script>
B. Ganti tombol Add User menjadi Add Book

Cari bagian tombol lama, lalu ganti dengan:

<div class="text-center mb-4">
    <button class="btn btn-success px-4"
            data-bs-toggle="modal"
            data-bs-target="#bookModal">

        <i class="bi bi-plus-circle"></i>
        Add Book
    </button>
</div>
C. Ganti tabel lama dengan tabel ini
<table class="table table-hover align-middle">
    <thead class="table-dark">
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Image URL</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Language</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody id="bookTableBody">
        <!-- Diisi otomatis oleh JavaScript -->
    </tbody>
</table>
D. Tambahkan Modal Add/Edit Book

Letakkan di bawah tabel.

<!-- Modal Add/Edit Book -->
<div class="modal fade" id="bookModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-book-half"></i>
                    Add / Edit Book
                </h5>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                </button>
            </div>

            <div class="modal-body">

                <form id="bookForm">

                    <div class="mb-3">
                        <label class="form-label">Book ID</label>
                        <input type="text"
                               id="bookId"
                               class="form-control"
                               placeholder="book-1"
                               required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text"
                               id="bookTitle"
                               class="form-control"
                               required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image URL</label>
                        <input type="url"
                               id="bookImageUrl"
                               class="form-control"
                               required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Genre</label>
                        <input type="text"
                               id="bookGenre"
                               class="form-control"
                               placeholder="Fantasy, Adventure"
                               required>
                    </div>

                    <div class="mb-4">
                        <label class="form-label">Language</label>
                        <select id="bookLanguage"
                                class="form-select"
                                required>

                            <option value="">Pilih Bahasa</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="English">English</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>

                        </select>
                    </div>

                    <button type="submit"
                            class="btn btn-success w-100">

                        <i class="bi bi-save"></i>
                        Save Book

                    </button>

                </form>

            </div>

        </div>

    </div>
</div>
3. Yang harus ditambahkan di file CSS

Tambahkan ke dashboard.css atau CSS Anda sekarang.

/* ===========================
   CRUD BOOK TABLE
=========================== */

body{
    background:#f4f6f9;
}

.card{
    border:none;
    border-radius:20px;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
}

.table{
    background:white;
}

.table th{
    text-align:center;
    vertical-align:middle;
}

.table td{
    text-align:center;
    vertical-align:middle;
}

.table tbody tr:hover{
    background:#f8f9fa;
    transition:.2s;
}

/* gambar buku */
.book-image{
    width:70px;
    height:100px;
    object-fit:cover;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,.15);
}

/* url panjang */
.url-cell{
    max-width:250px;
    word-break:break-all;
    font-size:13px;
    color:#0d6efd;
}

/* tombol */
.btn-success{
    border-radius:10px;
    font-weight:600;
}

.btn-warning{
    color:white;
    border-radius:8px;
}

.btn-danger{
    border-radius:8px;
}

/* modal */
.modal-content{
    border:none;
    border-radius:18px;
    overflow:hidden;
}

.modal-header{
    background:linear-gradient(135deg,#198754,#157347);
    color:white;
    border-bottom:none;
}

.modal-title{
    font-weight:bold;
}

.btn-close{
    filter:invert(1);
}

.form-control,
.form-select{
    border-radius:10px;
    padding:10px;
}

.form-control:focus,
.form-select:focus{
    border-color:#198754;
    box-shadow:0 0 8px rgba(25,135,84,.25);
}
Hasil akhirnya

CRUD Anda akan memiliki:

➕ Add Book (modal popup)

✏️ Edit data buku

🗑️ Delete dengan konfirmasi

🖼️ Preview gambar buku

📚 Genre bisa lebih dari satu

🌍 Language menggunakan dropdown

⚡ Semua berjalan tanpa refresh halaman

Yang harus dihapus dari HTML lama

Hapus bagian berikut jika masih ada:

Form Search

Dropdown Show 10 entries

Pagination Previous / Next

Tabel lama yang berisi data statis

Setelah itu, halaman CRUD Anda akan menjadi sepenuhnya dinamis menggunakan JavaScript seperti aplikasi CRUD sungguhan.