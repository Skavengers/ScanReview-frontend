// SingleListViewer.jsx
import React from 'react';
import { useFetchListByIdQuery } from '../../redux/features/lists/listApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoMdCreate } from "react-icons/io";
import { Link } from 'react-router-dom';
const SingleListViewer = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const { data: list, isLoading, isError } = useFetchListByIdQuery(id);
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happened while loading list info</div>;
  if (!list) {
    return <div className="text-center py-8">No list found.</div>;
  }

  const handleModifyClick = () => {
    navigate(`/lists/modify-list/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className='flex justify-between items-center mb-6'>
        <h2 className="text-2xl font-bold mb-2">{list.title}</h2>
        {currentUser.displayName === list.createdBy && (
          <button
            onClick={handleModifyClick}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <span className='mr-2'><IoMdCreate /></span>
            Modify Your List
          </button>
        )}
      </div>

      <p className="mb-4 text-gray-700">{list.description}</p>
      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-4 capitalize">Type: {list.type}</span>
        <span className="mr-4 capitalize">Category: {list.category}</span>
        <span className="mr-4">Created by: {list.createdBy}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tags:</h3>
        {list.tags && list.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {list.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No tags</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items:</h3>
        {list.items && list.items.length ? (
          <ul className="list-disc list-inside space-y-1">
            {list.items.map((item, idx) => (
              <li key={idx}>
                <strong>{item.rank}.</strong> {item.id} {item.explanation && `- ${item.explanation}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No items</p>
        )}
      </div>
    </div>
  );
};

export default SingleListViewer;
