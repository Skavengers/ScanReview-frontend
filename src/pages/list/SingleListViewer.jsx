import React, { useEffect } from 'react';
import { 
  useFetchListByIdQuery, 
  useLikeListMutation, 
  useViewListMutation 
} from '../../redux/features/lists/listApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoMdCreate } from "react-icons/io";
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineEye, AiOutlineLike } from "react-icons/ai";

const SingleListViewer = () => {
  const { currentUser } = useAuth() || {};
  const { id } = useParams();
  const { data: list, isLoading, isError, refetch } = useFetchListByIdQuery(id);
  const [likeList] = useLikeListMutation();
  const [viewList] = useViewListMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      viewList(id).then(() => {
        refetch();
      });
    }
  }, [id, viewList, refetch]);

  const handleLike = async () => {
    await likeList(id);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading list details</div>;
  if (!list) return <div className="text-center py-8">No list found.</div>;

  const createdAgo = formatDistanceToNow(new Date(list.createdAt));
  const updatedAgo = formatDistanceToNow(new Date(list.updatedAt));

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'webtoon':
        return 'webtoons';
      case 'character':
        return 'characters';
      default:
        return category;
    }
  };

  // Check if current user already liked the list
  const userHasLiked = currentUser && list.likedBy?.includes(currentUser.id);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold line-clamp-1">{list.title}</h2>
        {currentUser?.displayName === list.createdBy && (
          <button
            onClick={() => navigate(`/lists/modify-list/${id}`)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <IoMdCreate className="mr-2" />
            Modify List
          </button>
        )}
      </div>

      <div className="flex gap-6 mb-4 text-gray-700 text-sm">
        <span className="flex items-center gap-1">
          <AiOutlineEye className="text-lg" /> {list.views}
        </span>

        {currentUser ? (
          <button
            onClick={handleLike}
            disabled={userHasLiked}
            className={`flex items-center gap-1 ${userHasLiked ? 'text-gray-400 cursor-not-allowed' : 'hover:text-blue-600'}`}
          >
            <AiOutlineLike className="text-lg" />
            {userHasLiked ? 'Liked' : list.likes}
          </button>
        ) : (
          <span className="flex items-center gap-1 cursor-not-allowed opacity-60 " title="Login to like">
            <AiOutlineLike className="text-lg" /> {list.likes}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {`List of ${list.items?.length || 0} ${getCategoryLabel(
          list.category
        )} · created ${createdAgo} ago · modified ${updatedAgo} ago`}
      </div>

      <p className="mb-4 text-gray-700 break-words whitespace-normal">{list.description}</p>

      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-4 capitalize">Type: {list.type}</span>
        <span className="mr-4 capitalize">Category: {getCategoryLabel(list.category)}</span>
        <span className="mr-4">Created by: {list.createdBy}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tags:</h3>
        {list.tags && list.tags.length > 0 ? (
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
        {list.items && list.items.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {list.items.map((item, idx) => (
              <li key={idx} className='break-words bg-gray-100 rounded-2xl m-2 p-2'>
                <strong className='bg-primary m-1 rounded-full p-2'>{item.rank}.</strong> {item.id}{" "}
                {item.explanation && `– ${item.explanation}`}
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
