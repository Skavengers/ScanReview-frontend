import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFetchListByIdQuery, useUpdateListMutation } from '../../redux/features/lists/listApiSlice';
import axiosInstance from '../../utils/axiosInstance'; // ensure this exists

const ModifyList = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const { data, isLoading, error } = useFetchListByIdQuery(id);
  const [updateList, { isLoading: isUpdating }] = useUpdateListMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    tags: [],
    items: [],
    isPublic: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [newItem, setNewItem] = useState({ id: '', rank: 1, explanation: '' });

  useEffect(() => {
    if (data && formData.title === '') {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'ranked',
        category: data.category || 'webtoon',
        tags: data.tags || [],
        items: data.items || [],
        isPublic: data.isPublic ?? true,
      });
      const maxRank = Math.max(0, ...data.items.map(item => item.rank || 0));
      setNewItem({ id: '', rank: maxRank + 1, explanation: '' });
    }
  }, [data, formData.title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData }; // exclude createdBy
      await updateList({ id, ...payload }).unwrap();

      // Optional: log the update for auditing
      await axiosInstance.post('/your-endpoint', {
        ...payload,
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'Unknown',
      });

      alert('List updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update list');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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

  const handleAddItem = () => {
    if (newItem.id) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      setNewItem({ id: '', rank: newItem.rank + 1, explanation: '' });
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  if (isLoading || !formData) return <div>Loading list...</div>;
  if (error) return <div>{error?.data?.message || 'Failed to load list'}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{item.rank}.</span>
              <span>{item.id}</span>
              <span className="italic text-sm">{item.explanation}</span>
              <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <input
              placeholder="Item ID"
              value={newItem.id}
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              placeholder="Explanation (optional)"
              value={newItem.explanation}
              onChange={(e) => setNewItem({ ...newItem, explanation: e.target.value })}
              className="p-2 border rounded"
            />
            <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-gray-300 rounded">
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
      </form>
    </div>
  );
};

export default ModifyList;
