"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Flame,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "escape", label: "Escape" },
  { id: "galeria", label: "Galería" },
  { id: "experiencias", label: "Experiencias" },
  { id: "paquetes", label: "Paquetes" },
  { id: "retiros", label: "Retiros" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "contacto", label: "Contacto" }
];

type MediaSet = {
  desktopVideo?: string;
  desktopVideoWebm?: string;
  mobileVideo?: string;
  mobileVideoWebm?: string;
};

const mediaBase = "/sol-de-tangay/images";

const media = {
  hero: makeMedia("01-hero-private-escape"),
  escape: makeMedia("02-city-escape-path"),
  gallery: makeMedia("03-experience-gallery"),
  experiences: makeMedia("04-signature-experiences"),
  packages: makeMedia("05-package-ladder"),
  retreats: makeMedia("06-retreats-corporate", false),
  location: makeMedia("07-distance-privacy"),
  close: makeMedia("08-whatsapp-close")
} satisfies Record<string, MediaSet>;

const nav = [
  { label: "Experiencias", href: "#experiencias" },
  { label: "Retiros", href: "#retiros" },
  { label: "Galería", href: "#galeria" },
  { label: "Ubicación", href: "#ubicacion" }
];

const experienceRows = [
  "Pedidas de mano",
  "Picnic privado",
  "Aniversarios",
  "Cumpleaños",
  "Reuniones familiares",
  "Eventos de empresa"
];

const packageTiers = [
  {
    name: "Íntimo",
    description: "2 a 20 invitados. Pedidas, picnic de aniversario, cena en familia, cumpleaños privado.",
    detail: "Para los momentos donde solo cuenta lo esencial."
  },
  {
    name: "Mediano",
    description: "20 a 80 invitados. Cumpleaños grandes, baby showers, almuerzos familiares, integraciones.",
    detail: "Nuestro formato más solicitado."
  },
  {
    name: "Mayor",
    description: "80 a 250 invitados. Bodas, aniversarios y eventos que toman el field completo.",
    detail: "Coordinación dedicada de inicio a fin."
  }
];

const retreatFormats = [
  { label: "Reuniones familiares", icon: UsersRound },
  { label: "Parrilla privada", icon: Flame },
  { label: "Mañana wellness", icon: Leaf },
  { label: "Retiros ejecutivos", icon: ShieldCheck }
];

const locationProof = [
  "30 minutos del centro",
  "Acceso asfaltado",
  "Parqueo propio",
  "Sin público externo"
];

const whatsappText = encodeURIComponent(
  "Hola, quiero consultar disponibilidad para un evento privado en Sol De Tangay Field Vip. ¿Me ayudan a cotizar?"
);

const whatsappNumber = "51973068950";
const whatsappDisplay = "+51 973 068 950";
const whatsappHref = whatsappNumber
  ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
  : `https://wa.me/?text=${whatsappText}`;

function makeMedia(slug: string, hasDesktopVideo = true): MediaSet {
  return {
    desktopVideo: hasDesktopVideo ? `${mediaBase}/desktop/${slug}.mp4` : undefined,
    desktopVideoWebm: hasDesktopVideo ? `${mediaBase}/desktop/${slug}.webm` : undefined,
    mobileVideo: `${mediaBase}/mobile/${slug}.mp4`,
    mobileVideoWebm: `${mediaBase}/mobile/${slug}.webm`
  };
}

function useActiveSectionId() {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const compactViewport = window.matchMedia("(max-width: 980px)");
    let observer: IntersectionObserver | null = null;

    const activateHashSection = () => {
      const hashId = window.location.hash.replace("#", "");
      if (sections.some((section) => section.id === hashId)) {
        setActiveId((current) => (current === hashId ? current : hashId));
      }
    };

    const stopObserver = () => {
      observer?.disconnect();
      observer = null;
    };

    const startObserver = () => {
      stopObserver();
      activateHashSection();

      if (compactViewport.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          let nearest: { id: string; distance: number } | null = null;
          const centerY = window.innerHeight * 0.5;

          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            const sectionId = entry.target.id;
            const rect = entry.boundingClientRect;
            const sectionCenterY = rect.top + rect.height * 0.5;
            const distance = Math.abs(sectionCenterY - centerY);

            if (!nearest || distance < nearest.distance) {
              nearest = { id: sectionId, distance };
            }
          }

          if (!nearest) return;

          const nextId = nearest.id;
          setActiveId((current) => (current === nextId ? current : nextId));
        },
        {
          rootMargin: "-38% 0px -38% 0px",
          threshold: [0, 0.2, 0.6]
        }
      );

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      }
    };

    startObserver();
    window.addEventListener("hashchange", activateHashSection);
    compactViewport.addEventListener("change", startObserver);

    return () => {
      window.removeEventListener("hashchange", activateHashSection);
      compactViewport.removeEventListener("change", startObserver);
      stopObserver();
    };
  }, []);

  return activeId;
}

