"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [flippedCards, setFlippedCards] = useState({
    rafi: false,
    freya: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"success" | "error" | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const nav = document.getElementById("nav");
    const fabWa = document.getElementById("fabWa");

    const handleScroll = () => {
      const y = window.scrollY;
      nav?.classList.toggle("scrolled", y > 40);
      fabWa?.classList.toggle("show", y > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll);

    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));

    const sections = ["about", "ready", "ratecard", "contact"].map((id) =>
      document.getElementById(id)
    );
    const navA = document.querySelectorAll(".nav-links a");
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navA.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => s && navObserver.observe(s));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
      navObserver.disconnect();

    };
  }, []);

  const toggleCard = (key: "rafi" | "freya") => {
    setFlippedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    key: "rafi" | "freya"
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard(key);
    }
  };

  const scrollByCards = (dir: number) => {
    const expScroll = document.getElementById("expScroll");
    if (!expScroll) return;
    const card = expScroll.querySelector<HTMLElement>(".exp-tile");
    const step = card ? card.offsetWidth + 20 : 280;
    expScroll.scrollBy({ left: dir * step * 1.5, behavior: "smooth" });
  };

  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const WA_NUMBER = "6285161922006";
    const values = {
      name: String(formData.get("name") || "-").trim(),
      phone: String(formData.get("phone") || "-").trim(),
      eventType: String(formData.get("event_type") || "-").trim(),
      eventDate: String(formData.get("event_date") || "-").trim(),
      eventTime: String(formData.get("event_time") || "-").trim(),
      duration: String(formData.get("duration") || "-").trim(),
      message: String(formData.get("message") || "-").trim(),
    };

    const lines = [
      `Halo Raya & Co.,`,
      ``,
      `Perkenalkan, saya *${values.name}*. Saya bermaksud menanyakan ketersediaan jadwal MC dengan rincian acara sebagai berikut:`,
      ``,
      `*DETAIL ACARA*`,
      `- Jenis Acara : ${values.eventType}`,
      `- Tanggal     : ${values.eventDate}`,
      `- Waktu       : ${values.eventTime}`,
      `- Durasi      : ${values.duration}`,
      ``,
      `*INFORMASI TAMBAHAN*`,
      `- No. WA      : ${values.phone}`,
      `- Catatan     : ${values.message}`,
      ``,
      `Mohon informasi lebih lanjut mengenai ketersediaan jadwal serta proses booking-nya. Terima kasih.`
    ];
    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";

    setIsSubmitting(true);
    setSubmitState(null);
    setSubmitMessage("");

    if (FORMSPREE_ENDPOINT.includes("REPLACE_WITH_YOUR_FORM_ID")) {
      setSubmitState("success");
      setSubmitMessage("Membuka WhatsApp...");
      window.open(waLink, "_blank", "noopener,noreferrer");
      form.reset();
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setSubmitState("success");
        setSubmitMessage("Terkirim! Membuka WhatsApp...");
        window.open(waLink, "_blank", "noopener,noreferrer");
        form.reset();
      } else {
        setSubmitState("error");
        setSubmitMessage("Gagal mengirim. Coba lagi, atau langsung chat WhatsApp ya.");
      }
    } catch {
      setSubmitState("error");
      setSubmitMessage("Gagal mengirim. Coba lagi, atau langsung chat WhatsApp ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <nav className="nav" id="nav">
        <div className="wrap">
          <a href="#cover" className="nav-logo">
            <img src="/logo_raya.png" alt="Logo Raya & Co." />
            <span>RAYA & CO.</span>
          </a>
          <ul className="nav-links" id="navLinks">
            <li><a href="#about">Get to Know Us</a></li>
            <li><a href="#ready">We&apos;re Ready For</a></li>
            <li><a href="#ratecard">Rate Card</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a
            className="nav-cta"
            href="https://wa.me/6285161922006?text=Halo%20Raya%20%26%20Co.%21%20Saya%20tertarik%20booking%20MC%20untuk%20acara%20saya%2C%20boleh%20minta%20info%20lebih%20lanjut%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            Booking Now
          </a>
        </div>
      </nav>

      {/* ================= HERO / COVER ================= */}
      <header className="hero" id="cover">
        <div className="hero-rings" aria-hidden="true">
          <svg width="600" height="600" style={{ top: "-180px", left: "-220px", position: "absolute" }} viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="299" stroke="#4BA99A" strokeOpacity="0.25" />
          </svg>
          <svg width="500" height="500" style={{ bottom: "-160px", right: "-160px", position: "absolute" }} viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="249" stroke="#F4C34D" strokeOpacity="0.18" />
          </svg>
        </div>

        <div className="hero-eyebrow">
          <span className="dot"></span> Professional Master of Ceremony
        </div>

        <img className="hero-logo" src="/logo_raya.png" alt="Logo Raya & Co. — ikon mikrofon dengan huruf R dan F" />

        <h1>RAYA <span className="amp">&amp;</span> CO.</h1>
        <p className="hero-sub">
          Dua suara, satu chemistry. <b>Rafi &amp; Freya</b> siap memandu acaramu supaya terasa
          hidup, hangat, dan tak terlupakan.
        </p>

        <div className="hero-ctas">
          <a
            className="btn btn-primary"
            href="https://wa.me/6285161922006?text=Halo%20Raya%20%26%20Co.%21%20Saya%20tertarik%20booking%20MC%20untuk%20acara%20saya%2C%20boleh%20minta%20info%20lebih%20lanjut%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="wa-icon" src="/icon_WA.png" alt="" />
            Chat via WhatsApp
          </a>
          <a className="btn btn-ghost" href="#ratecard">
            Lihat Rate Card
          </a>
        </div>

        <div className="waveform" aria-hidden="true">
          <span style={{ height: "16px", animationDelay: "0s" }}></span>
          <span style={{ height: "30px", animationDelay: ".1s" }}></span>
          <span style={{ height: "44px", animationDelay: ".2s" }}></span>
          <span style={{ height: "24px", animationDelay: ".3s" }}></span>
          <span style={{ height: "38px", animationDelay: ".4s" }}></span>
          <span style={{ height: "20px", animationDelay: ".5s" }}></span>
          <span style={{ height: "44px", animationDelay: ".6s" }}></span>
          <span style={{ height: "28px", animationDelay: ".7s" }}></span>
          <span style={{ height: "16px", animationDelay: ".8s" }}></span>
        </div>

        <div className="scroll-cue">
          <span className="line"></span>Scroll
        </div>
      </header>

      {/* ================= GET TO KNOW US ================= */}
      <section className="about" id="about">
        <div className="wrap reveal">
          <div className="section-tag">Get to Know Us</div>
          <h2 className="section-title">
            Perkenalkan, kami <span style={{ color: "var(--teal)" }}>Rafi</span> &amp;{" "}
            <span style={{ color: "var(--teal)" }}>Freya</span>
          </h2>

          <div className="about-grid">
            <div className="about-photos">
              
              {/* --- KARTU RAFI --- */}
              <div
                className={`photo-card pc-1 ${flippedCards.rafi ? "flipped" : ""}`}
                tabIndex={0}
                role="button"
                aria-pressed={flippedCards.rafi}
                aria-label="Kartu Rafi, klik untuk lihat detail"
                onClick={() => toggleCard("rafi")}
                onKeyDown={(event) => handleCardKeyDown(event, "rafi")}
              >
                <div className="flip-inner">
                  
                  {/* --- BAGIAN DEPAN (FOTO FULL - NAVY) --- */}
                  <div 
                    className="flip-face flip-front" 
                    style={{ 
                      justifyContent: "flex-end",
                      backgroundImage: "linear-gradient(to top, rgba(34, 49, 99, 0.95) 0%, transparent 40%), url('/rafi.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "6px solid var(--navy-soft)" // Border depan navy
                    }}
                  >
                    <div 
                      className="flip-hint" 
                      style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }} 
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.6 15A8 8 0 0 0 20 12M19.4 9A8 8 0 0 0 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Klik untuk lihat detail
                    </div>
                  </div>

                  {/* --- BAGIAN BELAKANG (DETAIL - TEAL/HIJAU) --- */}
                  <div 
                    className="flip-face flip-back"
                    style={{ border: "6px solid var(--teal)" }} // Border belakang diubah ke teal!
                  >
                    <span className="field-label">Nama Lengkap</span>
                    <span className="field-value">Andi Muhammad Asyrafi Bukti</span>
                    <span className="field-label">Instagram</span>
                    <span className="field-value">@asyrafibukti</span>
                    <div className="flip-hint">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.6 15A8 8 0 0 0 20 12M19.4 9A8 8 0 0 0 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Klik lagi untuk kembali
                    </div>
                  </div>

                </div>
              </div>

              {/* --- KARTU FREYA --- */}
              <div
                className={`photo-card pc-2 ${flippedCards.freya ? "flipped" : ""}`}
                tabIndex={0}
                role="button"
                aria-pressed={flippedCards.freya}
                aria-label="Kartu Freya, klik untuk lihat detail"
                onClick={() => toggleCard("freya")}
                onKeyDown={(event) => handleCardKeyDown(event, "freya")}
              >
                <div className="flip-inner">
                  
                  {/* BAGIAN DEPAN (FOTO FULL) */}
                  <div 
                    className="flip-face flip-front" 
                    style={{ 
                      justifyContent: "flex-end",
                      backgroundImage: "linear-gradient(to top, rgba(75, 169, 154, 0.95) 0%, transparent 40%), url('/freya.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "6px solid var(--teal)" 
                    }}
                  >
                    <div 
                      className="flip-hint" 
                      style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }} 
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.6 15A8 8 0 0 0 20 12M19.4 9A8 8 0 0 0 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Klik untuk lihat detail
                    </div>
                  </div>

                  {/* BAGIAN BELAKANG (DETAIL) */}
                  <div 
                    className="flip-face flip-back"
                    style={{ border: "6px solid var(--navy-soft)" }}
                  >
                    <span className="field-label">Nama Lengkap</span>
                    <span className="field-value">Freya Zahra Anindyabhakti</span>
                    <span className="field-label">Instagram</span>
                    <span className="field-value">@freyazahr</span>
                    <div className="flip-hint">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.6 15A8 8 0 0 0 20 12M19.4 9A8 8 0 0 0 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Klik lagi untuk kembali
                    </div>
                  </div>

                </div>
              </div>
              
            </div>

            <div className="about-copy">
              <p className="lede">
                <b>Raya &amp; Co.</b> adalah duo MC yang menggabungkan profesionalisme, chemistry, dan komunikasi
                yang natural di setiap panggung. Berawal sebagai kakak dan adik kelas di SMA yang kerap 
                dipasangkan sebagai MC, kini kami melanjutkan perjalanan tersebut sebagai mahasiswa 
                Universitas Indonesia dengan kekompakan yang terus terbangun dalam setiap acara.
              </p>

              <div className="about-blocks">
                <div className="about-block block-navy">
                  <h3>Cerita Kami</h3>
                  Sejak <b>2023</b>, kami aktif membawakan berbagai jenis acara. Pengalaman tersebut membentuk chemistry, 
                  ritme komunikasi, dan gaya membawakan acara yang terasa natural, interaktif, serta mampu membangun 
                  suasana sesuai karakter setiap event.
                </div>
                <div className="about-block block-yellow">
                  <h3>Yang Kami Tawarkan</h3>
                  Kami menyediakan layanan <b>MC dan Moderator</b> untuk berbagai jenis acara. Mulai dari formal, 
                  semi-formal, hingga non-formal. Gaya pembawaan dapat disesuaikan dengan karakter acara,
                   mulai dari profesional, hangat, energik, hingga santai dan interaktif.
                </div>
              </div>

              <div className="about-meta">
                <div>
                  <strong>2023</strong>
                  <span>Established 2023</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>Professional MCs</span>
                </div>
                <div>
                  <strong>10+</strong>
                  <span>Hosting Style</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WE'RE READY FOR ================= */}
      <section className="ready on-dark" id="ready">
        <div className="wrap reveal">
          <div className="section-tag">We&apos;re Ready For</div>
          <h2 className="section-title">Acara apapun, kami siap turun tangan</h2>

          <div className="ready-grid">
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="7" width="16" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <h3>Corporate Event</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l2.6 5.9L21 10l-4.8 4 1.4 6.4L12 17.2 6.4 20.4 7.8 14 3 10l6.4-1.1L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <h3>Formal Ceremony</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <h3>Seminar / Talkshow</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <rect x="8" y="3" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <h3>Podcast</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M17 9l4-2v10l-4-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <h3>Virtual Event</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <h3>Private Event</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <h3>Birthday Party</h3>
            </div>
            <div className="ready-card">
              <svg className="ic" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <h3>Acara Lainnya</h3>
            </div>
            <p className="ready-more">…dan acara spesial lain yang sudah kamu bayangkan. Ceritakan ke kami!</p>
          </div>

          <div className="exp-block" id="experience">
            <div className="exp-head">
              <div>
                <h3>Momen yang sudah kami pandu</h3>
                <p>Geser untuk lihat pengalaman kami di berbagai acara.</p>
              </div>
              <div className="exp-arrows">
                <button className="exp-arrow" aria-label="Geser ke kiri" type="button" onClick={() => scrollByCards(-1)}>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="exp-arrow" aria-label="Geser ke kanan" type="button" onClick={() => scrollByCards(1)}>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            <div className="exp-wrap">
              <div className="exp-scroll" id="expScroll" tabIndex={0}>
                {[
                  { tag: "Launching Product IONext", desc: "Peluncuran resmi platform IONext dari PT Data Awan Nusantara.", img: "/mc_corporate.jpg" },
                  { tag: "Goverment Iftar Gathering", desc: "Acara silaturahmi dan buka puasa bersama Kemenko Infra RI.", img: "/mc_bukber.jpg" },
                  { tag: "IKASTARA Happy Futsal Tournament 2025", desc: "Memandu jalannya turnamen persahabatan.", img: "/mc_ihft.jpg" },
                  { tag: "Leadership Seminar with Tranjakarta", desc: "Forum penyampaian visi kepemimpinan dan kolaborasi alumni.", img: "/mc_transjakarta.jpg" },
                  { tag: "Podcast Semiformal", desc: "Podcast Isu Politik Kontemporer bersama mahasiswa Ilmu Politik Universitas Indonesia.", img: "/mc_podcast.jpg" },
                  { tag: "Iftar with Menlu RI", desc: "Silaturahmi IKASTARA bersama Menteri Luar Negeri RI", img: "/mc_goverment.jpg" },
                  { tag: "RKB 30 tahun ikastara", desc: "Kegiatan olahraga bersama dalam rangka peringatan ulang tahun ke-30.", img: "/mc_rkb.jpg" },
                  { tag: "iftar with direktur pln", desc: "Kegiatan silaturahmi dan buka puasa bersama Direktur PLN.", img: "/mc_pln.jpg" },
                  { tag: "Compfest 17", desc: "Festival dan kompetisi teknologi informasi berskala nasional.", img: "/mc_compfest.JPG" },
                  { tag: "Kampanye akbar", desc: "Festival akbar yang merayakan semangat kolaborasi keluarga besar alumni.", img: "/mc_kampanye.JPG" },
                  { tag: "Akrobatik 2024", desc: "Acara aliansi Mahasiswa Ilmu Politik Jakarta.", img: "/mc_kampus.jpeg" },
                  { tag: "Seminar Disinformasi Dunia Digital", desc: "Seminar edukatif mengenai pencegahan penyebaran informasi hoaks di dunia maya.", img: "/moderator.jpg" },
                  { tag: "Sistech 2025", desc: "Workshop dan Awarding program SISTECH 2025.", img: "/mc_sistech.jpeg" }
                ].map((item, idx) => (
                  <div className="exp-tile" key={idx}>
                    <div className="exp-photo">
                      {item.img ? (
                        <img className="exp-image" src={item.img} alt={item.tag} />
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                            <circle cx="12" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M8 6l1.4-2h5.2L16 6" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                          <span>Ganti dengan foto</span>
                        </>
                      )}
                    </div>
                    <div className="exp-caption">
                      <span className="tag">{item.tag}</span>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="exp-note">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              Setiap acara memiliki ceritanya sendiri. Mari ciptakan momen tak terlupakan bersama kami.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RATE CARD ================= */}
      <section className="rate on-dark" id="ratecard">
        <div className="wrap reveal">
          <div className="section-tag">Rate Card</div>
          <h2 className="section-title">Investasi untuk acara yang lebih hidup</h2>

          <div className="rate-grid">
            <div className="rate-teaser">
              <div className="rate-price">
                <span className="from">Mulai dari</span>
                Rp1.200.000
              </div>
              <p className="rate-teaser-copy">
                Kamu sudah bisa menghadirkan MC yang siap membuat acaramu lebih hidup, hangat, dan berkesan. Pilih paket yang paling sesuai dengan kebutuhanmu, mulai dari durasi acara hingga opsi <b>MC Individu</b> atau <b>MC Duo</b>.
              </p>
              
              <div className="rate-note">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                <span>Rate Card menyesuaikan dengan durasi & jumlah MC. Berlaku untuk area <b style={{ color: "#fff" }}>JABODETABEK</b>.</span>
              </div>

              <a className="rate-nego" href="#contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                <span>Let's Discuss Your Budget! Contact us!</span>
              </a>
            </div>

            <div className="rate-side">
              <div className="rate-panel include">
                <h3><span className="swatch"></span>Sudah Termasuk</h3>
                <ul>
                  <li>Rehearsal / gladi resik <b>1x</b></li>
                  <li>Briefing bersama panitia acara</li>
                  <li>Transportasi area Jakarta</li>
                  <li>Outfit menyesuaikan permintaan</li>
                </ul>
              </div>
              <div className="rate-panel exclude">
                <h3><span className="swatch"></span>Belum Termasuk / Tambahan</h3>
                <ul>
                  <li>Cue card MC <b>+Rp200.000</b></li>
                  <li>Rehearsal tambahan <b>+Rp350.000</b></li>
                  <li>Transportasi luar Jakarta <b>+Rp250.000</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="contact" id="contact">
        <div className="wrap reveal">
          <div className="section-tag">Contact</div>
          <h2 className="section-title">Yuk, ngobrolin acaramu</h2>
          <p className="contact-sub">Ceritakan tanggal, jenis, dan kebutuhan acaramu. Kami bantu carikan paket yang paling pas.</p>

          <form className="booking-form" id="bookingForm" noValidate onSubmit={handleBookingSubmit}>
            <div className="field-row">
              <label>
                Nama Lengkap
                <input type="text" name="name" placeholder="Nama kamu" required />
              </label>
              <label>
                Nomor WhatsApp
                <input type="tel" name="phone" placeholder="08xxxxxxxxxx" required />
              </label>
            </div>

            <div className="field-row">
              <label>
                Jenis Acara
                <select name="event_type" defaultValue="" required>
                  <option value="" disabled>
                    Pilih jenis acara
                  </option>
                  <option>Corporate Event</option>
                  <option>Formal Ceremony</option>
                  <option>Seminar / Talkshow</option>
                  <option>Podcast</option>
                  <option>Virtual Event</option>
                  <option>Private Event</option>
                  <option>Birthday Party</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label>
                Tanggal Acara
                <input type="date" name="event_date" />
              </label>
            </div>

            <div className="field-row">
              <label>
                Waktu Acara
                <input type="time" name="event_time" />
              </label>
              <label>
                Estimasi Durasi
                <select name="duration" defaultValue="">
                  <option value="" disabled>
                    Pilih estimasi durasi
                  </option>
                  <option>1 jam</option>
                  <option>2 – 3 jam</option>
                  <option>4 – 5 jam</option>
                  <option>Lebih dari 5 jam</option>
                </select>
              </label>
            </div>

            <label>
              Catatan Tambahan
              <textarea
                name="message"
                placeholder="Ceritakan lokasi, konsep acara, atau kebutuhan lainnya..."
              />
            </label>

            <button type="submit" className="btn btn-primary" id="bookingSubmit" disabled={isSubmitting}>
              <img className="wa-icon" src="/icon_WA.png" alt="" />
              <span id="bookingSubmitLabel">
                {isSubmitting ? "Mengirim..." : "Kirim & Lanjut ke WhatsApp"}
              </span>
            </button>
            <p className={`form-status ${submitState ?? ""}`} id="formStatus" aria-live="polite">
              {submitMessage}
            </p>
            <p className="form-hint">
              <span style={{ display: "block", marginBottom: "4px", fontWeight: "700" }}>
                  Pengajuan awal, bukan booking otomatis
                </span>
                <span style={{ fontSize: "0.78rem", opacity: 0.9 }}>
                  Admin akan konfirmasi jadwal fix via WhatsApp
                </span>
            </p>
          </form>

          <div className="contact-links">
            <a href="#cover">Kembali ke atas</a>
            <a href="#ratecard">Lihat rate card</a>
            <a href="#experience">Lihat pengalaman kami</a>
          </div>
        </div>
      </section>

      {/* ================= FLOATING WA ================= */}
      <a className="fab-wa" id="fabWa" href="https://wa.me/6285161922006?text=Halo%20Raya%20%26%20Co.%21%20Saya%20tertarik%20booking%20MC%20untuk%20acara%20saya%2C%20boleh%20minta%20info%20lebih%20lanjut%3F" target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp Raya & Co.">
        <span className="fab-ping" aria-hidden="true"></span>
        <img className="wa-icon fab-wa-icon" src="/icon_WA.png" alt="" />
      </a>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="wrap">
          <div>
            <div><strong>Raya &amp; Co.</strong> </div>
          </div>
          <div className="footer-social">
            {/* Ganti link href di bawah dengan link Instagram yang asli */}
            <a href="https://instagram.com/rayaandco" target="_blank" rel="noopener noreferrer" aria-label="Instagram Raya & Co.">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
              </div>
              <span>@raya&amp;co.</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}