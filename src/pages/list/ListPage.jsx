import React, { useState } from 'react';
import { useCreateListMutation } from '../../redux/features/lists/listApiSlice';

const CreateList = () => {
  const [createList, { isLoading }] = useCreateListMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    createdBy: '',
    tags: [],
    items: [],
    isPublic: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [newItem, setNewItem] = useState({ id: '', rank: 1, explanation: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', formData);

    try {
      const result = await createList(formData).unwrap();
      console.log('Result from createList mutation:', result);
      alert('List created successfully!');
      // Optionally reset form here if you want
    } catch (err) {
      console.error('Failed to create list:', err);
      alert(err?.data?.message || 'Failed to create list');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-semibold mb-4">Create New List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="createdBy"
          placeholder="Created By (User ID)"
          className="w-full p-2 border rounded"
          value={formData.createdBy}
          onChange={handleChange}
          required
        />

        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="ranked">Ranked</option>
          <option value="unordered">Unordered</option>
          <option value="tiered">Tiered</option>
        </select>

        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="webtoon">Webtoon</option>
          <option value="character">Character</option>
        </select>

        <div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-blue-500 text-white rounded">
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded">{tag}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Add Items</h3>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Item ID"
              value={newItem.id}
              onChange={(e) => setNewItem(prev => ({ ...prev, id: e.target.value }))}
              className="p-2 border rounded flex-1"
            />
            <input
              type="number"
              placeholder="Rank"
              value={newItem.rank}
              onChange={(e) => setNewItem(prev => ({ ...prev, rank: Number(e.target.value) }))}
              className="p-2 border rounded w-20"
            />
            <input
              type="text"
              placeholder="Explanation"
              value={newItem.explanation}
              onChange={(e) => setNewItem(prev => ({ ...prev, explanation: e.target.value }))}
              className="p-2 border rounded flex-1"
            />
            <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-green-500 text-white rounded">
              Add Item
            </button>
          </div>
          <ul className="list-disc pl-5">
            {formData.items.map((item, idx) => (
              <li key={idx}>{item.rank}. {item.id} - {item.explanation}</li>
            ))}
          </ul>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
          Public List
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateList;
