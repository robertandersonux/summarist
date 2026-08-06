"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Book } from "../../../types/book";

export default function PlayerPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) return <div className="player__loading">Loading...</div>;
  if (!book) return <div className="player__loading">Book not found.</div>;

  return (
    <div className="player">
      <div className="player__content">
        <div className="player__title">{book.title}</div>
        <div className="player__summary">{book.summary}</div>
      </div>

      <div className="player__bar">
        <img src={book.imageLink} alt={book.title} className="player__bar--img" />
        <div className="player__bar--details">
          <div className="player__bar--title">{book.title}</div>
          <div className="player__bar--author">{book.author}</div>
        </div>

        <button className="player__bar--btn" onClick={() => skip(-10)}>
          &#8634; 10
        </button>
        <button className="player__bar--btn player__bar--play" onClick={togglePlay}>
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button className="player__bar--btn" onClick={() => skip(10)}>
          10 &#8635;
        </button>

        <div className="player__bar--time">{formatTime(currentTime)}</div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleScrub}
          className="player__bar--scrub"
        />
        <div className="player__bar--time">{formatTime(duration)}</div>

        <audio
          ref={audioRef}
          src={book.audioLink}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}