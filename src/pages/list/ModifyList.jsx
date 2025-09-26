import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useFetchListByIdQuery,
  useUpdateListMutation,
  useDeleteListMutation,
} from '../../redux/features/lists/listApiSlice';
import { useFetchBooksByIdsQuery } from '../../redux/features/books/booksApi';
import { skipToken } from '@reduxjs/toolkit/query';
import ItemSearchBar from './ItemSearchBar';
import BookCard from '../books/BookCard';

const ModifyList = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch list data
  const { data, isLoading, error } = useFetchListByIdQuery(id);
  const [updateList, { isLoading: isUpdating }] = useUpdateListMutation();
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    tags: [],
    items: [],
    isPublic: true,
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // New item being added
  const [newItem, setNewItem] = useState({ id: '', rank: 1, explanation: '' });

  // Populate formData when data loads
  useEffect(() => {
    if (data) {
      setFormData(prevFormData => {
        if (prevFormData.title !== '') {
          // Already initialized, do not update again
          return prevFormData;
        }
        return {
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'ranked',
          category: data.category || 'webtoon',
          tags: data.tags || [],
          items: data.items || [],
          isPublic: data.isPublic ?? true,
        };
      });

      const maxRank = Math.max(0, ...data.items.map(item => item.rank || 0));
      setNewItem({ id: '', rank: maxRank + 1, explanation: '' });
    }
  }, [data]);

  // Fetch full book details for all items
  const bookIds = formData.items.map(item => item.id).filter(Boolean);
  const {
    data: books = [],
    isLoading: booksLoading,
  } = useFetchBooksByIdsQuery(bookIds.length ? bookIds : skipToken);

  // Create lookup map of bookId => book object
  const bookMap = useMemo(() => {
    const map = {};
    books.forEach(book => {
      map[book._id] = book;
    });
    return map;
  }, [books]);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add a new tag
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // Add new item to list
  const handleAddItem = () => {
    if (newItem.id) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      setNewItem({ id: '', rank: newItem.rank + 1, explanation: '' });
    }
  };

  // Remove item from list
  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    // Update ranks after removal
    const updatedRanks = updatedItems.map((item, idx) => ({ ...item, rank: idx + 1 }));
    setFormData(prev => ({ ...prev, items: updatedRanks }));
  };

  // Move item up
  const moveItemUp = (index) => {
    if (index === 0) return; // Already first
    setFormData(prev => {
      const newItems = [...prev.items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      // Update ranks
      const updatedRanks = newItems.map((item, idx) => ({ ...item, rank: idx + 1 }));
      return { ...prev, items: updatedRanks };
    });
  };

  // Move item down
  const moveItemDown = (index) => {
    if (index === formData.items.length - 1) return; // Already last
    setFormData(prev => {
      const newItems = [...prev.items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      // Update ranks
      const updatedRanks = newItems.map((item, idx) => ({ ...item, rank: idx + 1 }));
      return { ...prev, items: updatedRanks };
    });
  };

  // Submit updated list
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      await updateList({ id, ...payload }).unwrap();
      alert('List updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update list');
    }
  };

  // Delete list
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this list?');
    if (!confirmed) return;
    try {
      await deleteList(id).unwrap();
      alert('List deleted successfully');
      navigate('/lists/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete list');
    }
  };

  if (isLoading || booksLoading || !formData) return <div>Loading list...</div>;
  if (error) return <div>{error?.data?.message || 'Failed to load list'}</div>;

  return (
    <div className="max-w-xl mx-auto p-3 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Modify your List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="font-semibold">List Type</label>
          <div className="flex gap-4">
            {['unordered', 'ranked', 'tiered'].map(type => (
              <label key={type}>
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={handleChange}
                /> {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-semibold">Category</label>
          <div className="flex gap-4">
            {['webtoon', 'character'].map(cat => (
              <label key={cat}>
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                /> {cat}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-semibold">Visibility</label>
          <label className="mr-4">
            <input
              type="radio"
              name="isPublic"
              checked={formData.isPublic}
              onChange={() => setFormData(p => ({ ...p, isPublic: true }))}
            /> Public
          </label>
          <label>
            <input
              type="radio"
              name="isPublic"
              checked={!formData.isPublic}
              onChange={() => setFormData(p => ({ ...p, isPublic: false }))}
            /> Private
          </label>
        </div>

        <div>
          <label className="font-semibold">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-grow p-2 border rounded"
            />
            <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-gray-200 rounded">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span key={i} className="bg-blue-100 px-2 py-1 rounded text-sm">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500">x</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Items</label>
          {formData.items.map((item, index) => {
            const book = bookMap[item.id];
            return (
              <div key={index} className="flex items-center gap-2">
                <span>{item.rank}.</span>
                {book ? (
                  <BookCard book={book} haveDescription={false} />
                ) : (
                  <div className="italic text-gray-500">Loading book info...</div>
                )}
                <div className="italic text-sm">{item.explanation}</div>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItemUp(index)}
                  className="text-blue-600 disabled:text-gray-400"
                  aria-label="Move item up"
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === formData.items.length - 1}
                  onClick={() => moveItemDown(index)}
                  className="text-blue-600 disabled:text-gray-400"
                  aria-label="Move item down"
                >
                  ↓
                </button>

                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500">
                  Remove
                </button>
              </div>
            );
          })}
          <div className="flex flex-col gap-2 mt-2">
            {formData.category === 'webtoon' ? (
              <ItemSearchBar
                category="webtoon"
                onSelect={(item) => setNewItem({
                  ...newItem,
                  id: item._id,
                  explanation: '', // reset explanation
                })}
              />
            ) : (
              <input
                placeholder="Enter character ID"
                value={newItem.id}
                onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                className="p-2 border rounded"
              />
            )}
            <input
              placeholder="Explanation (optional)"
              value={newItem.explanation}
              onChange={(e) => setNewItem({ ...newItem, explanation: e.target.value })}
              className="p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={!newItem.id}
            >
              Add Item
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update List'}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete List'}
        </button>
      </form>
    </div>
  );
};

export default ModifyList;
