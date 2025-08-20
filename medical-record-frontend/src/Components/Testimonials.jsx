import React, { useEffect, useMemo, useState } from "react";
import "./Testimonials.css";

/**
 * Fully styled testimonials section:
 * - Subtitle + Title ("READ TESTIMONIALS" / "Our Patient Says")
 * - 3 cards on desktop, 2 on tablets, 1 on mobile
 * - Circular avatar with quote badge
 * - Auto-rotates through all testimonials every 5s (no external libs)
 * - Blue gradient + soft image overlay in the background
 */

const TESTIMONIALS = [
  {
    name: "Jeff Freshman",
    role: "PATIENTS",
    text:
      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
  },
  {
    name: "Nimesha P.",
    role: "PATIENTS",
    text:
      "MediTrack helped me keep my entire health history organized for my doctor visits. It’s a life saver!",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop"
  },
  {
    name: "Akila S.",
    role: "PATIENTS",
    text:
      "I love how easy it is to upload my reports and find them later. Highly recommend MediTrack!",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop"
  },
  {
    name: "Ruwini D.",
    role: "PATIENTS",
    text:
      "Clean UI, everything is exactly where I expect it. Sharing with my doctor was seamless.",
    avatar:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=256&auto=format&fit=crop"
  },
  {
    name: "Sajith K.",
    role: "PATIENTS",
    text:
      "The reminders for checkups and meds are super helpful. I finally stopped missing follow-ups.",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&auto=format&fit=crop"
  },
  {
    name: "Ishara T.",
    role: "PATIENTS",
    text:
      "Secure document storage gives me peace of mind. Works great on mobile too.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&auto=format&fit=crop"
  }
];

// helper to get a circular window of N items starting at index
function getWindow(arr, start, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(arr[(start + i) % arr.length]);
  }
  return out;
}

export default function TestimonialsSection() {
  // how many cards we want based on viewport (1 / 2 / 3)
  const [cardsPerView, setCardsPerView] = useState(3);
  const [startIndex, setStartIndex] = useState(0);

  // responsive card count
  useEffect(() => {
    const fn = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerView(1);
      else if (w < 992) setCardsPerView(2);
      else setCardsPerView(3);
    };
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setStartIndex((i) => (i + cardsPerView) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [cardsPerView]);

  const visible = useMemo(
    () => getWindow(TESTIMONIALS, startIndex, cardsPerView),
    [startIndex, cardsPerView]
  );

  return (
    <section
      className="testimonials-section"
      // optional: override background image per-page if you want
      style={{
        // change this to any image you like (or remove to keep just gradient)
        // it will be softly blurred/overlayed by CSS
        ["--bg-url"]: `url('https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1600&q=60')`
      }}
    >
      <div className="tsn-inner">
        <p className="tsn-subtitle">READ TESTIMONIALS</p>
        <h2 className="tsn-title">What Our Users Says</h2>

        <div className="tsn-grid" aria-live="polite">
          {visible.map((t, idx) => (
            <article key={`${t.name}-${idx}`} className="tsn-card">
              <div className="tsn-avatar-wrap">
                <img className="tsn-avatar" src={t.avatar} alt={t.name} />
                <span className="tsn-quote">
                  {/* quote icon (inline SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 7h4v4H8v3H5v-4a3 3 0 0 1 3-3zm10 0h4v4h-3v3h-3v-4a3 3 0 0 1 3-3z" />
                  </svg>
                </span>
              </div>

              <p className="tsn-text">{t.text}</p>
              <h5 className="tsn-name">{t.name}</h5>
              <span className="tsn-role">{t.role}</span>
            </article>
          ))}
        </div>

        {/* controls (optional). You can hide if not needed */}
        <div className="tsn-controls">
          <button
            type="button"
            className="tsn-nav"
            onClick={() =>
              setStartIndex(
                (i) =>
                  (i - cardsPerView + TESTIMONIALS.length) %
                  TESTIMONIALS.length
              )
            }
            aria-label="Previous testimonials"
          >
            ‹
          </button>
          <button
            type="button"
            className="tsn-nav"
            onClick={() =>
              setStartIndex((i) => (i + cardsPerView) % TESTIMONIALS.length)
            }
            aria-label="Next testimonials"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
