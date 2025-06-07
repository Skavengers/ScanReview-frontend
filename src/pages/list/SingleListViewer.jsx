import React from 'react';
import { useFetchListByIdQuery } from '../../redux/features/lists/listApiSlice';
import { useParams } from 'react-router-dom';

const SingleListViewer = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchListByIdQuery(id);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happened while loading book info</div>;

  if (!book) {
    return <div className="text-center py-8">No list found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
      <p className="mb-4 text-gray-700">{book.description}</p>

      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-4 capitalize">Type: {book.type}</span>
        <span className="mr-4 capitalize">Category: {book.category}</span>
        <span className="mr-4">Created by: {book.createdBy}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tags:</h3>
        {book.tags && book.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag, idx) => (
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
        {book.items && book.items.length ? (
          <ul className="list-disc list-inside space-y-1">
            {book.items.map((item, idx) => (
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
