import { useEffect, useRef, useState } from "react";

const V = {
  v1: "#6D28D9",
  v2: "#8B5CF6",
  v3: "#A78BFA",
  v4: "#EDE9FE",
  v5: "#F5F3FF",
  txt: "#1E1B2E",
  muted: "#6B7280",
  border: "#DDD6FE",
};

function useFadeUp(delay = 0, threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [
    ref,
    {
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(48px)",
      transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    },
  ];
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        background: `linear-gradient(90deg, ${V.v1}, ${V.v3})`,
        width: `${progress}%`,
        zIndex: 999,
        transition: "width 0.1s ease-out",
      }}
    />
  );
}

function Typewriter({ words, speed = 80, delay = 1500 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (index === words.length - 1 && subIndex === words[index].length && !reverse) return;
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed]);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {words[index].substring(0, subIndex)}
      <span style={{ opacity: blink ? 1 : 0 }}>|</span>
    </span>
  );
}

function Avatar({ size = 260 }) {
  const imageModules = import.meta.glob('./assets/*.{png,jpg,jpeg,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
  });

  const imagePath = Object.keys(imageModules).find(path =>
    path.includes('profile')
  );
  const src = imagePath ? imageModules[imagePath] : null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        padding: 5,
        background: `conic-gradient(from 0deg, ${V.v1}, ${V.v3}, ${V.v1})`,
        boxShadow: `0 0 60px rgba(109,40,217,0.20)`,
        margin: "0 auto",
        // Plus aucune animation
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          <img
            src={src}
            alt="Imen Farhat"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Plus aucune animation (ni float, ni rien)
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${V.v4}, ${V.v5})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontSize: size * 0.2,
              fontWeight: 800,
              color: V.v1,
            }}
          >
            IF
          </div>
        )}
      </div>
    </div>
  );
}

