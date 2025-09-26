// utils/userStats.js

export function getStatusCounts(interactions) {
  const statusList = ['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'];
  const counts = {};
  statusList.forEach(status => {
    counts[status] = interactions.filter(i => i.status === status).length;
  });
  return counts;
}

export function getGenreStatusCounts(interactions, booksMap) {
  const genreStatus = {};
  interactions.forEach(inter => {
    const status = inter.status;
    const book = booksMap[inter.bookId];
    if (!book || !book.genres) return;
    book.genres.forEach(genre => {
      if (!genreStatus[genre]) genreStatus[genre] = { reading: 0, completed: 0, on_hold: 0, dropped: 0, plan_to_read: 0 };
      if (status) genreStatus[genre][status] += 1;
    });
  });
  return genreStatus;
}
