import React, { useMemo } from 'react';

// Assume logic for fetching interactions and books as previously provided
import { useAuth } from '../../context/AuthContext';
import { useFetchUserInteractionsQuery } from '../../redux/features/userInteractions/userInteractionsApi';
import { useFetchBooksByIdsQuery } from '../../redux/features/books/booksApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { getStatusCounts, getGenreStatusCounts } from '../../utils/userStats';

// Status colors
const STATUS_COLORS = {
  reading: '#2D9CDB',
  completed: '#27AE60',
  on_hold: '#F2994A',
  dropped: '#EB5757',
  plan_to_read: '#FFCE1A',
};

const GENRE_COLORS = [
  "#55E2A6", "#46A7F7", "#9C64E5", "#FC6E7A", "#FFCE1A",
  "#FFB86C", "#6C757D", "#A3FFFD", "#F76AFB"
];

function getGenreColor(index) {
  return GENRE_COLORS[index % GENRE_COLORS.length];
}

const UserStatsBeautiful = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { data: interactions = [], isLoading, isError } = useFetchUserInteractionsQuery({ userId });
  const bookIds = useMemo(() => Array.from(new Set(interactions.map(i => i.bookId))), [interactions]);
  const { data: books = [], isLoading: booksLoading } = useFetchBooksByIdsQuery(bookIds.length ? bookIds : skipToken);
  const booksMap = useMemo(() => {
    const map = {}; books.forEach(book => { map[book._id] = book; }); return map;
  }, [books]);

  const statusCounts = useMemo(() => getStatusCounts(interactions), [interactions]);
  const genreStatusCounts = useMemo(() => getGenreStatusCounts(interactions, booksMap), [interactions, booksMap]);
  const genreList = Object.entries(genreStatusCounts);

  if (isLoading || booksLoading) return <div>Loading user stats...</div>;
  if (isError) return <div>Error loading stats.</div>;

  return (
    <div style={{
      background: "var(--color-bgcolor)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(44,44,63,0.07)",
      padding: "2rem",
      margin: "2rem 0",
    }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "2rem" }}>
        Your Book Stats
      </h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            style={{
              background: STATUS_COLORS[status],
              color: "#fff",
              fontWeight: 600,
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(44,44,63,0.1)",
              minWidth: 130,
              padding: "1rem 1.2rem",
              textAlign: "center",
              fontSize: "1.15rem"
            }}>
            <div style={{ fontSize: "1.1em", marginBottom: ".3em", textTransform: "capitalize" }}>
              {status.replace(/_/g, ' ')}
            </div>
            <div style={{ fontSize: "2em", letterSpacing: -.5 }}>{count}</div>
          </div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 500, marginBottom: ".7rem" }}>Genres Breakdown</h3>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {genreList.map(([genre, counts], idx) => (
            <div key={genre} style={{
              background: getGenreColor(idx),
              color: "#212529",
              borderRadius: "9px",
              padding: ".9rem 1.3rem",
              boxShadow: "0 2px 8px rgba(44,44,63,0.09)",
              minWidth: 120,
              flex: "1 0 140px"
            }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: ".4em" }}>
                {genre}
              </div>
              <div style={{ fontSize: ".93em", marginBottom: ".6em" }}>
                Reading: <span style={{ fontWeight: 500 }}>{counts.reading}</span> | Completed: <span style={{ fontWeight: 500 }}>{counts.completed}</span>
              </div>
              <div style={{ fontSize: ".85em", opacity: .74 }}>
                On Hold: {counts.on_hold} | Dropped: {counts.dropped} | Plan: {counts.plan_to_read}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStatsBeautiful;
