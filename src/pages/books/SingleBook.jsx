import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import SingleImageDisplay from '../../components/SingleImageDisplay';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useFetchUserInteractionsQuery, useSaveUserInteractionMutation } from '../../redux/features/userInteractions/userInteractionsApi';
import { FaStar } from 'react-icons/fa';

const SingleBook = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  // Fetch book and user interaction data
  const { data: book, isLoading: isBookLoading, isError: isBookError } = useFetchBookByIdQuery(id);
  const {
    data: userInteraction,
    isLoading: isInteractionLoading,
    isError: isInteractionError,
    refetch
  } = useFetchUserInteractionsQuery(
    { userId: currentUser?.uid, bookId: id },
    { skip: !currentUser }
  );

  const [saveUserInteraction, { isLoading: isSaving }] = useSaveUserInteractionMutation();

  // Use a state for managing potential errors
  const [error, setError] = useState('');
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // Local State for UI that will be persisted
  const [userRating, setUserRating] = useState(0);
  const [userStatus, setUserStatus] = useState('');
  const [userNote, setUserNote] = useState('');

  // Effect to initialize the local state from the fetched data
  useEffect(() => {
    if (userInteraction) {
      setUserRating(userInteraction.rating || 0);
      setUserStatus(userInteraction.status || '');
      setUserNote(userInteraction.note || '');
    }
  }, [userInteraction]);

  // Helper function for saving interactions
const saveInteraction = async (interactionData) => {
  const previousState = {
    rating: userRating,
    status: userStatus,
    note: userNote
  };

  // Optimistically update the local state
  if (interactionData.rating !== undefined) setUserRating(interactionData.rating);
  if (interactionData.status !== undefined) setUserStatus(interactionData.status);
  if (interactionData.note !== undefined) setUserNote(interactionData.note);

  // Add the missing required fields to the payload
  const payload = {
    ...interactionData,
    userId: currentUser.uid,
    bookId: id,
  };

  // Determine the interactionType based on which value is being updated
  if (interactionData.rating !== undefined) {
    payload.interactionType = 'rating';
  } else if (interactionData.status !== undefined) {
    payload.interactionType = 'status';
  } else if (interactionData.note !== undefined) {
    payload.interactionType = 'note';
  }

  try {
    await saveUserInteraction(payload).unwrap();
    setError('');
    // Refetch the user interactions to ensure the UI is up-to-date
    refetch();
  } catch (err) {
    console.error('Error saving interaction:', err);
    setError('Failed to save interaction. Please try again.');
    // Revert the local state if the API call fails
    setUserRating(previousState.rating);
    setUserStatus(previousState.status);
    setUserNote(previousState.note);
  }
};

  // Event Handlers
  const handleStarClick = async (ratingValue) => {
    if (!currentUser) {
      setError('You need to be logged in to rate this book.');
      return;
    }
    await saveInteraction({ rating: ratingValue });
  };

  const handleStatusToggle = async (status) => {
    if (!currentUser) {
      setError('You need to be logged in to change your reading status.');
      return;
    }
    await saveInteraction({ status: status });
  };

  const handleNoteChange = (event) => {
    if (!currentUser) {
      setError('You need to be logged in to add or modify notes.');
      return;
    }
    setUserNote(event.target.value);
  };

  const saveNote = async () => {
    if (!currentUser) {
      setError('You need to be logged in to save notes.');
      return;
    }
    await saveInteraction({ note: userNote });
  };

  if (isBookLoading || (currentUser && isInteractionLoading)) return <div>Loading...</div>;
  if (isBookError) return <div>Error happened while loading book info</div>;
  if (currentUser && isInteractionError) return <div>Error happened while loading user interactions</div>;
  if (!book) return <div>Book not found.</div>;

  const MAX_LENGTH = 500;
  const isLongSynopsis = book?.description?.length > MAX_LENGTH;
  const displayedSynopsis = !showFullSynopsis && isLongSynopsis
    ? book.description.slice(0, MAX_LENGTH) + "..."
    : book.description;

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <button onClick={() => refetch()}>Refetch Data</button>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="flex flex-col items-center text-sm">
          <div className="rounded-xl shadow-md p-2 w-full bg-orange-200">
            <p className="text-xs text-gray-800">{book.meta?.status || "N/A"}</p>
            <h1 className="text-lg font-bold text-gray-900 break-words">{book.title}</h1>
            <p className="mt-1 text-gray-600 text-sm">{book?.authors?.join(', ') || "Unknown"}</p>
          </div>
          <div className="p-2 w-full flex justify-center items-center h-full">
            <SingleImageDisplay
              className="rounded-lg w-full max-w-[200px] sm:max-w-[300px] h-auto sm:h-full object-cover shadow-md"
              pictureUrl={book.picture_url}
            />
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
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={starValue}
                    className={`cursor-pointer ${userRating >= starValue ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => handleStarClick(starValue)}
                  />
                );
              })}
            </div>
          </div>
        )}
        {currentUser && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Notes</h2>
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
    </div>
  );
};

export default SingleBook;
