const books = [
    {
        id: 'book-1',
        title: "Harry Potter and the Philosopher's Stone",
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