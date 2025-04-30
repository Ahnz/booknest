import React, { useState, useEffect } from 'react';
import ISBNScanner from './ISBNScanner';
import BookFormPopup from './BookFormPopup';
import { openDB } from 'idb';
import noCoverThumb from './assets/no_cover_thumb.gif';
import './App.css';

// Dummy book data (initial recommendations)
const initialBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', thumbnail: 'https://via.placeholder.com/50x75', isbn: '9780743273565' },
  { id: 2, title: '1984', author: 'George Orwell', thumbnail: 'https://via.placeholder.com/50x75', isbn: '9780451524935' },
];

// CSV utility function
const booksToCSV = (books) => {
  const headers = ['title', 'author', 'isbn13', 'published_year', 'reading_status', 'cover_url', 'date_added', 'description', 'categories'];
  const escapeCSV = (str) => `"${str.replace(/"/g, '""')}"`;
  const rows = books.map(book =>
    [
      escapeCSV(book.title || ''),
      escapeCSV(book.author || ''),
      book.isbn13 || '',
      book.published_year || '',
      book.reading_status || 0,
      escapeCSV(book.cover_url || ''),
      book.date_added || '',
      escapeCSV(book.description || ''),
      escapeCSV(book.categories || ''),
    ].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

// Initialize IndexedDB
const dbPromise = openDB('BookNestDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('books')) {
      db.createObjectStore('books', { keyPath: 'isbn13' });
    }
  },
});

// Get all books from IndexedDB
const getBooksFromIndexedDB = async () => {
  const db = await dbPromise;
  return await db.getAll('books');
};

// Add or update a book in IndexedDB
const addBookToIndexedDB = async (book) => {
  const db = await dbPromise;
  await db.put('books', book);
};

// Delete a book from IndexedDB
const deleteBookFromIndexedDB = async (isbn13) => {
  const db = await dbPromise;
  await db.delete('books', isbn13);
};

// Check if book exists in IndexedDB
const bookExistsInIndexedDB = async (isbn13) => {
  const db = await dbPromise;
  return !!(await db.get('books', isbn13));
};

// Get unique categories from books
const getUniqueCategories = (books) => {
  const categories = new Set();
  books.forEach(book => {
    if (book.categories) {
      book.categories.split(', ').forEach(category => categories.add(category.trim()));
    }
  });
  return [...categories].sort();
};

