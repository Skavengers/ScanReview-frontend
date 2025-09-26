import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import SingleImageDisplay from '../../components/SingleImageDisplay';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useFetchUserInteractionsQuery, useSaveUserInteractionMutation } from '../../redux/features/userInteractions/userInteractionsApi';
import { FaStar } from 'react-icons/fa';
import TiltedCard from './TiltedCard';
import {
  useFetchCommentsByBookQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from '../../redux/features/comments/commentsApi';

const SingleBook = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const { data: book, isLoading: isBookLoading, isError: isBookError } = useFetchBookByIdQuery(id);
  // Fetch user interaction for this book and user as a single document
  const { data: userInteraction = [], isLoading: isLoadingInteraction, isError: isErrorInteraction, refetch } =
    useFetchUserInteractionsQuery({ userId: currentUser?.uid, bookId: id }, { skip: !currentUser });

  const [saveUserInteraction, { isLoading: isSaving }] = useSaveUserInteractionMutation();

  // Local state for user interaction fields
  const [userRating, setUserRating] = useState(0);
  const [userStatus, setUserStatus] = useState('');
  const [userNote, setUserNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchComments,
  } = useFetchCommentsByBookQuery(id);

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  // Synchronize local state from fetched user interaction
  useEffect(() => {
    if (userInteraction.length > 0) {
      const interaction = userInteraction[0];
      setUserRating(interaction.rating || 0);
      setUserStatus(interaction.status || '');
      setUserNote(interaction.note || '');
      setIsFavorite(interaction.favorite || false);
    } else {
      setUserRating(0);
      setUserStatus('');
      setUserNote('');
      setIsFavorite(false);
    }
  }, [userInteraction]);
  
  // Unified save handler for interaction fields including favorite
  const saveInteraction = async (fieldsToUpdate) => {
    if (!currentUser) {
      setError('You need to be logged in to perform this action.');
      return;
    }
    const previousState = {
      rating: userRating,
      status: userStatus,
      note: userNote,
      favorite: isFavorite,
    };

    // Optimistic UI update
    if (fieldsToUpdate.rating !== undefined) setUserRating(fieldsToUpdate.rating);
    if (fieldsToUpdate.status !== undefined) setUserStatus(fieldsToUpdate.status);
    if (fieldsToUpdate.note !== undefined) setUserNote(fieldsToUpdate.note);
    if (fieldsToUpdate.favorite !== undefined) setIsFavorite(fieldsToUpdate.favorite);

    // Prepare payload
    const payload = {
      ...fieldsToUpdate,
      userId: currentUser.uid,
      bookId: id,
      interactionType: 'general'
    };

    try {
      await saveUserInteraction(payload).unwrap();
      setError('');
      refetch();
    } catch (err) {
      setError('Failed to save interaction. Please try again.');
      setUserRating(previousState.rating);
      setUserStatus(previousState.status);
      setUserNote(previousState.note);
      setIsFavorite(previousState.favorite);
    }
  };

  // Event handlers for each field call the unified saveInteraction method
  const handleStarClick = async (ratingValue) => {
    await saveInteraction({ rating: ratingValue });
  };

  const handleStatusToggle = async (status) => {
    await saveInteraction({ status });
  };

  const handleNoteChange = (e) => {
    setUserNote(e.target.value);
  };

  const saveNote = async () => {
    await saveInteraction({ note: userNote });
  };

  const toggleFavoriteHandler = async () => {
    await saveInteraction({ favorite: !isFavorite });
  };

  const handleAddComment = async () => {
  if (!currentUser) {
    setCommentError("You must be logged in to comment.");
    return;
  }
  if (!commentInput.trim()) {
    setCommentError("Comment cannot be empty.");
    return;
  }
  try {
    await addComment({
      userId: currentUser.uid,
      bookId: id,
      userDisplayName: currentUser.displayName,
      comment: commentInput.trim(),
      type: "book",
    });
    setCommentInput("");
    setCommentError("");
    refetchComments();
  } catch (err) {
    setCommentError("Failed to post comment.");
  }
};

const handleDeleteComment = async (commentId) => {
  await deleteComment(commentId);
  refetchComments();
};

  if (isBookLoading || (currentUser && isLoadingInteraction)) return <div>Loading...</div>;
  if (isBookError) return <div>Error loading book info.</div>;
  if (currentUser && isErrorInteraction) return <div>Error loading user interactions.</div>;
  if (!book) return <div>Book not found.</div>;

  const MAX_LENGTH = 500;
  const isLongSynopsis = book?.description?.length > MAX_LENGTH;
  const displayedSynopsis = !showFullSynopsis && isLongSynopsis
    ? book.description.slice(0, MAX_LENGTH) + "..."
    : book.description;
  return (
    <div className="min-h-screen bg-gray-100 p-2">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="flex flex-col items-center text-sm">
          <div className="rounded-xl shadow-md p-2 w-full bg-orange-200">
            <h1 className="text-lg font-bold text-gray-900 break-words">{book.title}</h1>
            <p className="mt-1 text-gray-600 text-sm">{book?.authors?.join(', ') || "Unknown"}</p>
          </div>
          <div className="p-2 w-full flex justify-center items-center h-full">
            {window.innerWidth >= 1024 ? (
              <TiltedCard
                imageSrc={book.picture_url}
                altText={book.title}
                captionText={book.title}
                containerHeight="400px"
                containerWidth="300px"
                imageHeight="420px"
                imageWidth="310px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="tilted-card-demo-text">
                    <span className="text-gray-800">{book.meta?.status || "N/A"}</span>
                  </p>
                }
              />
            ) : (
              <div className="relative inline-block">
                <p className="absolute top-0 left-0 text-black text-xs px-1 py-0.5 rounded">
                  {book.meta?.status || "N/A"}
                </p>
                <SingleImageDisplay
                  className="rounded-lg w-full max-w-[200px] sm:max-w-[300px] h-auto sm:h-full object-cover shadow-md"
                  pictureUrl={book.picture_url}
                />
              </div>
            )}
          </div>
          {/* Average Rating and Genres for mobile view */}
          <div className="w-full sm:hidden">
            <div className="bg-white rounded-xl shadow-md border-primary border-4 p-2 flex flex-col items-center justify-center text-center mt-2">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Average Rating</h2>
              <span className="font-semibold text-lg">
                {book.stats?.average_rating || 0}
              </span>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2 mt-2">
              <h2 className="text-base font-semibold text-gray-900">Genres</h2>
              <p className="mt-1 text-gray-700 text-xs">{(book.genres ?? []).join(', ') || "N/A"}</p>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="bg-white rounded-xl shadow-md p-2">
            <h2 className="text-base font-semibold text-gray-900">Synopsis</h2>
            <p className="mt-1 text-gray-700 whitespace-pre-line text-xs">{displayedSynopsis}</p>
            {isLongSynopsis && (
              <button
                className="mt-1 text-indigo-600 hover:underline text-xs"
                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
              >
                {showFullSynopsis ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
          {/* Average Rating and Genres for desktop view */}
          <div className="hidden sm:block">
            <div className="bg-white rounded-xl shadow-md border-primary border-4 p-2 flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Average Rating</h2>
              <span className="font-semibold text-lg">
                {book.stats?.average_rating || 0}
              </span>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2">
              <h2 className="text-base font-semibold text-gray-900">Genres</h2>
              <p className="mt-1 text-gray-700 text-xs">{(book.genres ?? []).join(', ') || "N/A"}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 w-full max-h-72 sm:max-h-96 overflow-y-auto text-xs sm:text-sm text-gray-600">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4 md:mb-10">Additional Information</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:m-6">
              <div>
                <p className="font-medium">Views</p>
                <p className="text-gray-900">{book.stats?.total_views || 0}</p>
              </div>
              <div>
                <p className="font-medium">Favorites</p>
                <p className="text-gray-900">{book.stats?.favorite_count || 0}</p>
              </div>
              <div>
                <p className="font-medium">Comments</p>
                <p className="text-gray-900">{book.stats?.comments_count || 0}</p>
              </div>
              <div>
                <p className="font-medium">Reviews</p>
                <p className="text-gray-900">{book.stats?.review_count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto mt-4 bg-white rounded-xl shadow-md p-4 space-y-4">
        {currentUser && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Rating</h2>
            <div className="flex mt-2">
              {[...Array(10)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <div key={starValue} className="relative">
                    <FaStar
                      className={`cursor-pointer ${userRating >= starValue ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => handleStarClick(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(null)}
                    />
                    {hoveredRating === starValue && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-1 py-0.5 rounded shadow z-10">
                        {starValue}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {currentUser && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Favorite</h2>
            <button
              onClick={toggleFavoriteHandler}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              disabled={isSaving}
            >
              {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
            </button>
          </div>
        )}
        {currentUser && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Private Notes</h2>
            <textarea
              className="mt-2 w-full p-2 border rounded text-xs"
              value={userNote}
              onChange={handleNoteChange}
              placeholder="Write your notes here..."
            />
            <button
              onClick={saveNote}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Reading Status</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusToggle(status)}
                className={`px-3 py-1 rounded-lg text-xs ${userStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                disabled={!currentUser || isSaving}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Public Comments</h2>
        {isLoadingComments ? (
          <div>Loading comments...</div>
        ) : isErrorComments ? (
          <div>Error loading comments.</div>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment._id} className="p-2 border rounded bg-gray-50">
                <span className="font-semibold">{comment.userDisplayName || comment.userId}</span>
                <span className="block text-gray-700">{comment.comment}</span>
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                {currentUser?.uid === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="ml-2 px-2 py-1 text-xs text-red-600"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
            {comments.length === 0 && <div>No comments yet.</div>}
          </ul>
        )}
        {currentUser && (
          <div className="mt-4 flex flex-col gap-2">
            <textarea
              className="border rounded p-2 w-full"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              rows={2}
              placeholder="Add your comment"
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={handleAddComment}
              disabled={isAddingComment}
            >
              {isAddingComment ? "Posting..." : "Post Comment"}
            </button>
            {commentError && <div className="text-red-500 text-xs">{commentError}</div>}
          </div>
        )}
        {!currentUser && <div className="text-gray-500 text-xs mt-2">Login to leave a comment.</div>}
      </div>
    </div>
  );
};

export default SingleBook;