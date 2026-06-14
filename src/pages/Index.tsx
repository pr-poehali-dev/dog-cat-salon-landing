import { useState, useEffect, useRef, useCallback } from "react";

// ─── Данные ──────────────────────────────────────────────────────────────────

const PRICES = {
  dogs: [
    { service: "Купание + сушка", price: "от 1 200 ₽" },
    { service: "Стрижка модельная", price: "от 2 500 ₽" },
    { service: "Стрижка гигиеническая", price: "от 1 800 ₽" },
    { service: "Тримминг", price: "от 3 000 ₽" },
    { service: "Чистка ушей", price: "300 ₽" },
    { service: "Стрижка когтей", price: "350 ₽" },
    { service: "Комплекс (купание + стрижка)", price: "от 3 500 ₽" },
  ],
  cats: [
    { service: "Купание + сушка", price: "от 1 000 ₽" },
    { service: "Стрижка модельная", price: "от 2 000 ₽" },
    { service: "Стрижка гигиеническая", price: "от 1 500 ₽" },
    { service: "Вычёсывание + удаление колтунов", price: "от 900 ₽" },
    { service: "Чистка ушей", price: "250 ₽" },
    { service: "Стрижка когтей", price: "300 ₽" },
    { service: "Комплекс (купание + стрижка)", price: "от 2 800 ₽" },
  ],
};

const MASTERS = [
  {
    name: "Анна Соколова",
    spec: "Кошки и мелкие породы собак",
    exp: "7 лет опыта",
    quote: "Каждый питомец — маленькая звезда. Я просто помогаю ей засиять.",
    photo: "https://cdn.poehali.dev/projects/7be044cc-c0c5-481e-bfba-545a65d6e2bd/files/8988b501-e857-4823-aa01-6e3065943c91.jpg",
  },
  {
    name: "Михаил Громов",
    spec: "Крупные породы, тримминг",
    exp: "5 лет опыта",
    quote: "Работаю не спеша — животные это чувствуют и не боятся.",
    photo: "https://cdn.poehali.dev/projects/7be044cc-c0c5-481e-bfba-545a65d6e2bd/files/3037c242-0afc-4b1e-9822-78863c85ab24.jpg",
  },
  {
    name: "Дарья Лис",
    spec: "Стрижки, окрас, SPA-уход",
    exp: "4 года опыта",
    quote: "После моих процедур хозяева говорят: «Это уже другой пёс!»",
    photo: "https://cdn.poehali.dev/projects/7be044cc-c0c5-481e-bfba-545a65d6e2bd/files/9fbc60a8-f379-4fa7-85e7-5c9570933fc4.jpg",
  },
];

const REVIEWS = [
  {
    name: "Оксана Т.",
    pet: "хозяйка шпица Лёни",
    text: "Записались первый раз и сразу влюбились! Лёня после стрижки выглядит как настоящая звезда. Мастера терпеливые, всё объяснили.",
    rating: 5,
    source: "Яндекс Карты",
  },
  {
    name: "Алексей В.",
    pet: "хозяин лабрадора Бублика",
    text: "Раньше боялся отдавать собаку — Бублик нервничал везде. Здесь всё иначе: тихо, спокойно, пахнет хорошо. Теперь только сюда.",
    rating: 5,
    source: "Яндекс Карты",
  },
  {
    name: "Марина С.",
    pet: "хозяйка двух кошек",
    text: "Привожу обеих кошек. Девочки после купания и стрижки выглядят потрясающе. Цены честные, никаких сюрпризов. Рекомендую!",
    rating: 5,
    source: "Яндекс Карты",
  },
  {
    name: "Дмитрий К.",
    pet: "хозяин хаски Вьюги",
    text: "Вьюга — та ещё драматичная дама. Но здесь её уболтали, вычесали и постригли когти без истерик. Магия!",
    rating: 5,
    source: "Яндекс Карты",
  },
  {
    name: "Светлана Н.",
    pet: "хозяйка персидского кота",
    text: "Персидские коты — отдельная история. Тут знают, как с ними работать. Кот пришёл домой пушистым и довольным.",
    rating: 5,
    source: "Яндекс Карты",
  },
];

