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
import BookCard from '../books/BookCard';

const CommunityInitList = ({ listId, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // Fetch community list data
  const { data, isLoading, error } = useFetchListByIdQuery(listId);
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
    origin: 'community',
    createdBy: 'community'
  });

  // Tag input
  const [tagInput, setTagInput] = useState('');

  // Populate formData when data loads
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        origin: 'community', // Always
        createdBy: 'community' // Always
      });
    }
  }, [data]);

  // Fetch item details as needed
  const bookIds = formData.items.map(item => item.id).filter(Boolean);
  const { data: books = [], isLoading: booksLoading } = useFetchBooksByIdsQuery(bookIds.length ? bookIds : skipToken);

  const bookMap = useMemo(() => {
    const map = {};
    books.forEach(book => {
      map[book._id] = book;
    });
    return map;
  }, [books]);

  // Change handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Tag helpers
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // Modify items: Remove is allowed, Add is not (if you want to allow, add controls)
  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Move up/down
  const moveItemUp = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const newItems = [...prev.items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return { ...prev, items: newItems };
    });
  }
  const moveItemDown = (index) => {
    if (index === formData.items.length - 1) return;
    setFormData(prev => {
      const newItems = [...prev.items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return { ...prev, items: newItems };
    });
  }

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, origin: 'community', createdBy: 'community' };
      await updateList({ id: listId, ...payload }).unwrap();
      alert('Community list updated!');
      if (onClose) onClose();
      // Optionally navigate elsewhere
    } catch (err) {
      alert(err?.data?.message || 'Failed to update community list');
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this community list?')) return;
    try {
      await deleteList(listId).unwrap();
      alert('Community list deleted.');
      if (onClose) onClose();
    } catch (err) {
      alert(err?.data?.message || 'Failed to delete community list');
    }
  };

  // Loading
  if (isLoading || booksLoading) return <div>Loading...</div>;
  if (error) return <div>{error?.data?.message || 'Could not fetch community list.'}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Modify Community Tier List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          readOnly
          className="w-full p-2 border rounded bg-gray-50"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="font-semibold">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
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
                >↑</button>
                <button
                  type="button"
                  disabled={index === formData.items.length - 1}
                  onClick={() => moveItemDown(index)}
                  className="text-blue-600 disabled:text-gray-400"
                  aria-label="Move item down"
                >↓</button>
                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500">
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update Community List'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Community List'}
        </button>
      </form>
    </div>
  );
};

export default CommunityInitList;
