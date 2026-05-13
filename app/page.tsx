// app/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const targetDate = new Date("2026-06-20T17:00:00").getTime();

  const getTimeLeft = () => {
    const difference = targetDate - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "2rem" }}>
        Countdown
      </h1>

      {timeLeft ? (
        <div
          style={{
            display: "flex",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "3rem" }}>{timeLeft.days}</h2>
            <p>Days</p>
          </div>

          <div>
            <h2 style={{ fontSize: "3rem" }}>{timeLeft.hours}</h2>
            <p>Hours</p>
          </div>

          <div>
            <h2 style={{ fontSize: "3rem" }}>{timeLeft.minutes}</h2>
            <p>Minutes</p>
          </div>

          <div>
            <h2 style={{ fontSize: "3rem" }}>{timeLeft.seconds}</h2>
            <p>Seconds</p>
          </div>
        </div>
      ) : (
        <h2>🎉 Time’s up!</h2>
      )}
    </main>
  );
}