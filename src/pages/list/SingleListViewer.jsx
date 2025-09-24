import React, { useMemo, useState } from 'react';
import { useFetchListByIdQuery, useLikeListMutation, useViewListMutation } from '../../redux/features/lists/listApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoMdCreate } from "react-icons/io";
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineEye, AiOutlineLike } from "react-icons/ai";
import BookCard from '../books/BookCard';
import { useFetchBooksByIdsQuery } from '../../redux/features/books/booksApi';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useFetchCommentsByListQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from '../../redux/features/comments/commentsApi';

const SingleListViewer = () => {
  const { currentUser } = useAuth() || {};
  const { id } = useParams();
  const { data: list, isLoading, isError, refetch } = useFetchListByIdQuery(id);
  const [likeList] = useLikeListMutation();
  const [viewList] = useViewListMutation();
  const navigate = useNavigate();

  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
  } = useFetchCommentsByListQuery(id);

  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const handleAddComment = async () => {
    if (!currentUser) {
      setCommentError("You must be logged in to comment.");
      return;
    }
    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    try {
      await addComment({
        userId: currentUser.uid,
        listId: id,
        userDisplayName: currentUser.displayName,
        comment: commentText.trim(),
        type: "list",
      });
      setCommentText("");
      setCommentError("");
      refetchComments();
    } catch (error) {
      setCommentError("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    refetchComments();
  };

  const bookIds = (list?.items ?? []).map(item => item.id).filter(Boolean);
  const { data: books = [] } = useFetchBooksByIdsQuery(
    bookIds.length > 0 ? bookIds : skipToken
  );

  const bookMap = useMemo(() => {
    const map = {};
    books.forEach(book => { map[book._id] = book; });
    return map;
  }, [books]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading list details</div>;
  if (!list) return <div className="text-center py-8">No list found.</div>;

  const createdAgo = formatDistanceToNow(new Date(list.createdAt));
  const updatedAgo = formatDistanceToNow(new Date(list.updatedAt));

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'webtoon': return 'webtoons';
      case 'character': return 'characters';
      default: return category;
    }
  };

  const userHasLiked = currentUser && list.likedBy?.includes(currentUser.id);

  const handleLike = async () => {
    await likeList(id);
    refetch();
  };

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
          <span className="flex items-center gap-1 cursor-not-allowed opacity-60" title="Login to like">
            <AiOutlineLike className="text-lg" /> {list.likes}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {`List of ${list.items?.length || 0} ${getCategoryLabel(list.category)} · created ${createdAgo} ago · modified ${updatedAgo} ago`}
      </div>

      <p className="mb-4 text-gray-700 break-words whitespace-normal">{list.description}</p>

      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-4 capitalize">Type: {list.type}</span>
        <span className="mr-4 capitalize">Category: {getCategoryLabel(list.category)}</span>
        <span className="mr-4">Created by: {list.createdBy}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tags:</h3>
        {list.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {list.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No tags</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items:</h3>
        {list.items?.length > 0 ? (
          <ul className="space-y-2">
            {list.items.map((item, idx) => {
              const book = bookMap[item.id];
              return (
                <li key={idx} className="p-2 border rounded bg-gray-50 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <strong className="bg-primary rounded-full p-2">{item.rank}.</strong>
                    {book ? (
                      <BookCard book={book} haveDescription={false} />
                    ) : (
                      <div className="italic text-gray-500">Loading book info...</div>
                    )}
                  </div>
                  {item.explanation && <div className="italic text-sm pl-12">{item.explanation}</div>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No items</p>
        )}
      </div>

      <div className="mt-6 bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Public Comments</h2>
        {isCommentsLoading ? (
          <div>Loading comments...</div>
        ) : isCommentsError ? (
          <div>Error loading comments.</div>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment._id} className="border-b pb-2">
                <span className="font-semibold">{comment.userDisplayName || comment.userId}</span>
                {" — "}
                <span>{comment.comment}</span>
                {" "}
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                {currentUser?.uid === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="ml-4 text-red-500 text-xs"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
            {comments.length === 0 && <li>No comments yet.</li>}
          </ul>
        )}
        {currentUser ? (
          <div>
            <textarea
              className="border rounded w-full p-2"
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment..."
            />
            {commentError && <div className="text-red-500 text-xs">{commentError}</div>}
            <button
              className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
              onClick={handleAddComment}
            >
              Post Comment
            </button>
          </div>
        ) : (
          <div className="text-gray-500 text-xs mt-2">Login to leave a comment.</div>
        )}
      </div>
    </div>
  );
};

export default SingleListViewer;
