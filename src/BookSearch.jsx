import React, { useState } from 'react';
import noCoverThumb from './assets/no_cover_thumb.gif';

export default function BookSearch({ myBooks, setScannedBook, setError, bookExistsInIndexedDB }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // Handle book search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.totalItems === 0) {
        setSearchResults([]);
        setError('No books found for this search.');
      } else {
        const books = data.items.map(item => {
          const isbn13 = item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || null;
          return {
            id: item.id,
            title: item.volumeInfo.title || 'Unknown Title',
            author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
            isbn13,
            published_year: item.volumeInfo.publishedDate?.split('-')[0] || 'Unknown',
            cover_url: item.volumeInfo.imageLinks?.thumbnail || noCoverThumb,
            categories: item.volumeInfo.categories?.join(', ') || '',
            description: item.volumeInfo.description || item.searchInfo?.textSnippet || 'No description available.',
          };
        });
        setSearchResults(books);
      }
    } catch (err) {
      setError('Failed to fetch search results.');
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  // Handle add book from search results
  const handleAddSearchResult = async (book) => {
    if (book.isbn13 && await bookExistsInIndexedDB(book.isbn13)) {
      setError('This book is already in your list.');
      return;
    }
    setScannedBook({
      ...book,
      reading_status: 2, // Default to "Read"
      date_added: new Date().toISOString().split('T')[0],
      uniqueCategories: getUniqueCategories(myBooks),
    });
  };

  return (
    <div className="mb-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Search books by title, author, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-l-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
          title="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      {isSearching && (
        <p className="text-sm text-gray-600 mt-2">Searching...</p>
      )}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map(book => (
              <li key={book.id} className="flex items-center bg-gray-100 p-2 rounded-lg">
                <img
                  src={book.cover_url || noCoverThumb}
                  alt={book.title}
                  className="w-10 h-14 mr-2 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
                <button
                  onClick={() => handleAddSearchResult(book)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <p className="text-sm text-gray-600 mt-2">No books found.</p>
      )}
    </div>
  );
}