import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchListByIdQuery, useUpdateListMutation } from '../../redux/features/lists/listApiSlice';
import { useAuth } from '../../context/AuthContext';

const ModifyList = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { data: list, isLoading, isError } = useFetchListByIdQuery(id);
  const [updateList, { isLoading: isUpdating }] = useUpdateListMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ranked',
    category: 'webtoon',
    tags: [],
    items: [],
    isPublic: true,
  });

  useEffect(() => {
    if (list) {
      setFormData({
        title: list.title,
        description: list.description || '',
        type: list.type,
        category: list.category,
        tags: list.tags || [],
        items: list.items || [],
        isPublic: list.isPublic,
      });
    }
  }, [list]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateList({ id, ...formData }).unwrap();
      navigate(`/lists/${id}`);
    } catch (err) {
      console.error('Failed to update the list: ', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading list data</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Modify Your List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="List Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="List Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div>
          <p className="font-semibold mb-1">List Type</p>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="type" value="unordered" checked={formData.type === 'unordered'} onChange={handleChange} />
              Unordered List
            </label>
            <label>
              <input type="radio" name="type" value="ranked" checked={formData.type === 'ranked'} onChange={handleChange} />
              Top 10
            </label>
            <label>
              <input type="radio" name="type" value="tiered" checked={formData.type === 'tiered'} onChange={handleChange} />
              Tier List
            </label>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {['webtoon', 'character'].map(cat => (
              <label key={cat}>
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Visibility</p>
          <label className="mr-4">
            <input type="radio" name="isPublic" checked={formData.isPublic} onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))} />
            Public
          </label>
          <label>
            <input type="radio" name="isPublic" checked={!formData.isPublic} onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))} />
            Private
          </label>
        </div>

        <div>
          <p className="font-semibold mb-1">Tags</p>
          {formData.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
        </div>

        <div>
          <p className="font-semibold mb-1">Items</p>
          {formData.items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <input
                type="text"
                placeholder="Item ID"
                value={item.id}
                onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Explanation"
                value={item.explanation}
                onChange={(e) => handleItemChange(index, 'explanation', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                placeholder="Rank"
                value={item.rank}
                onChange={(e) => handleItemChange(index, 'rank', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update List'}
        </button>
      </form>
    </div>
  );
};

export default ModifyList;
