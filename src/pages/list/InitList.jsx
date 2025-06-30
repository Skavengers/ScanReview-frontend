// InitList.jsx
import React, { useState } from 'react';
import { useCreateListMutation } from '../../redux/features/lists/listApiSlice';
import { useAuth } from '../../context/AuthContext';
import { IoClose } from "react-icons/io5"; // Importing an icon for the close button

const InitList = ({ onListCreated, onClose }) => {
  const { currentUser } = useAuth();
  const [createList, { isLoading }] = useCreateListMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    createdBy: currentUser.displayName,
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
    try {
      const result = await createList(formData).unwrap();
      alert('Liste créée avec succès !');
      onListCreated(result._id); // Assuming the response contains the new list's ID
    } catch (err) {
      alert(err?.data?.message || 'Échec de la création de la liste');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Create your List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Nommer la liste"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div>
          <p className="font-semibold mb-1">List Types</p>
          <div className="flex gap-4">
            <label><input type="radio" name="type" value="unordered" checked={formData.type === 'unordered'} onChange={handleChange} /> Unordered List</label>
            <label><input type="radio" name="type" value="ranked" checked={formData.type === 'ranked'} onChange={handleChange} /> Top 10</label>
            <label><input type="radio" name="type" value="tiered" checked={formData.type === 'tiered'} onChange={handleChange} /> Tier List</label>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Choose your univers</p>
          <div className="grid grid-cols-2 gap-2">
            {['webtoon', 'character'].map(cat => (
              <label key={cat}>
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                /> {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Visibility</p>
          <label className="mr-4">
            <input type="radio" name="isPublic" checked={formData.isPublic} onChange={() => setFormData(p => ({ ...p, isPublic: true }))} /> Publique
          </label>
          <label>
            <input type="radio" name="isPublic" checked={!formData.isPublic} onChange={() => setFormData(p => ({ ...p, isPublic: false }))} /> Private
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default InitList;