// Main App
const App = ({ updateSW }) => {
  const [screen, setScreen] = useState('home');
  const [showScanner, setShowScanner] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [lastScannedISBN, setLastScannedISBN] = useState(null);
  const [scannedBook, setScannedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date_added');
  const [sortOrder, setSortOrder] = useState('desc');
  const [authorFilter, setAuthorFilter] = useState('');

  // Load books from IndexedDB on mount
  useEffect(() => {
    const loadBooks = async () => {
      const books = await getBooksFromIndexedDB();
      setMyBooks(books);
    };
    loadBooks();
  }, []);

  // Handle ISBN scan
  const handleScan = async (isbn) => {
    // Check for duplicate ISBN when adding
    if (await bookExistsInIndexedDB(isbn)) {
      setError('This book is already in your list.');
      setScannedBook(null);
      return;
    }
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      if (data.totalItems === 0) {
        setError('No book found for this ISBN.');
        setScannedBook(null);
      } else {
        const book = data.items[0];
        const publishedYear = book.volumeInfo.publishedDate?.split('-')[0] || 'Unknown';
        const categories = book.volumeInfo.categories?.join(', ') || '';
        setScannedBook({
          title: book.volumeInfo.title || 'Unknown Title',
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          isbn13: isbn,
          published_year: publishedYear,
          reading_status: 2, // Default to "Read"
          cover_url: book.volumeInfo.imageLinks?.thumbnail, // Undefined if no thumbnail
          date_added: new Date().toISOString().split('T')[0], // e.g., '2025-04-30'
          description: book.searchInfo?.textSnippet || 'No description available.',
          categories,
          uniqueCategories: getUniqueCategories(myBooks), // Pass unique categories
        });
        setLastScannedISBN(isbn);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch book details.');
      setScannedBook(null);
    }
  };

  // Handle add or edit book
  const handleAddBook = async (book) => {
    if (book) {
      // Exclude uniqueCategories from the stored book
      const { uniqueCategories, ...bookToSave } = book;
      await addBookToIndexedDB(bookToSave);
      const updatedBooks = await getBooksFromIndexedDB();
      setMyBooks(updatedBooks);
      setScannedBook(null);
      setEditingBook(null);
    }
  };

  // Handle edit book
  const handleEditBook = (book) => {
    setEditingBook({
      ...book,
      uniqueCategories: getUniqueCategories(myBooks),
    });
  };

  // Handle delete book
  const handleDeleteBook = async (isbn13) => {
    await deleteBookFromIndexedDB(isbn13);
    const updatedBooks = await getBooksFromIndexedDB();
    setMyBooks(updatedBooks);
    setEditingBook(null);
  };

  // Export books as CSV
  const exportBooksAsCSV = () => {
    const csv = booksToCSV(myBooks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `my_books_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear last scanned ISBN after 5 seconds or when scanner/popup is active
  useEffect(() => {
    if (lastScannedISBN && !showScanner && !scannedBook && !editingBook) {
      const timer = setTimeout(() => setLastScannedISBN(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastScannedISBN, showScanner, scannedBook, editingBook]);

  // Sort and filter books
  const getSortedAndFilteredBooks = () => {
    let filteredBooks = myBooks;
    if (authorFilter) {
      filteredBooks = myBooks.filter(book =>
        book.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }
    return filteredBooks.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      const isNumeric = sortBy === 'published_year' || sortBy === 'reading_status';
      let comparison;
      if (isNumeric) {
        comparison = (parseInt(aValue) || 0) - (parseInt(bValue) || 0);
      } else {
        comparison = aValue.toString().localeCompare(bValue.toString());
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Home Screen
  const HomeScreen = ({ setShowScanner, lastScannedISBN }) => (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">BookNest</h1>
      <input
        type="text"
        placeholder="Search books..."
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={() => setShowScanner(true)}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
      >
        Scan ISBN
      </button>
      {lastScannedISBN && (
        <p className="text-sm text-green-600 mb-4">Scanned ISBN: {lastScannedISBN}</p>
      )}
      <h2 className="text-lg mb-2">Recommendations</h2>
      {initialBooks.map(book => (
        <div key={book.id} className="flex mb-2">
          <img src={book.thumbnail} alt={book.title} className="w-10 h-14 mr-2" />
          <div>
            <p>{book.title}</p>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // My Books Screen
  const MyBooksScreen = ({ myBooks }) => {
    const readingStatusLabels = { 0: 'To Read', 1: 'Reading', 2: 'Read' };
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">My Books</h1>
          <button
            onClick={exportBooksAsCSV}
            title="Export Books as CSV"
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Filter by Author:</label>
          <input
            type="text"
            placeholder="Enter author name..."
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="text-sm mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="author">Author</option>
            <option value="published_year">Published Year</option>
            <option value="date_added">Date Added</option>
            <option value="categories">Categories</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-200 rounded"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        {getSortedAndFilteredBooks().length === 0 ? (
          <p className="text-gray-600">No books match your criteria.</p>
        ) : (
          <ul className="space-y-4">
            {getSortedAndFilteredBooks().map(book => (
              <li key={book.isbn13} className="relative flex bg-gray-100 p-4 rounded-lg">
                <img
                  src={book.cover_url || noCoverThumb}
                  alt={book.title}
                  className="w-16 h-24 mr-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-xs text-gray-500">ISBN: {book.isbn13}</p>
                  <p className="text-xs text-gray-500">Published: {book.published_year}</p>
                  <p className="text-xs text-gray-500">Status: {readingStatusLabels[book.reading_status]}</p>
                  <p className="text-xs text-gray-500">Added: {book.date_added}</p>
                  <p className="text-xs text-gray-500">Categories: {book.categories || 'None'}</p>
                  <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                </div>
                <button
                  onClick={() => handleEditBook(book)}
                  className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition w-10 h-10 flex items-center justify-center"
                  title="Edit Book"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-5.657 1.414 1.414-5.657L15.414 3.586z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-16">
        {screen === 'home' ? (
          <HomeScreen setShowScanner={setShowScanner} lastScannedISBN={lastScannedISBN} />
        ) : (
          <MyBooksScreen myBooks={myBooks} />
        )}
      </div>
      {showScanner && (
        <ISBNScanner
          onDetected={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
      {scannedBook && (
        <BookFormPopup
          book={scannedBook}
          mode="add"
          onSave={handleAddBook}
          onClose={() => setScannedBook(null)}
        />
      )}
      {editingBook && (
        <BookFormPopup
          book={editingBook}
          mode="edit"
          onSave={handleAddBook}
          onDelete={handleDeleteBook}
          onClose={() => setEditingBook(null)}
        />
      )}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-80">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t ${scannedBook || editingBook ? 'hidden' : ''}`}>
        <div className="flex">
          <button
            onClick={() => setScreen('home')}
            className={`flex-1 p-2 ${screen === 'home' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setScreen('my-books')}
            className={`flex-1 p-2 ${screen === 'my-books' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">My Books</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;