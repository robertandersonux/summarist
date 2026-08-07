"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Book } from "../../types/book";

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
        ]);
       const selectedData = await selectedRes.json();
setSelected(Array.isArray(selectedData) ? selectedData[0] : selectedData);
        setRecommended(await recommendedRes.json());
        setSuggested(await suggestedRes.json());
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="for-you">
        <div className="for-you__selected--wrapper">
          <div className="skeleton skeleton--text skeleton--text-sm" style={{ width: 200, height: 20 }} />
          <div className="skeleton skeleton--selected" />
        </div>
        <div className="for-you__recommended--wrapper">
          <div className="skeleton skeleton--text skeleton--text-sm" style={{ width: 220, height: 22 }} />
          <div className="recommended__book--wrapper">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton--book-card">
                <div className="skeleton skeleton--book-img" />
                <div className="skeleton skeleton--text" />
                <div className="skeleton skeleton--text skeleton--text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="for-you">
      {selected && (
        <div className="for-you__selected--wrapper">
          <div className="for-you__title">Selected just for you</div>
          <Link href={`/book/${selected.id}`} className="selected__book--wrapper">
            <div className="selected__book--subtitle">{selected.subTitle}</div>
            <img
              src={selected.imageLink}
              alt={selected.title}
              className="selected__book--img"
            />
            <div className="selected__book--details">
              <div className="selected__book--title">{selected.title}</div>
              <div className="selected__book--author">{selected.author}</div>
            </div>
          </Link>
        </div>
      )}

      <div className="for-you__recommended--wrapper">
        <div className="for-you__title">Recommended For You</div>
        <div className="for-you__sub--title">We think you&apos;ll like these</div>
        <div className="recommended__book--wrapper">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      <div className="for-you__suggested--wrapper">
        <div className="for-you__title">Suggested Books</div>
        <div className="for-you__sub--title">Browse those books</div>
        <div className="suggested__book--wrapper">
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} className="book--wrapper">
      <div className="book__img--wrapper">
        <img src={book.imageLink} alt={book.title} className="book__img" />
        {book.subscriptionRequired && (
          <div className="book__pill--wrapper">
            <div className="book__pill">Premium</div>
          </div>
        )}
      </div>
      <div className="book__title">{book.title}</div>
      <div className="book__author">{book.author}</div>
      <div className="book__subtitle">{book.subTitle}</div>
      <div className="book__details--wrapper">
        {book.averageRating != null && (
          <div className="book__rating--wrapper">
            <span className="book__rating--number">{book.averageRating}</span>
          </div>
        )}
      </div>
    </Link>
  );
}