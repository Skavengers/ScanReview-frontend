// ListViewer.jsx
import React, { useState } from 'react';
import { useFetchListsQuery } from '../../redux/features/lists/listApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { LuRefreshCw } from "react-icons/lu";
import { IoMdCreate } from "react-icons/io";
import InitList from './InitList';
import { useAuth } from '../../context/AuthContext';
import CommunityListBar from './CommunityListBar';
const ListViewer = () => {
  const [showInitList, setShowInitList] = useState(false);
  const [authWarning, setAuthWarning] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    data: lists = [],
    error,
    isLoading,
    refetch,
    isFetching,
  } = useFetchListsQuery();

  const handleCreateListClick = () => {
    if (!currentUser) {
      setAuthWarning('You need to be logged in to create a list.');
      return;
    }
    setAuthWarning('');
    setShowInitList(true);
  };

  const handleListCreated = (newListId) => {
    setShowInitList(false);
    navigate(`/lists/${newListId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Lists</h1>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleCreateListClick}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <span className='mr-2'><IoMdCreate /></span>
              Create Your List
            </button>
            <button
              onClick={refetch}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isFetching}
            >
              <span className="mr-2"><LuRefreshCw /></span>
              Refresh
            </button>
          </div>
          {authWarning && (
            <div className="text-red-600 text-sm">{authWarning}</div>
          )}
        </div>
      </div>

      {showInitList && (
        <div className="mb-6">
          <InitList onListCreated={handleListCreated} onClose={() => setShowInitList(false)} />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <span className="animate-spin w-8 h-8 text-gray-600">⏳</span>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center py-4">
          {error?.data?.message || 'Something went wrong.'}
        </div>
      )}

      {!isLoading && lists.length === 0 && (
        <div className="text-gray-500 text-center py-4">No lists found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map(list => (
          <Link to={`/lists/${list._id}`} key={list._id}>
            <div className="shadow-md p-4 border rounded bg-white">
              <h2 className="text-xl font-semibold mb-1 line-clamp-1">{list.title}</h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">  {list.description}</p>
              <div className="text-xs text-gray-500 mb-2">
                <span className="mr-2 capitalize">Type: {list.type}</span>
                <span className="mr-2 capitalize">Category: {list.category}</span>
              </div>
              <div className="flex text-xs text-gray-400 gap-4">
                <span>{list.items.length} items</span>
                <span>{list.views} views</span>
                <span>{list.likes} likes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/*<CommunityListBar category="webtoon" subject="YourSubjectHere" />*/}
    </div>
  );
};

export default ListViewer;
