import React from 'react';
import { useFetchListsQuery } from '../../redux/features/lists/listApiSlice';

const ListViewer = () => {
  const {
    data: lists = [],
    error,
    isLoading,
    refetch,
    isFetching,
  } = useFetchListsQuery();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Lists</h1>
        <button
          onClick={refetch}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isFetching}
        >
          {/* Replace ICON REFRESH with your icon */}
          <span className="w-4 h-4 mr-2">🔄</span>
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          {/* Replace ICON LOADER with your loader icon */}
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
          <div key={list._id} className="shadow-md p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-1">{list.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{list.description}</p>
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
        ))}
      </div>
    </div>
  );
};

export default ListViewer;
