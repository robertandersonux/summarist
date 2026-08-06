"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "../../types/book";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="search--wrapper">
      <div className="search__input--wrapper">
        <input
          type="text"
          placeholder="Search for books"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search__input"
        />
      </div>
      {query.trim() && (
        <div className="search__results">
          {loading && <div className="search__result--item">Searching...</div>}
          {!loading && results.length === 0 && (
            <div className="search__result--item">No results found</div>
          )}
          {!loading &&
            results.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="search__result--item"
                onClick={() => setQuery("")}
              >
                <img src={book.imageLink} alt={book.title} className="search__result--img" />
                <div>
                  <div className="search__result--title">{book.title}</div>
                  <div className="search__result--author">{book.author}</div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}