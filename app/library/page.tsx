"use client";

export default function LibraryPage() {
  return (
    <div className="library">
      <div className="library__title">Saved Books</div>
      <div className="library__empty">
        Save your favorite books and read them anytime.
      </div>
      <div className="library__title" style={{ marginTop: 40 }}>
        Finished Books
      </div>
      <div className="library__empty">
        Finished books will appear here once you complete listening.
      </div>
    </div>
  );
}