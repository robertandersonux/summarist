"use client";
 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { openModal } from "../../../lib/features/authModalSlice";
import { Book } from "../../../types/book";
 
export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
 
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);
 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);
 
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBook();
  }, [id]);
 
  // Check whether this book is already in the user's library
  useEffect(() => {
    async function checkSaved() {
      if (!user || !id) {
        setIsSaved(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid, "library", String(id));
        const snap = await getDoc(ref);
        setIsSaved(snap.exists());
      } catch (err) {
        console.error("Failed to check library status", err);
      }
    }
    checkSaved();
  }, [user, id]);
 
  const handleAction = () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }
    if (book?.subscriptionRequired) {
      router.push("/choose-plan");
    } else {
      router.push(`/player/${id}`);
    }
  };
 
  const handleAddToLibrary = async () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }
    if (!book || savePending) return;
 
    setSavePending(true);
    const ref = doc(db, "users", user.uid, "library", String(id));
 
    try {
      if (isSaved) {
        await deleteDoc(ref);
        setIsSaved(false);
      } else {
        await setDoc(ref, {
          id: String(id),
          title: book.title ?? "",
          author: book.author ?? "",
          subTitle: book.subTitle ?? "",
          imageLink: book.imageLink ?? "",
          averageRating: book.averageRating ?? null,
          subscriptionRequired: book.subscriptionRequired ?? false,
          savedAt: serverTimestamp(),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to update library", err);
      alert("Something went wrong saving this book. Please try again.");
    } finally {
      setSavePending(false);
    }
  };
 
  if (loading) {
    return (
      <div className="book">
        <div className="book__header--wrapper">
          <div className="book__header--content">
            <div className="skeleton skeleton--text" style={{ width: "70%", height: 28, marginBottom: 12 }} />
            <div className="skeleton skeleton--text" style={{ width: "40%", height: 16 }} />
            <div className="skeleton skeleton--text" style={{ width: "50%", height: 16, marginBottom: 20 }} />
            <div className="skeleton skeleton--text" style={{ width: 300, height: 44, marginBottom: 20 }} />
          </div>
          <div className="skeleton" style={{ width: 220, height: 280, borderRadius: 4 }} />
        </div>
      </div>
    );
  }
 
  if (!book) {
    return <div className="book__loading">Book not found.</div>;
  }
 
  const minutes = Math.floor((book.totalRating || 0) / 60);
 
  return (
    <div className="book">
      <div className="book__header--wrapper">
        <div className="book__header--content">
          <div className="book__title">
            {book.title}
            {book.subscriptionRequired && " (Premium)"}
          </div>
          <div className="book__author">{book.author}</div>
          <div className="book__subtitle">{book.subTitle}</div>
          <div className="book__meta--wrapper">
            <div className="book__meta--item">
              &#9733; {book.averageRating} ({book.totalRating} ratings)
            </div>
            <div className="book__meta--item">
              &#128337; {minutes}:{String((book.totalRating || 0) % 60).padStart(2, "0")}
            </div>
            <div className="book__meta--item">{book.type}</div>
            <div className="book__meta--item">{book.keyIdeas} Key ideas</div>
          </div>
          <div className="book__btn--wrapper">
            <button className="btn book__cta--btn" onClick={handleAction}>
              Read
            </button>
            <button className="btn book__cta--btn" onClick={handleAction}>
              Listen
            </button>
          </div>
          <div className="book__library--btn" onClick={handleAddToLibrary}>
            {savePending
              ? "Saving..."
              : isSaved
              ? "Remove from My Library"
              : "Add title to My Library"}
          </div>
          <div className="book__tags--wrapper">
            {book.tags?.map((tag) => (
              <div key={tag} className="book__tag">
                {tag}
              </div>
            ))}
          </div>
          <div className="book__description--title">What&apos;s it about?</div>
          <div className="book__description">{book.bookDescription}</div>
          <div className="book__description--title">About the author</div>
          <div className="book__description">{book.authorDescription}</div>
        </div>
        <img src={book.imageLink} alt={book.title} className="book__img" />
      </div>
    </div>
  );
}