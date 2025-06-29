import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import SingleImageDisplay from '../../components/SingleImageDisplay';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useFetchUserInteractionsQuery, useSaveUserInteractionMutation } from '../../redux/features/userInteractions/userInteractionsApi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

const SingleBook = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const { data: userInteraction } = useFetchUserInteractionsQuery({ userId: currentUser?.uid, bookId: id });
  const [saveUserInteraction] = useSaveUserInteractionMutation();

  const [userRating, setUserRating] = useState(0);
  const [userStatus, setUserStatus] = useState('');
  const [userNote, setUserNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInteraction) {
      setUserRating(userInteraction.rating || 0);
      setUserStatus(userInteraction.status || '');
      setUserNote(userInteraction.note || '');
    }
  }, [userInteraction]);

  const saveInteraction = async (interactionData) => {
    try {
      await saveUserInteraction(interactionData).unwrap();
    } catch (error) {
      console.error('Error saving interaction:', error);
      setError('Failed to save interaction. Please try again.');
    }
  };

  const handleStarClick = async (ratingValue) => {
    if (!currentUser) {
      alert('You need to be logged in to rate this book.');
      return;
    }

    setUserRating(ratingValue);
    await saveInteraction({
      userId: currentUser.uid,
      bookId: id,
      rating: ratingValue,
      status: userStatus,
      note: userNote,
    });
  };

  const handleStatusToggle = async (status) => {
    if (!currentUser) {
      alert('You need to be logged in to change your reading status.');
      return;
    }

    setUserStatus(status);

    await saveInteraction({
      userId: currentUser.uid,
      bookId: id,
      rating: userRating,
      status: status,
      note: userNote,
    });
  };

  const handleNoteChange = (event) => {
    if (!currentUser) {
      alert('You need to be logged in to add or modify notes.');
      return;
    }

    setUserNote(event.target.value);
  };

  const saveNote = async () => {
    if (!currentUser) {
      alert('You need to be logged in to save notes.');
      return;
    }

    await saveInteraction({
      userId: currentUser.uid,
      bookId: id,
      rating: userRating,
      status: userStatus,
      note: userNote,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-yellow-500" />);
    }

    return stars;
  };

  const convertStarRatingToGrade = (starRating) => {
    return starRating * 2;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happened while loading book info</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6 flex justify-center items-center">
            <SingleImageDisplay
              className="rounded-lg w-full max-w-md h-auto shadow-md"
              pictureUrl={book.picture_url}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Book</div>
            <h1 className="block mt-1 text-3xl leading-tight font-bold text-gray-900">{book.title}</h1>
            <div className="mt-2 text-gray-600">
              <p className="mt-2">
                <span className="font-semibold text-gray-900">Author:</span> {book?.authors?.join(', ') || "Unknown"}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gray-900">Published:</span> {book.meta?.publication_period || "N/A"}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gray-900">Status:</span> {book.meta?.status || "N/A"}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gray-900">Genres:</span> {(book.genres ?? []).join(', ')}
              </p>
            </div>
            <p className="mt-4 text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Description:</span> {book?.description}
            </p>
            <div className="mt-6 flex items-center">
              <span className="font-semibold text-gray-900 mr-4">Rating: {book.stats?.average_rating || 0} ({convertStarRatingToGrade(book.stats?.average_rating || 0)})</span>
              <div className="flex">
                {renderStars(book.stats?.average_rating || 0)}
              </div>
            </div>
            <div className="mt-4">
              <span className="font-semibold text-gray-900">Rate this book:</span>
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
            <div className="mt-4">
              <span className="font-semibold text-gray-900">Your Notes:</span>
              <textarea
                className="mt-2 w-full p-2 border rounded"
                value={userNote}
                onChange={handleNoteChange}
                placeholder="Write your notes here..."
                disabled={!currentUser}
              />
              {currentUser && (
                <button
                  onClick={saveNote}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Note
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Your Reading Status</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
            {['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusToggle(status)}
                className={`px-4 py-2 rounded-lg ${userStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                disabled={!currentUser}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="px-8 py-6 bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{book.stats?.total_views || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Favorite Count</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{book.stats?.favorite_count || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Comments Count</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{book.stats?.comments_count || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reviews Count</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{book.stats?.review_count || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
