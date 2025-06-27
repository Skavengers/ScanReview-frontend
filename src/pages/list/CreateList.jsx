import React, { useState } from 'react';
import { useCreateListMutation } from '../../redux/features/lists/listApiSlice';

const CreateList = () => {
  const [createList, { isLoading }] = useCreateListMutation();
  //const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    //CreatedBy: id,
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
    } catch (err) {
      alert(err?.data?.message || 'Échec de la création de la liste');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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

        <div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded">{tag}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium">Add elements</h3>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="ID"
              value={newItem.id}
              onChange={(e) => setNewItem(prev => ({ ...prev, id: e.target.value }))}
              className="p-2 border rounded flex-1"
            />
            <input
              type="number"
              placeholder="Rang"
              value={newItem.rank}
              onChange={(e) => setNewItem(prev => ({ ...prev, rank: Number(e.target.value) }))}
              className="p-2 border rounded w-20"
            />
            <input
              type="text"
              placeholder="Explication"
              value={newItem.explanation}
              onChange={(e) => setNewItem(prev => ({ ...prev, explanation: e.target.value }))}
              className="p-2 border rounded flex-1"
            />
            <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-green-500 text-white rounded">
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 mt-2">
            {formData.items.map((item, idx) => (
              <li key={idx}>{item.rank}. {item.id} - {item.explanation}</li>
            ))}
          </ul>
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

export default CreateList;