function MotionBlock({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function SplitText({
  text,
  as = "span",
  className
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
}) {
  const Tag = as;
  const revealRef = useRef<HTMLHeadingElement | HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const node = revealRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.28
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={revealRef as React.Ref<HTMLHeadingElement & HTMLSpanElement>}
      className={`reveal-text ${revealed ? "is-visible" : ""} ${className ?? ""}`.trim()}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className="reveal-word"
            aria-hidden="true"
            style={{ "--word-index": Math.min(index, 10) } as React.CSSProperties}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

function SectionCounter({ activeId }: { activeId: string }) {
  const active = Math.max(
    0,
    sections.findIndex((section) => section.id === activeId)
  );

  return (
    <aside className="section-counter" aria-hidden="true">
      <span className="section-counter-num">
        {String(active + 1).padStart(2, "0")}
        <span style={{ opacity: 0.5 }}> / 0{sections.length}</span>
      </span>
      <span>{sections[active].label}</span>
      <span className="section-counter-bar">
        {sections.map((_, i) => (
          <i key={i} className={i === active ? "is-active" : undefined} />
        ))}
      </span>
    </aside>
  );
}


function AutoLoopRail({
  children,
  className,
  showHint = false
}: {
  children: React.ReactNode;
  className: string;
  showHint?: boolean;
}) {
  return (
    <div className={`${className} auto-loop-rail`}>
      <div className="rail-track">
        {children}
      </div>
      {showHint ? (
        <span className="rail-hint" aria-hidden="true">
          <ArrowLeft size={11} strokeWidth={2} />
          Desliza
        </span>
      ) : null}
    </div>
  );
}

function BackgroundMedia({
  mediaSet,
  sectionId,
  eager = false
}: {
  mediaSet: MediaSet;
  sectionId: string;
  eager?: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(eager);
  const hasDesktopVideo = Boolean(mediaSet.desktopVideo);

  useEffect(() => {
    const layer = layerRef.current;
    const section = layer?.closest(".landing-section");

    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setIsVisible(visible);
      },
      {
        rootMargin: "180px 0px",
        threshold: 0.12
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }, [isVisible]);

  return (
    <div className="media-layer" ref={layerRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="section-video"
        data-section={sectionId}
        data-active={isVisible ? "true" : "false"}
        muted
        loop
        playsInline
        preload="auto"
      >
        {mediaSet.mobileVideo ? (
          <source
            media={hasDesktopVideo ? "(max-width: 760px)" : undefined}
            src={mediaSet.mobileVideo}
            type="video/mp4"
          />
        ) : null}
        {mediaSet.mobileVideoWebm ? (
          <source
            media={hasDesktopVideo ? "(max-width: 760px)" : undefined}
            src={mediaSet.mobileVideoWebm}
            type="video/webm"
          />
        ) : null}
        {mediaSet.desktopVideo ? (
          <source media="(min-width: 761px)" src={mediaSet.desktopVideo} type="video/mp4" />
        ) : null}
        {mediaSet.desktopVideoWebm ? (
          <source media="(min-width: 761px)" src={mediaSet.desktopVideoWebm} type="video/webm" />
        ) : null}
      </video>
    </div>
  );
}

function CtaButton({
  children,
  variant = "primary",
  href = whatsappHref
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
}) {
  const handleClick = () => {
    if (variant === "primary" && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  return (
    <a
      className={`cta-button ${variant}`}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      onClick={handleClick}
    >
      {variant === "primary" ? <MessageCircle size={18} strokeWidth={1.8} /> : null}
      <span>{children}</span>
      {variant === "ghost" ? <ArrowUpRight size={17} strokeWidth={1.7} /> : null}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Sol De Tangay Field Vip">
        <span>Sol De Tangay</span>
        <small>Field Vip</small>
      </a>

      <nav className="desktop-nav" aria-label="Navegación principal">
        {nav.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
        <MessageCircle size={17} strokeWidth={1.8} />
        <span>WhatsApp</span>
      </a>

      <button
        className="mobile-menu-button"
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <nav
          className="mobile-nav"
          aria-label="Navegación móvil"
        >
          {nav.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            Reservar por WhatsApp
          </a>
        </nav>
      ) : null}
    </header>
  );
}

export function SolDeTangayLanding() {
  const activeSectionId = useActiveSectionId();

  return (
    <main className="landing-shell">
      <Header />

      <SectionCounter activeId={activeSectionId} />

      <section className="landing-section hero-section" id="inicio">
        <BackgroundMedia sectionId="inicio" mediaSet={media.hero} eager />
        <div className="section-tint hero-tint" />
        <div className="section-inner hero-inner">
          <MotionBlock className="hero-copy">
            <SplitText as="h1" text="Tu evento privado, fuera de la ciudad." />
            <p>
              A 30 minutos del centro de Chimbote. Un solo evento al día.
              Coordinador dedicado.
            </p>
            <div className="button-row">
              <CtaButton>Reservar por WhatsApp</CtaButton>
              <CtaButton variant="ghost" href="#experiencias">
                Ver experiencias
              </CtaButton>
            </div>
          </MotionBlock>
          <div className="scroll-cue">
            <span />
            Desliza
          </div>
        </div>
      </section>

      <section className="landing-section escape-section" id="escape">
        <BackgroundMedia sectionId="escape" mediaSet={media.escape} />
        <div className="section-tint split-tint" />
        <div className="section-inner aligned-left">
          <MotionBlock className="copy-panel transparent-panel">
            <SplitText as="h2" text="Lejos del bullicio. Cerca de tu casa." />
            <p>
              La mayoría de campestres te quitan medio día en traslado y al
              llegar te toca compartirlos con desconocidos. Sol De Tangay está
              a 30 minutos del centro, y mientras tú estés aquí el field es
              solo tuyo.
            </p>
            <span className="proof-line">30 minutos del centro. Privacidad total.</span>
            <CtaButton>Consultar disponibilidad</CtaButton>
          </MotionBlock>
        </div>
      </section>

      <section className="landing-section gallery-section" id="galeria">
        <BackgroundMedia sectionId="galeria" mediaSet={media.gallery} />
        <div className="section-tint gallery-tint" />
        <div className="section-inner gallery-inner">
          <MotionBlock className="gallery-copy">
            <SplitText as="h2" text="Pedidas. Cumpleaños. Cenas en familia." />
            <p>
              Cada montaje se diseña contigo antes del día. Lo que ves aquí es
              exactamente lo que vas a recibir: sin sorpresas, sin
              improvisaciones, sin compartir el lugar con nadie más.
            </p>
          </MotionBlock>

          <MotionBlock className="moment-rail">
            {["Pedida de mano", "Picnic privado", "Cena en familia", "Cumpleaños íntimo"].map(
              (moment, index) => (
                <div className="moment-row" key={moment}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{moment}</strong>
                  <i />
                </div>
              )
            )}
            <CtaButton>Abrir WhatsApp</CtaButton>
          </MotionBlock>
        </div>
      </section>

      <section className="landing-section experiences-section" id="experiencias">
        <BackgroundMedia sectionId="experiencias" mediaSet={media.experiences} />
        <div className="section-tint light-tint" />
        <div className="section-inner experiences-inner">
          <MotionBlock className="cream-panel experience-card">
            <SplitText as="h2" text="Momentos privados, creado para ti" />
            <p>
              Pedidas, cumpleaños, aniversarios, reuniones familiares,
              almuerzos privados y eventos de empresa. Cada formato se ajusta
              a tu lista, tu mood y tu agenda. Tú decides el tipo de día —
              nosotros armamos el escenario.
            </p>
            <CtaButton>Diseñar mi evento</CtaButton>
          </MotionBlock>

          <AutoLoopRail className="experience-list" showHint>
            {experienceRows.map((row, index) => (
              <a href={whatsappHref} target="_blank" rel="noreferrer" key={row}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{row}</strong>
                <ArrowUpRight size={16} strokeWidth={1.7} />
              </a>
            ))}
          </AutoLoopRail>
        </div>
      </section>

      <section className="landing-section packages-section" id="paquetes">
        <BackgroundMedia sectionId="paquetes" mediaSet={media.packages} />
        <div className="section-tint package-tint" />
        <div className="section-inner packages-inner">
          <MotionBlock className="section-heading centered">
            <SplitText as="h2" text="Tres formatos. Una sola garantía: el lugar es tuyo." />
            <p>
              Desde una pedida íntima hasta una boda que toma el field
              completo. El precio se ajusta a tu lista y al nivel de servicio.
              La privacidad y el coordinador dedicado vienen incluidos siempre,
              nunca son extras.
            </p>
          </MotionBlock>

          <AutoLoopRail className="tier-grid">
            {packageTiers.map((tier, index) => (
              <article className={`tier-card tier-${index}`} key={tier.name}>
                <div className="tier-mark">{index + 1}</div>
                <h3>{tier.name}</h3>
                <p>{tier.description}</p>
                <small>{tier.detail}</small>
              </article>
            ))}
          </AutoLoopRail>

          <MotionBlock className="package-action">
            <CtaButton>Cotizar por WhatsApp</CtaButton>
          </MotionBlock>
        </div>
      </section>

      <section className="landing-section retreats-section" id="retiros">
        <BackgroundMedia sectionId="retiros" mediaSet={media.retreats} />
        <div className="section-tint retreat-tint" />
        <div className="section-inner retreats-inner">
          <MotionBlock className="retreat-copy">
            <SplitText as="h2" text="El field para tus encuentros más privados" />
            <p>
              Almuerzos familiares que prefieres en privado, parrillas con
              amigos sin público alrededor, retiros y mañanas tranquilas. Sin
              gente desconocida, sin eventos paralelos, sin sorpresas en la
              logística.
            </p>
            <CtaButton>Reservar mi fecha</CtaButton>
          </MotionBlock>

          <AutoLoopRail className="format-list">
            {retreatFormats.map(({ label, icon: Icon }) => (
              <a href={whatsappHref} target="_blank" rel="noreferrer" key={label}>
                <Icon size={21} strokeWidth={1.45} />
                <span>{label}</span>
              </a>
            ))}
          </AutoLoopRail>
        </div>
      </section>

      <section className="landing-section location-section" id="ubicacion">
        <BackgroundMedia sectionId="ubicacion" mediaSet={media.location} />
        <div className="section-tint location-tint" />
        <div className="section-inner location-inner">
          <MotionBlock className="location-copy">
            <SplitText as="h2" text="Lejos del ruido. A 30 minutos del centro." />
            <p>
              Acceso asfaltado, parqueo propio dentro del field, sin cruzar
              pueblo ni esquivar tráfico. Llegas, estacionas y desde ese
              momento estás en otra dimensión, sin haber perdido media jornada
              en la ruta.
            </p>
            <AutoLoopRail className="location-proof">
              {locationProof.map((item) => (
                <span key={item}>
                  <Check size={14} />
                  {item}
                </span>
              ))}
            </AutoLoopRail>
            <CtaButton>Envíame la ubicación</CtaButton>
          </MotionBlock>
        </div>
      </section>

      <section className="landing-section close-section" id="contacto">
        <BackgroundMedia sectionId="contacto" mediaSet={media.close} />
        <div className="section-tint close-tint" />
        <div className="section-inner close-inner">
          <MotionBlock className="close-copy">
            <SplitText as="h2" text="Hablemos de tu evento" />
            <p>
              Cuéntanos qué momento estás planeando, fecha tentativa y cuántos
              invitados. En 24 horas tienes una cotización con todo claro:
              montaje, comida, coordinación y precio. Si prefieres, te
              agendamos una visita al field antes de reservar.
            </p>
          </MotionBlock>

          <MotionBlock className="whatsapp-module">
            <div className="module-row">
              <Leaf size={18} strokeWidth={1.55} />
              <span>Tipo de evento</span>
              <strong>Pedida, cumpleaños, aniversario o reunión</strong>
            </div>
            <div className="module-row">
              <CalendarDays size={18} strokeWidth={1.55} />
              <span>Fecha tentativa</span>
              <strong>Confirmamos disponibilidad</strong>
            </div>
            <div className="module-row">
              <UsersRound size={18} strokeWidth={1.55} />
              <span>N° de invitados</span>
              <strong>Desde 2 hasta 250 personas</strong>
            </div>
            <CtaButton>Continuar por WhatsApp</CtaButton>
            <small>Cotización en 24 h. Visita al lugar disponible antes de reservar.</small>
          </MotionBlock>

          <footer className="site-footer">
            <div className="footer-top">
              <span className="footer-mark">Sol De Tangay Field Vip</span>
              <nav className="footer-nav" aria-label="Navegación del pie">
                <a href="#experiencias">Experiencias</a>
                <a href="#retiros">Retiros</a>
                <a href="#galeria">Galería</a>
                <a href="#ubicacion">
                  <MapPin size={13} /> Ubicación
                </a>
              </nav>
            </div>

            <div className="footer-contact">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle size={13} strokeWidth={1.7} />
                {whatsappDisplay}
              </a>
              <a href="mailto:soldetangay@gmail.com">soldetangay@gmail.com</a>
            </div>

            <ul className="footer-legal">
              <li>
                <em>Sol de Tangay S.A.C.</em>
              </li>
              <li>
                <span>RUC</span> 20615096718
              </li>
              <li>
                <span>Partida</span> 11196600
              </li>
              <li>
                <span>BCP soles</span> 3107318013035
              </li>
            </ul>
          </footer>
        </div>
      </section>
    </main>
  );
}