function SkillCard({ cat, items, delay, icon }) {
  const [ref, style] = useFadeUp(delay);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...style,
        background: "#fff",
        border: `1px solid ${hov ? V.v2 : V.border}`,
        borderRadius: 20,
        padding: "1.5rem 1.2rem",
        boxShadow: hov ? "0 12px 32px rgba(109,40,217,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
        transform: `${style.transform}${hov ? " translateY(-4px)" : ""}`,
        transition: `${style.transition}, border-color 0.2s, box-shadow 0.3s, transform 0.2s`,
        cursor: "default",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: V.v2,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "0.5rem",
        }}
      >
        {cat}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          color: V.txt,
          lineHeight: 1.8,
          fontWeight: 500,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.2rem 0.5rem",
        }}
      >
        {items.map((i, idx) => (
          <span key={idx}>
            {i}
            {idx < items.length - 1 && <span style={{ color: V.border, marginLeft: "0.5rem" }}>·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjCard({ proj, delay, big }) {
  const [ref, style] = useFadeUp(delay);
  const [hov, setHov] = useState(false);
  return (
    <a
      ref={ref}
      href={proj.link}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...style,
        display: "block",
        textDecoration: "none",
        gridColumn: big ? "1 / -1" : undefined,
        border: `1px solid ${hov ? V.v2 : big ? V.v2 : V.border}`,
        borderRadius: 24,
        padding: big ? "2.5rem 2.8rem" : "1.8rem",
        background: big ? `linear-gradient(135deg, ${V.v5}, ${V.v4})` : "#fff",
        boxShadow: hov
          ? "0 16px 48px rgba(109,40,217,0.10)"
          : "0 2px 8px rgba(0,0,0,0.02)",
        transform: `${style.transform}${hov ? " translateY(-6px)" : ""}`,
        transition: `${style.transition}, border-color 0.2s, box-shadow 0.3s, transform 0.25s`,
        ...(big && {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "center",
        }),
      }}
    >
      <div>
        {proj.label && (
          <div
            style={{
              display: "inline-block",
              fontSize: "0.6rem",
              fontWeight: 700,
              color: V.v1,
              background: V.v4,
              border: `1px solid ${V.border}`,
              borderRadius: 30,
              padding: "0.2rem 0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.7rem",
            }}
          >
            {proj.label}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: big ? "1.6rem" : "1.2rem",
            fontWeight: 800,
            color: V.txt,
            marginBottom: "0.4rem",
            lineHeight: 1.2,
          }}
        >
          {proj.name}
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: V.muted,
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}
        >
          {proj.desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {proj.stack.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "0.6rem",
                background: V.v4,
                color: V.v1,
                borderRadius: 30,
                padding: "0.2rem 0.7rem",
                fontWeight: 600,
                border: `1px solid ${V.border}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      {big && (
        <div
          style={{
            background: `linear-gradient(135deg, ${V.v1}, ${V.v3})`,
            borderRadius: 18,
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4.5rem",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(109,40,217,0.25)",
          }}
        >
          📱
        </div>
      )}
    </a>
  );
}

function TlItem({ item, delay }) {
  const [ref, style] = useFadeUp(delay);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        position: "relative",
        paddingBottom: "3rem",
        paddingLeft: "1.8rem",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          position: "absolute",
          left: "-1.2rem",
          top: 6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: hov ? V.v1 : "#fff",
          border: `3px solid ${hov ? V.v1 : V.v2}`,
          boxShadow: hov ? `0 0 0 8px rgba(109,40,217,0.10)` : "none",
          transition: "all 0.2s",
        }}
      />
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: V.v2,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "0.2rem",
        }}
      >
        {item.date}
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.1rem",
          fontWeight: 800,
          color: V.txt,
          marginBottom: "0.1rem",
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          color: V.v1,
          fontWeight: 600,
          marginBottom: "0.5rem",
        }}
      >
        {item.company} · {item.location}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {item.bullets.map((b, i) => (
          <li
            key={i}
            style={{
              fontSize: "0.8rem",
              color: V.muted,
              paddingLeft: "1.2rem",
              position: "relative",
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                color: V.v3,
                fontWeight: 700,
              }}
            >
              ›
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHead({ eyebrow, title, delay = 0 }) {
  const [ref, style] = useFadeUp(delay);
  return (
    <div ref={ref} style={{ ...style, marginBottom: "3.5rem" }}>
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: V.v2,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: "0.4rem",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2.4rem",
          fontWeight: 800,
          color: V.txt,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </div>
    </div>
  );
}

// Données mises à jour selon le CV
const skills = [
  { cat: "Mobile", items: ["Flutter (MVVM)", "Dart", "Firebase FCM", "Android SDK"], icon: "📱" },
  { cat: "AI / ML", items: ["LightGBM", "Feature Engineering", "Time Series Forecasting", "Scikit-learn"], icon: "🧠" },
  { cat: "Backend & APIs", items: ["Django REST", "FastAPI", "Node.js", "Express.js"], icon: "⚙️" },
  { cat: "Frontend", items: ["React", "HTML", "CSS", "JavaScript"], icon: "🎨" },
  { cat: "Databases & DevOps", items: ["PostgreSQL", "Supabase", "MongoDB", "Docker", "Git"], icon: "📊" },
  { cat: "Methodologies", items: ["Agile / Scrum", "TDSP"], icon: "📋" },
];

const projects = [
  {
    label: "PFE 2026",
    name: "YUCCA ERP Mobile",
    big: true,
    desc: "Flutter ERP app with integrated AI stock prediction (LightGBM). Dual‑channel FCM alerts, FastAPI microservice, Docker, and Supabase. Defended in June 2026.",
    stack: ["Flutter", "LightGBM", "FastAPI", "Django REST", "Docker", "Supabase", "Firebase FCM"],
    link: "https://github.com/Imen994",
  },
  {
    name: "Restaurant Management",
    desc: "Full‑stack web app with real‑time order tracking, inventory management, and analytics dashboard.",
    stack: ["Node.js", "Express", "MongoDB"],
    link: "https://github.com/Imen994",
  },
  {
    name: "Customer Churn Prediction",
    desc: "Random Forest model on telecom data for churn prediction, with data preprocessing and feature selection.",
    stack: ["Python", "Scikit-learn", "Pandas"],
    link: "https://github.com/Imen994",
  },
];

const experience = [
  {
    title: "Mobile & AI Developer Intern",
    company: "YUCCAINFO",
    location: "Sousse, Tunisia",
    date: "Feb – May 2026",
    bullets: [
      "Developed Flutter ERP mobile app (MVVM) for quotes, orders, products.",
      "Designed AI stock prediction module with LightGBM (CRITIQUE / BAS classification).",
      "Built and deployed FastAPI microservice (Docker) with Supabase/PostgreSQL.",
      "Integrated FCM push notifications for ERP and AI alerts.",
      "Contributed to extending Django REST Framework backend.",
    ],
  },
  {
    title: "Software Development Intern",
    company: "SaiKet Systems",
    location: "Remote",
    date: "Aug – Sep 2025",
    bullets: [
      "Built customer churn prediction model using Random Forest on telecom dataset.",
      "Performed data preprocessing, feature selection, and model evaluation.",
      "Delivered recommendations to support customer retention strategies.",
    ],
  },
  {
    title: "App Development Intern",
    company: "CodeAlpha",
    location: "Remote",
    date: "Jul – Sep 2024",
    bullets: [
      "Built full‑stack web applications with the MERN stack.",
      "Developed scalable and user‑friendly features across frontend and backend.",
    ],
  },
];

const certifications = [
  { icon: "", name: "AWS Academy Cloud Foundations", from: "Amazon Web Services" },
  { icon: "", name: "Building LLM Applications with Prompt Engineering", from: "Online Certification" },
  { icon: "", name: "Computer Vision Certificate", from: "NVIDIA" },
];

const languages = [
  { lang: "Arabic", level: "Native" },
  { lang: "French", level: "Professional" },
  { lang: "English", level: "Professional" },
];

export default function App() {
  const [heroRef, heroStyle] = useFadeUp(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          color: ${V.txt};
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4, .heading {
          font-family: 'Syne', sans-serif;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${V.v3}; border-radius: 10px; }
        ::-webkit-scrollbar-track { background: ${V.v5}; }
        .section-bg {
          background: linear-gradient(-45deg, #fff, ${V.v5}, #fff, ${V.v4});
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
      `}</style>

      <ScrollProgress />

      {/* NAV */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.8rem 3rem",
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${V.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.3rem",
            background: `linear-gradient(135deg, ${V.v1}, ${V.v3})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Imen Farhat
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["skills", "projects", "experience", "contact"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              style={{
                fontSize: "0.8rem",
                color: V.muted,
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.2s",
                textTransform: "capitalize",
              }}
              onMouseEnter={(e) => (e.target.style.color = V.v1)}
              onMouseLeave={(e) => (e.target.style.color = V.muted)}
            >
              {s}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
            <a
    href={`${import.meta.env.BASE_URL}cv.pdf`}
    download
    style={{
      fontSize: "0.8rem",
      color: V.v1,
      border: `1.5px solid ${V.v1}`,
      padding: "0.4rem 1rem",
      borderRadius: 30,
      textDecoration: "none",
      fontWeight: 600,
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = V.v4;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    📄 CV
  </a>
          <a
            href="mailto:farhatimen102@gmail.com"
            style={{
              fontSize: "0.8rem",
              background: V.v1,
              color: "#fff",
              padding: "0.4rem 1.2rem",
              borderRadius: 30,
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = V.v2;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(109,40,217,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = V.v1;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Hire me
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "6rem 3rem",
          background: `linear-gradient(160deg, #fff 50%, ${V.v5} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${V.v4} 0%, transparent 70%)`,
            top: -200,
            right: -200,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "4rem", flexWrap: "wrap" }}>
          <div ref={heroRef} style={{ ...heroStyle, flex: 1, minWidth: 300, zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.7rem",
                color: "#16A34A",
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 30,
                padding: "0.3rem 0.9rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#16A34A",
                  animation: "float 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              Open to work 
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "4rem",
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: "1rem",
                color: V.txt,
              }}
            >
              Building apps
              <br />
              that{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${V.v1}, ${V.v3})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Typewriter words={["think", "learn", "scale"]} />
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: V.muted,
                lineHeight: 1.8,
                maxWidth: 520,
                marginBottom: "2rem",
              }}
            >
              Computer Science student passionate about full‑stack development and AI‑powered applications.
              Experienced in Flutter, FastAPI, and machine learning pipelines.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="#projects"
                style={{
                  fontSize: "0.85rem",
                  background: V.v1,
                  color: "#fff",
                  padding: "0.7rem 1.8rem",
                  borderRadius: 30,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = V.v2;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(109,40,217,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = V.v1;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View my work →
              </a>
              <a
                href="#contact"
                style={{
                  fontSize: "0.85rem",
                  color: V.v1,
                  border: `1.5px solid ${V.v1}`,
                  padding: "0.7rem 1.8rem",
                  borderRadius: 30,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = V.v4;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get in touch
              </a>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 250, display: "flex", justifyContent: "center" }}>
            <Avatar size={260} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          borderTop: `1px solid ${V.border}`,
          borderBottom: `1px solid ${V.border}`,
          background: "#fafafe",
        }}
      >
        {[
          ["3", "Internships completed"],
          ["3+", "Projects shipped"],
          ["7+", "Technologies mastered"],
          ["2026", "PFE validated"],
        ].map(([num, label], i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "2rem 1rem",
              borderRight: i < 3 ? `1px solid ${V.border}` : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "2.4rem",
                fontWeight: 800,
                color: V.v1,
                display: "block",
              }}
            >
              {num}
            </span>
            <div style={{ fontSize: "0.75rem", color: V.muted, marginTop: "0.2rem" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* SKILLS */}
      <section id="skills" className="section-bg" style={{ padding: "5rem 0" }}>
        <div className="container">
          <SectionHead eyebrow="What I work with" title="Skills & technologies" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {skills.map((s, i) => (
              <SkillCard key={i} cat={s.cat} items={s.items} delay={i * 60} icon={s.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "5rem 0", background: "#fff" }}>
        <div className="container">
          <SectionHead eyebrow="Selected work" title="Projects" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.map((p, i) => (
              <ProjCard key={i} proj={p} delay={i * 100} big={p.big} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section-bg" style={{ padding: "5rem 0" }}>
        <div className="container">
          <SectionHead eyebrow="Where I've worked" title="Experience" />
          <div
            style={{
              position: "relative",
              paddingLeft: "2rem",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                bottom: 8,
                width: 2,
                background: `linear-gradient(to bottom, ${V.v1}, ${V.v3}, transparent)`,
              }}
            />
            {experience.map((item, i) => (
              <TlItem key={i} item={item} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section style={{ padding: "5rem 0", background: "#fff" }}>
        <div className="container">
          <SectionHead eyebrow="Learning" title="Certifications" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {certifications.map((c, i) => {
              const [ref, style] = useFadeUp(i * 100);
              return (
                <div
                  key={i}
                  ref={ref}
                  style={{
                    ...style,
                    border: `1px solid ${V.border}`,
                    borderRadius: 20,
                    padding: "1.5rem",
                    background: V.v5,
                    transition: `${style.transition}, border-color 0.2s, box-shadow 0.2s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = V.v2;
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(109,40,217,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = V.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.7rem" }}>{c.icon}</div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: V.txt,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: V.muted }}>{c.from}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LANGUES */}
      <section className="section-bg" style={{ padding: "4rem 0" }}>
        <div className="container">
          <SectionHead eyebrow="Communication" title="Languages" />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            {languages.map((l, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: V.txt,
                  }}
                >
                  {l.lang}
                </div>
                <div style={{ fontSize: "0.8rem", color: V.muted }}>{l.level}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={{
          padding: "6rem 0",
          textAlign: "center",
          background: `linear-gradient(160deg, #fff 30%, ${V.v5})`,
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.8rem",
              fontWeight: 800,
              color: V.txt,
              marginBottom: "0.5rem",
            }}
          >
            Let's connect
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              color: V.muted,
              marginBottom: "2.5rem",
              lineHeight: 1.8,
              maxWidth: 500,
              margin: "0 auto 2.5rem",
            }}
          >
            I'm looking for internships and junior roles in mobile development, AI
            engineering, or full‑stack. Let's build something great together.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: "", label: "Email", href: "mailto:farhatimen102@gmail.com" },
              {
                icon: "",
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/imenfarhat-5b31b336b/",
              },
              { icon: "", label: "GitHub", href: "https://github.com/Imen994" },
              
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8rem",
                  color: V.v1,
                  border: `1.5px solid ${V.border}`,
                  borderRadius: 30,
                  padding: "0.6rem 1.4rem",
                  textDecoration: "none",
                  fontWeight: 600,
                  background: "#fff",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = V.v2;
                  e.currentTarget.style.background = V.v4;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(109,40,217,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = V.border;
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          fontSize: "0.75rem",
          color: V.muted,
          borderTop: `1px solid ${V.border}`,
          background: "#fff",
        }}
      >
        © 2026 Imen Farhat — Built with React + Vite
        <span style={{ margin: "0 0.5rem" }}>·</span>
        <a
          href="#"
          style={{ color: V.v1, textDecoration: "none", fontWeight: 500 }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </>
  );
}