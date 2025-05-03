import React, { useState, useRef, useEffect } from 'react';
import noCoverThumb from './assets/no_cover_thumb.gif';

export default function BookFormPopup({ book, mode, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    categories: book.categories || '',
    reading_status: book.reading_status !== undefined ? book.reading_status : 2, // Default to "Read"
    isbn13: book.isbn13,
    published_year: book.published_year || '',
    cover_url: book.cover_url,
    date_added: book.date_added || new Date().toISOString().split('T')[0],
    description: book.description || '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter suggestions based on categories input
  useEffect(() => {
    if (formData.categories) {
      const filtered = book.uniqueCategories.filter(cat =>
        cat.toLowerCase().includes(formData.categories.toLowerCase())
      );
      setSuggestions(filtered);
      setIsDropdownVisible(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [formData.categories, book.uniqueCategories]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, categories: suggestion });
    setIsDropdownVisible(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle save (add or edit)
  const handleSave = () => {
    onSave({ ...book, ...formData });
    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(book.isbn13);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.addEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-5xl overflow-y-auto max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)]">
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center min-h-[144px] sm:min-h-[192px]">
            <img
              src={formData.cover_url || noCoverThumb}
              alt={formData.title}
              className="w-24 h-36 sm:w-32 sm:h-48 rounded-lg object-cover"
            />
          </div>
          {/* Form Section */}
          <div className="w-full p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              {mode === 'add' ? 'Add Book' : 'Edit Book'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Read-only Fields */}
              <div>
                <span className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Title</span>
                <p className="text-sm sm:text-base text-gray-600">{formData.title || 'Unknown'}</p>
              </div>
              <div>
                <span className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Author</span>
                <p className="text-sm sm:text-base text-gray-600">{formData.author || 'Unknown'}</p>
              </div>
              <div>
                <span className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">ISBN</span>
                <p className="text-sm sm:text-base text-gray-600">{formData.isbn13 || 'N/A'}</p>
              </div>
              <div>
                <span className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Published Year</span>
                <p className="text-sm sm:text-base text-gray-600">{formData.published_year || 'Unknown'}</p>
              </div>
              {/* Editable Fields */}
              <div className="relative">
                <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Categories</label>
                <input
                  ref={inputRef}
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  placeholder="e.g., Fiction, Thriller"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isDropdownVisible && (
                  <ul
                    ref={dropdownRef}
                    className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-auto shadow-sm"
                  >
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer text-sm sm:text-base text-gray-700"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Reading Status</label>
                <select
                  name="reading_status"
                  value={formData.reading_status}
                  onChange={handleInputChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>To Read</option>
                  <option value={1}>Reading</option>
                  <option value={2}>Read</option>
                </select>
              </div>
              <div>
                <label className="block text-sm sm:text-lg font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2 sm:rows-3"
                />
              </div>
            </div>
            <div className="mt-6 sticky bottom-0 bg-white pt-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <div className="flex space-x-4">
                  {mode === 'edit' && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}