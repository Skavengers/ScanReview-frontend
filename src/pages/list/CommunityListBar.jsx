import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useFetchListsByCategoryQuery,
  useFetchListsByUserQuery,
  useGenerateCommunityListMutation,
} from '../../redux/features/lists/listApiSlice';
import { useAuth } from '../../context/AuthContext';
import CommunityInitList from './CommunityInitList';

const CommunityListBar = ({ category = 'webtoon', subject = '' }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Fetch community lists filtered by origin
  const { data: allLists = [], isLoading: listsLoading } = useFetchListsByCategoryQuery(category);
  const communityLists = allLists.filter(list => list.origin === 'community');

  // Fetch user lists for the signed-in user
  const { data: userLists = [], isLoading: userLoading } = useFetchListsByUserQuery(currentUser?.uid || '', {
    skip: !currentUser,
  });

  const [generateCommunityList, { isLoading: isGenerating }] = useGenerateCommunityListMutation();

  // State to open the CommunityInitList editor modal
  const [editingCommunityId, setEditingCommunityId] = useState(null);

  const [message, setMessage] = useState('');

  const handleGenerateClick = async () => {
    setMessage('');
    try {
      await generateCommunityList({ subject, category }).unwrap();
      setMessage('Community list generated/updated!');
    } catch {
      setMessage('Failed to generate community list.');
    }
  };

  return (
    <aside className="w-80 min-h-screen sticky top-6 left-0 p-6 rounded-2xl shadow-xl
      bg-gradient-to-b from-blue-50 via-white to-green-50 border border-blue-100
      flex flex-col backdrop-blur-sm">

      {/* Community Lists Section */}
      <h2 className="text-2xl font-semibold mb-5 text-blue-800 border-b border-blue-200 pb-2">
        🌍 Community Tier Lists
      </h2>

      {listsLoading ? (
        <p className="text-center text-gray-400 italic">Loading community lists...</p>
      ) : communityLists.length === 0 ? (
        <p className="text-center text-gray-400 italic">No community lists available.</p>
      ) : (
        <ul className="mb-8 space-y-2 max-h-64 overflow-y-auto pr-1">
          {communityLists.map(list => (
            <li key={list._id} className="flex items-center justify-between">
              <button
                title={list.title}
                onClick={() => navigate(`/lists/${list._id}`)}
                className="block w-full text-left px-4 py-2 rounded-lg bg-white/80 hover:bg-blue-100/80
                  shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400
                  transition-all duration-200 truncate"
              >
                <span className="font-medium text-blue-900">{list.title}</span>
              </button>
              {/* Modify button */}
              <button
                type="button"
                onClick={() => setEditingCommunityId(list._id)}
                className="ml-2 px-3 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-700 
                  hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Modify
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* User Lists Section */}
      {currentUser && (
        <>
          <h2 className="text-2xl font-semibold mb-5 text-green-800 border-b border-green-200 pb-2">
            💚 Your Lists
          </h2>
          {userLoading ? (
            <p className="text-center text-gray-400 italic">Loading your lists...</p>
          ) : userLists.length === 0 ? (
            <p className="text-center text-gray-400 italic">You haven’t created any lists yet.</p>
          ) : (
            <ul className="mb-6 space-y-2 max-h-56 overflow-y-auto pr-1">
              {userLists.map(list => (
                <li key={list._id}>
                  <button
                    title={list.title}
                    onClick={() => navigate(`/lists/${list._id}`)}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-white/80 hover:bg-green-100/80 
                      shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 
                      transition-all duration-200 truncate"
                  >
                    <span className="font-medium text-green-900">{list.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Create New List Button */}
          <button
            className="mb-3 w-full py-2 bg-gradient-to-r from-green-500 to-green-600
              text-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            onClick={() => navigate('/lists/create-list')}
            aria-label="Create new list"
          >
            ➕ Create New List
          </button>

          {/* Generate Community List Button */}
          <button
            className={`w-full py-2 rounded-lg text-white shadow-md transition-all duration-200 ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:scale-[1.02] focus:ring-blue-500'
            }`}
            onClick={handleGenerateClick}
            disabled={isGenerating || !subject}
            title={subject ? `Generate community list for "${subject}"` : 'Provide subject to generate community list'}
          >
            {isGenerating ? 'Generating...' : '⚙️ Generate Community List'}
          </button>

          {/* Status message */}
          {message && (
            <p className="mt-3 text-center text-sm font-medium text-blue-600 animate-pulse">
              {message}
            </p>
          )}
        </>
      )}

      {!currentUser && (
        <p className="mt-auto text-center text-gray-500 text-sm italic">
          Log in to create and manage your lists.
        </p>
      )}

      {/* Community InitList Modal */}
      {editingCommunityId && (
        <CommunityInitList listId={editingCommunityId} onClose={() => setEditingCommunityId(null)} />
      )}
    </aside>
  );
};

export default CommunityListBar;
