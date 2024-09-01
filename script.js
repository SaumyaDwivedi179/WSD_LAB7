document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    let books = [];
    let currentPage = 1;
    const booksPerPage = 10;

    function fetchBooks() {
        loading.style.display = 'block';
        errorMessage.textContent = '';
        fetch('books.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                books = data;
                displayBooks();
            })
            .catch(error => {
                errorMessage.textContent = `Error fetching books: ${error.message}`;
            })
            .finally(() => {
                loading.style.display = 'none';
            });
    }

    function displayBooks() {
        const filteredBooks = filterBooks();
        const sortedBooks = sortBooks(filteredBooks);
        const paginatedBooks = paginateBooks(sortedBooks);

        bookList.innerHTML = paginatedBooks.map(book => `
            <div class="book">
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.year}</p>
            </div>
        `).join('');

        updatePaginationControls();
    }

    function filterBooks() {
        const query = searchInput.value.toLowerCase();
        return books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
    }

    function sortBooks(filteredBooks) {
        const sortBy = sortSelect.value;
        return filteredBooks.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    }

    function paginateBooks(sortedBooks) {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        return sortedBooks.slice(startIndex, endIndex);
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(books.length / booksPerPage);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    }

    searchInput.addEventListener('input', displayBooks);
    sortSelect.addEventListener('change', displayBooks);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayBooks();
        }
    });
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(books.length / booksPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayBooks();
        }
    });

    fetchBooks();
});
