"use client";
 
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { openModal } from "../../lib/features/authModalSlice";
 
type SavedBook = {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  averageRating: number | null;
  subscriptionRequired: boolean;
};
 
export default function LibraryPage() {
  const dispatch = useDispatch();
 
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);
 
  useEffect(() => {
    async function fetchLibrary() {
      if (!authReady) return;
 
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }
 
      try {
        const ref = collection(db, "users", user.uid, "library");
        const snap = await getDocs(query(ref, orderBy("savedAt", "desc")));
        setBooks(snap.docs.map((d) => d.data() as SavedBook));
      } catch (err) {
        console.error("Failed to load library", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [user, authReady]);
 
  if (loading) {
    return (
      <div className="library">
        <div className="library__title">Saved Books</div>
        <div className="recommended__book--wrapper">
          {[0, 1, 2].map((i) => (
            <div className="skeleton--book-card" key={i}>
              <div className="skeleton skeleton--book-img" />
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--text skeleton--text-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  if (!user) {
    return (
      <div className="library">
        <div className="library__title">Saved Books</div>
        <div className="library__empty">
          Log in to save books and read them anytime.
        </div>
        <button
          className="settings__login--btn"
          style={{ marginTop: 16 }}
          onClick={() => dispatch(openModal("login"))}
        >
          Login
        </button>
      </div>
    );
  }
 
  return (
    <div className="library">
      <div className="library__title">
        Saved Books
        {books.length > 0 && ` (${books.length})`}
      </div>
 
      {books.length === 0 ? (
        <div className="library__empty">
          Save your favorite books and read them anytime.
        </div>
      ) : (
        <div className="recommended__book--wrapper">
          {books.map((book) => (
            <Link
              href={`/book/${book.id}`}
              className="book--wrapper"
              key={book.id}
            >
              <div className="book__img--wrapper">
                <img
                  className="book__img"
                  src={book.imageLink}
                  alt={book.title}
                />
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
                &#9733; {book.averageRating ?? "—"}
              </div>
            </Link>
          ))}
        </div>
      )}
 
      <div className="library__title" style={{ marginTop: 40 }}>
        Finished Books
      </div>
      <div className="library__empty">
        Finished books will appear here once you complete listening.
      </div>
    </div>
  );
}