const HERO_IMG =
  "https://cdn.poehali.dev/projects/7be044cc-c0c5-481e-bfba-545a65d6e2bd/bucket/a7ce57a4-5576-4538-99b2-5a716fadfbf1.png";

const GROOMING_IMG =
  "https://cdn.poehali.dev/projects/7be044cc-c0c5-481e-bfba-545a65d6e2bd/files/6d7628d8-08d0-4bcf-a64d-8cc370727735.jpg";

// TODO: Заменить на реальные фото работ (минимум 9 штук)
const GALLERY_PHOTOS = Array.from({ length: 9 }, (_, i) => ({
  src: GROOMING_IMG,
  alt: `Работа грумера #${i + 1}`,
  tall: i % 3 === 0,
}));

// ─── Хук счётчика цифр ───────────────────────────────────────────────────────

function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(target * ease));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { ref, count };
}

// ─── Хук fade-in при скролле ─────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

// ─── Навбар ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Услуги", href: "#booking" },
    { label: "Цены", href: "#prices" },
    { label: "Мастера", href: "#masters" },
    { label: "Контакты", href: "#contacts" },
  ];

  return (
    <header className={`ry-navbar ${scrolled ? "ry-navbar--scrolled" : ""}`}>
      <div className="ry-navbar-inner">
        {/* Логотип */}
        <a href="#" className="ry-navbar-logo">
          <span className="ry-navbar-logo-paw">🐾</span>
          <span className="ry-navbar-logo-text">
            Dog<span>&amp;</span>Cat
            <em>Рыжуля</em>
          </span>
        </a>

        {/* Ссылки */}
        <nav className={`ry-navbar-links ${menuOpen ? "ry-navbar-links--open" : ""}`}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className="ry-navbar-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Кнопки */}
        <div className="ry-navbar-actions">
          {/* TODO: Реальный номер телефона */}
          <a href="tel:+70000000000" className="ry-navbar-phone">
            📞 +7 (000) 000-00-00
          </a>
          <a href="#booking" className="ry-btn ry-navbar-cta">
            Записаться
          </a>
          <button
            className={`ry-navbar-burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="ry-hero"
      style={{ backgroundImage: `url(${HERO_IMG})` }}
    >
      <div className="ry-hero-overlay" />
      <div className="ry-hero-content">
        <div className="ry-hero-badge">Профессиональный груминг · Волгоград</div>
        <h1 className="ry-hero-title">
          Груминг,
          <br />
          <em>которому доверяют</em>
        </h1>
        <div className="ry-hero-rating">
          <span className="ry-stars">★★★★★</span>
          <span>5.0 · 75 отзывов на Яндекс Картах</span>
        </div>
        <div className="ry-hero-actions">
          <a href="#booking" className="ry-btn">
            Записаться онлайн
          </a>
          {/* TODO: Реальный номер телефона */}
          <a href="tel:+70000000000" className="ry-hero-phone">
            или позвонить →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Счётчик для цифр ────────────────────────────────────────────────────────

function StatCard({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: string }) {
  const { ref, count } = useCounter(value);
  return (
    <div className="ry-stat-card">
      <div className="ry-stat-glow" />
      <div className="ry-stat-icon">{icon}</div>
      <div className="ry-stat-number">
        <span ref={ref}>{count}</span>{suffix}
      </div>
      <div className="ry-stat-label">{label}</div>
    </div>
  );
}

// ─── Преимущества ─────────────────────────────────────────────────────────────

function BenefitsSection() {
  const ref = useFadeIn();
  const items = [
    { icon: "🎓", title: "Опытные мастера", desc: "Сертифицированные грумеры с опытом от 4 лет. Проходим обучение и следим за новыми техниками." },
    { icon: "⭐", title: "Рейтинг 5.0", desc: "75 отзывов на Яндекс Картах. Ни одного негативного — гордимся каждым клиентом." },
    { icon: "📱", title: "Онлайн-запись", desc: "Выбирайте удобное время без звонков, очередей и ожидания." },
    { icon: "🏡", title: "Уютная атмосфера", desc: "Тихий салон, успокаивающая музыка — питомцы расслабляются с первых минут." },
  ];

  return (
    <section className="ry-section ry-section--light ry-section--pattern ry-section--bg-text" id="benefits">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Почему выбирают нас</h2>
        <p className="ry-section-sub">Доверие тысяч питомцев и их хозяев</p>

        {/* Цифры-статистика */}
        <div className="ry-stats">
          <StatCard value={75}  suffix="+" label="Довольных клиентов" icon="❤️" />
          <StatCard value={5}   suffix=".0" label="Рейтинг на Яндекс" icon="⭐" />
          <StatCard value={7}   suffix="+" label="Лет работаем" icon="🏆" />
          <StatCard value={100} suffix="%" label="Безопасные средства" icon="🛡️" />
        </div>

        {/* Карточки */}
        <div className="ry-benefits">
          {items.map((item, i) => (
            <div key={item.title} className="ry-benefit-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ry-benefit-accent-line" />
              <div className="ry-benefit-icon">{item.icon}</div>
              <h3 className="ry-benefit-title">{item.title}</h3>
              <p className="ry-benefit-desc">{item.desc}</p>
              <div className="ry-benefit-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Прайс ────────────────────────────────────────────────────────────────────

function PricesSection() {
  const [tab, setTab] = useState<"dogs" | "cats">("dogs");
  const ref = useFadeIn();

  return (
    <section className="ry-section ry-section--cream ry-section--pattern" id="prices">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Прайс-лист</h2>
        <p className="ry-section-sub">Стоимость зависит от породы и состояния шерсти</p>
        <div className="ry-price-wrapper">
          <div className="ry-tabs-row">
            <button
              className={`ry-tab ${tab === "dogs" ? "ry-tab--active" : ""}`}
              onClick={() => setTab("dogs")}
            >
              🐶 Собаки
            </button>
            <button
              className={`ry-tab ${tab === "cats" ? "ry-tab--active" : ""}`}
              onClick={() => setTab("cats")}
            >
              🐱 Кошки
            </button>
          </div>
          <div className="ry-price-table">
            {PRICES[tab].map((row, i) => (
              <div key={i} className={`ry-price-row ${i % 2 === 0 ? "ry-price-row--even" : ""}`}>
                <span className="ry-price-service">{row.service}</span>
                <span className="ry-price-value">{row.price}</span>
              </div>
            ))}
          </div>
          <div className="ry-price-footer">
            <p className="ry-price-note">Точная цена уточняется при записи</p>
            <a href="#booking" className="ry-btn">Записаться на услугу</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Галерея ──────────────────────────────────────────────────────────────────

function GallerySection() {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const ref = useFadeIn();
  const visible = showAll ? GALLERY_PHOTOS : GALLERY_PHOTOS.slice(0, 6);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="ry-section ry-section--light">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Наши работы</h2>
        {/* TODO: Фото реальных работ — минимум 9 штук */}
        <p className="ry-section-sub">Реальные фото наших питомцев после груминга</p>
        <div className="ry-gallery">
          {visible.map((photo, i) => (
            <div
              key={i}
              className={`ry-gallery-item ${photo.tall ? "ry-gallery-item--tall" : ""}`}
              onClick={() => setLightbox(photo.src)}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="ry-gallery-overlay">🔍</div>
            </div>
          ))}
        </div>
        {!showAll && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="ry-btn-outline" onClick={() => setShowAll(true)}>
              Показать ещё фото
            </button>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="ry-lightbox" onClick={() => setLightbox(null)}>
          <button className="ry-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Работа грумера" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

// ─── Мастера ──────────────────────────────────────────────────────────────────

function MastersSection() {
  const ref = useFadeIn();

  return (
    <section className="ry-section ry-section--card ry-section--geo" id="masters">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Наши мастера</h2>
        <p className="ry-section-sub">Любят животных — и умеют с ними работать</p>
        <div className="ry-masters">
          {MASTERS.map((m) => (
            <div key={m.name} className="ry-master-card">
              <div
                className="ry-master-avatar"
                style={{ backgroundImage: `url(${m.photo})` }}
              />
              <div className="ry-master-info">
                <h3 className="ry-master-name">{m.name}</h3>
                <p className="ry-master-spec">{m.spec}</p>
                <p className="ry-master-exp">{m.exp}</p>
                <blockquote className="ry-master-quote">«{m.quote}»</blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Форма записи ─────────────────────────────────────────────────────────────

function BookingSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", pet_name: "", animal: "",
    breed: "", service: "", date: "", time: "", comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Подключить endpoint формы или mailto
    setSent(true);
  };

  return (
    <section className="ry-section ry-section--dark" id="booking">
      <div className="ry-container">
        {sent ? (
          <div className="ry-thanks">
            <div className="ry-thanks-icon">🐾</div>
            <h2>Спасибо за запись!</h2>
            <p>Мы свяжемся с вами в ближайшее время для подтверждения.</p>
            <button className="ry-btn" onClick={() => setSent(false)}>
              Записать ещё раз
            </button>
          </div>
        ) : (
          <>
            <h2 className="ry-section-title ry-section-title--white">Записаться онлайн</h2>
            <p className="ry-section-sub ry-section-sub--white">
              Выберите удобное время — мы подтвердим запись по телефону
            </p>
            <form className="ry-form" onSubmit={handleSubmit}>
              <div className="ry-form-row">
                <div className="ry-form-group">
                  <label>Ваше имя *</label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Как вас зовут?" />
                </div>
                <div className="ry-form-group">
                  <label>Телефон *</label>
                  <input name="phone" required type="tel" value={form.phone} onChange={handleChange} placeholder="+7 (___) ___-__-__" />
                </div>
              </div>
              <div className="ry-form-row">
                <div className="ry-form-group">
                  <label>Кличка питомца</label>
                  <input name="pet_name" value={form.pet_name} onChange={handleChange} placeholder="Как зовут вашего питомца?" />
                </div>
                <div className="ry-form-group">
                  <label>Вид животного *</label>
                  <select name="animal" required value={form.animal} onChange={handleChange}>
                    <option value="">Выберите...</option>
                    <option value="dog">🐶 Собака</option>
                    <option value="cat">🐱 Кошка</option>
                  </select>
                </div>
              </div>
              <div className="ry-form-row">
                <div className="ry-form-group">
                  <label>Порода</label>
                  <input name="breed" value={form.breed} onChange={handleChange} placeholder="Например: лабрадор" />
                </div>
                <div className="ry-form-group">
                  <label>Услуга *</label>
                  <select name="service" required value={form.service} onChange={handleChange}>
                    <option value="">Выберите услугу...</option>
                    <option value="wash">Купание + сушка</option>
                    <option value="haircut_model">Стрижка модельная</option>
                    <option value="haircut_hygiene">Стрижка гигиеническая</option>
                    <option value="trimming">Тримминг</option>
                    <option value="complex">Комплекс (купание + стрижка)</option>
                    <option value="ears">Чистка ушей</option>
                    <option value="claws">Стрижка когтей</option>
                  </select>
                </div>
              </div>
              <div className="ry-form-row">
                <div className="ry-form-group">
                  <label>Дата *</label>
                  <input
                    name="date" required type="date" value={form.date} onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="ry-form-group">
                  <label>Удобное время</label>
                  <select name="time" value={form.time} onChange={handleChange}>
                    <option value="">Любое</option>
                    {["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ry-form-group ry-form-group--full">
                <label>Комментарий</label>
                <textarea
                  name="comment" value={form.comment} onChange={handleChange} rows={3}
                  placeholder="Расскажите об особенностях питомца, пожеланиях..."
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <button type="submit" className="ry-btn ry-btn--large">
                  Записаться на груминг 🐾
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Отзывы ───────────────────────────────────────────────────────────────────

function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useFadeIn();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const perPage = isMobile ? 1 : 3;

  const next = useCallback(() => setCurrent((c) => (c + 1) % REVIEWS.length), []);

  const startTimer = useCallback(() => { timerRef.current = setTimeout(next, 4000); }, [next]);
  const stopTimer = useCallback(() => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => { startTimer(); return stopTimer; }, [current, startTimer, stopTimer]);

  const visible = Array.from({ length: perPage }, (_, i) => REVIEWS[(current + i) % REVIEWS.length]);

  return (
    <section className="ry-section ry-section--light ry-section--geo">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Отзывы клиентов</h2>
        <p className="ry-section-sub">Яндекс Карты · рейтинг 5.0 · 75 отзывов</p>
        <div
          className="ry-reviews"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          {visible.map((r, i) => (
            <div key={`${current}-${i}`} className="ry-review-card">
              <div className="ry-review-stars">{"★".repeat(r.rating)}</div>
              <p className="ry-review-text">"{r.text}"</p>
              <div className="ry-review-author">
                <strong>{r.name}</strong>
                <span>{r.pet}</span>
              </div>
              <div className="ry-review-source">{r.source}</div>
            </div>
          ))}
        </div>
        <div className="ry-dots">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              className={`ry-dot ${i === current ? "ry-dot--active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Контакты ─────────────────────────────────────────────────────────────────

function ContactsSection() {
  const ref = useFadeIn();

  return (
    <section className="ry-section ry-section--cream" id="contacts">
      <div className="ry-container ry-fade" ref={ref}>
        <h2 className="ry-section-title">Как нас найти</h2>
        <div className="ry-contacts">
          <div className="ry-contacts-info">
            <div className="ry-contact-item">
              <span className="ry-contact-icon">📍</span>
              <div>
                <strong>Адрес</strong>
                <p>г. Волгоград, ул. Николая Отрады, 22б</p>
              </div>
            </div>
            <div className="ry-contact-item">
              <span className="ry-contact-icon">📞</span>
              <div>
                <strong>Телефон</strong>
                {/* TODO: Реальный номер телефона */}
                <p><a href="tel:+70000000000" className="ry-phone-link">+7 (000) 000-00-00</a></p>
              </div>
            </div>
            <div className="ry-contact-item">
              <span className="ry-contact-icon">🕐</span>
              <div>
                <strong>Часы работы</strong>
                {/* TODO: Реальные часы работы */}
                <p>Пн–Пт: 10:00–20:00</p>
                <p>Сб–Вс: 10:00–19:00</p>
              </div>
            </div>
            <a href="#booking" className="ry-btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
              Записаться онлайн
            </a>
          </div>
          <div className="ry-contacts-map">
            {/* TODO: Вставить iframe от Яндекс Карт с реальным адресом */}
            <div className="ry-map-placeholder">
              <span style={{ fontSize: "3rem" }}>🗺️</span>
              <p>Карта появится здесь</p>
              <small>Добавьте iframe от Яндекс Карт</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Футер ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="ry-footer">
      <div className="ry-container">
        <div className="ry-footer-inner">
          <div className="ry-footer-logo">🐾 Dog&Cat <span>Рыжуля</span></div>
          <p className="ry-footer-copy">© 2024 Зоосалон Dog&Cat Рыжуля. Все права защищены.</p>
          <a href="#" className="ry-footer-link">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Главная ─────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <div className="ry-landing">
      <Navbar />
      <HeroSection />
      <hr className="ry-divider" />
      <BenefitsSection />
      <hr className="ry-divider" />
      <PricesSection />
      <hr className="ry-divider" />
      <GallerySection />
      <hr className="ry-divider" />
      <MastersSection />
      <hr className="ry-divider" />
      <BookingSection />
      <hr className="ry-divider" />
      <ReviewsSection />
      <hr className="ry-divider" />
      <ContactsSection />
      <Footer />
    </div>
  );
}