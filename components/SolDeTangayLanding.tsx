"use client";

import { Children, cloneElement, Fragment, isValidElement, useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
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
  hero: makeMedia("01-hero-private-escape", true),
  escape: makeMedia("02-city-escape-path", true),
  gallery: makeMedia("03-experience-gallery", true),
  experiences: makeMedia("04-signature-experiences", true),
  packages: makeMedia("05-package-ladder", true),
  retreats: {
    mobileVideo: `${mediaBase}/mobile/06-retreats-corporate.mp4`,
    mobileVideoWebm: `${mediaBase}/mobile/06-retreats-corporate.webm`
  },
  location: makeMedia("07-distance-privacy", true),
  close: makeMedia("08-whatsapp-close", true)
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

function makeMedia(slug: string, hasDesktopVideo: boolean): MediaSet {
  return {
    desktopVideo: hasDesktopVideo ? `${mediaBase}/desktop/${slug}.mp4` : undefined,
    desktopVideoWebm: hasDesktopVideo ? `${mediaBase}/desktop/${slug}.webm` : undefined,
    mobileVideo: `${mediaBase}/mobile/${slug}.mp4`,
    mobileVideoWebm: `${mediaBase}/mobile/${slug}.webm`
  };
}

function MotionBlock({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const splitContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 }
  }
};

const splitWordVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

function SplitText({
  text,
  as = "span",
  className
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
}) {
  const words = text.split(" ");
  const content = words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="split-text">
        <motion.span className="split-text-word" variants={splitWordVariants}>
          {word}
        </motion.span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));

  const sharedProps = {
    className,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.2 },
    variants: splitContainerVariants
  };

  if (as === "h1") return <motion.h1 {...sharedProps}>{content}</motion.h1>;
  if (as === "h2") return <motion.h2 {...sharedProps}>{content}</motion.h2>;
  if (as === "h3") return <motion.h3 {...sharedProps}>{content}</motion.h3>;
  return <motion.span {...sharedProps}>{content}</motion.span>;
}

function SectionCounter() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = active;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) {
              bestIdx = idx;
              bestRatio = entry.intersectionRatio;
            }
          }
        }
        if (bestRatio > 0) setActive(bestIdx);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [active]);

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
  pixelsPerSec = 30,
  showHint = false
}: {
  children: React.ReactNode;
  className: string;
  pixelsPerSec?: number;
  showHint?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dragThreshold = 8;
    const horizontalBias = 1.5;
    const resumeDelayMs = 2600;
    let isVisible = false;
    let manualMode = false;
    let dragActive = false;
    let decidedVertical = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let baseTrackX = 0;
    let activePointerId: number | null = null;
    let resumeTimer: number | null = null;
    let suppressClickUntil = 0;

    const updateDuration = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        const durationSec = halfWidth / pixelsPerSec;
        track.style.setProperty("--loop-duration", `${durationSec}s`);
      }
    };

    const syncState = () => {
      if (manualMode) return;
      const shouldRun =
        isVisible &&
        mobileQuery.matches &&
        !reducedMotionQuery.matches &&
        track.scrollWidth > wrapper.clientWidth;
      track.dataset.active = shouldRun ? "true" : "false";
    };

    const getCurrentTrackX = () => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      return matrix.m41;
    };

    const enterManual = () => {
      if (manualMode) return;
      baseTrackX = getCurrentTrackX();
      track.style.animation = "none";
      track.style.transform = `translate3d(${baseTrackX}px, 0, 0)`;
      manualMode = true;
    };

    const scheduleResume = () => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        if (!manualMode) return;
        const currentX = getCurrentTrackX();
        const loopWidth = track.scrollWidth / 2;
        const progress = loopWidth > 0 ? -currentX / loopWidth : 0;
        const normalized = ((progress % 1) + 1) % 1;
        const durationStr = getComputedStyle(track)
          .getPropertyValue("--loop-duration")
          .trim();
        const durationSec = parseFloat(durationStr) || 30;
        const delay = -normalized * durationSec;

        track.style.animation = "";
        track.style.transform = "";
        track.style.animationDelay = `${delay}s`;
        manualMode = false;
        syncState();
      }, resumeDelayMs);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!mobileQuery.matches || reducedMotionQuery.matches) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (resumeTimer !== null) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragActive = false;
      decidedVertical = false;
      activePointerId = e.pointerId;
      try {
        track.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      if (decidedVertical) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (!dragActive) {
        if (Math.abs(dx) < dragThreshold && Math.abs(dy) < dragThreshold) return;
        if (Math.abs(dy) > Math.abs(dx) * horizontalBias) {
          decidedVertical = true;
          try {
            track.releasePointerCapture(e.pointerId);
          } catch {}
          return;
        }
        enterManual();
        dragActive = true;
      }

      let newX = baseTrackX + dx;
      const loopWidth = track.scrollWidth / 2;
      if (loopWidth > 0) {
        while (newX > 0) newX -= loopWidth;
        while (newX < -loopWidth) newX += loopWidth;
      }
      track.style.transform = `translate3d(${newX}px, 0, 0)`;
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      activePointerId = null;
      decidedVertical = false;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}
      if (dragActive) {
        dragActive = false;
        suppressClickUntil = performance.now() + 320;
        scheduleResume();
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (performance.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        syncState();
      },
      { threshold: [0, 0.1, 0.4] }
    );

    const resizeObserver = new ResizeObserver(() => {
      updateDuration();
      syncState();
    });

    updateDuration();
    syncState();
    observer.observe(wrapper);
    resizeObserver.observe(track);
    mobileQuery.addEventListener("change", syncState);
    reducedMotionQuery.addEventListener("change", syncState);

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerEnd);
    track.addEventListener("pointercancel", onPointerEnd);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      mobileQuery.removeEventListener("change", syncState);
      reducedMotionQuery.removeEventListener("change", syncState);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerEnd);
      track.removeEventListener("pointercancel", onPointerEnd);
      track.removeEventListener("click", onClickCapture, true);
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
    };
  }, [pixelsPerSec]);

  const loopCopies = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    const element = child as React.ReactElement<{
      className?: string;
      tabIndex?: number;
      "aria-hidden"?: boolean;
    }>;

    return cloneElement(element, {
      key: `loop-copy-${index}`,
      className: [element.props.className, "loop-clone"].filter(Boolean).join(" "),
      "aria-hidden": true,
      tabIndex: -1
    });
  });

  return (
    <motion.div
      ref={wrapperRef}
      className={`${className} auto-loop-rail`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={trackRef} className="rail-track" data-active="false">
        {children}
        {loopCopies}
      </div>
      {showHint ? (
        <span className="rail-hint" aria-hidden="true">
          <ArrowLeft size={11} strokeWidth={2} />
          Desliza
        </span>
      ) : null}
    </motion.div>
  );
}

function BackgroundMedia({
  mediaSet,
  eager = false
}: {
  mediaSet: MediaSet;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(eager);
  const [isInView, setIsInView] = useState(eager);
  const hasDesktopVideo = Boolean(mediaSet.desktopVideo);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const videos = node.querySelectorAll<HTMLVideoElement>("video");
    if (videos.length === 0) return;
    if (isInView) {
      videos.forEach((v) => {
        if (v.paused) v.play().catch(() => {});
      });
    } else {
      videos.forEach((v) => {
        if (!v.paused) v.pause();
      });
    }
  }, [isInView, shouldLoadVideo]);

  return (
    <div ref={ref} className="media-layer" aria-hidden="true">
      {shouldLoadVideo ? (
        <video
          className="section-video"
          muted
          loop
          playsInline
          autoPlay
          preload={eager ? "auto" : "metadata"}
        >
          {mediaSet.mobileVideoWebm ? (
            <source
              media={hasDesktopVideo ? "(max-width: 760px)" : undefined}
              src={mediaSet.mobileVideoWebm}
              type="video/webm"
            />
          ) : null}
          {mediaSet.mobileVideo ? (
            <source
              media={hasDesktopVideo ? "(max-width: 760px)" : undefined}
              src={mediaSet.mobileVideo}
              type="video/mp4"
            />
          ) : null}
          {mediaSet.desktopVideoWebm ? (
            <source src={mediaSet.desktopVideoWebm} type="video/webm" />
          ) : null}
          {mediaSet.desktopVideo ? (
            <source src={mediaSet.desktopVideo} type="video/mp4" />
          ) : null}
        </video>
      ) : null}
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
        <motion.nav
          className="mobile-nav"
          aria-label="Navegación móvil"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {nav.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            Reservar por WhatsApp
          </a>
        </motion.nav>
      ) : null}
    </header>
  );
}

export function SolDeTangayLanding() {
  return (
    <main className="landing-shell">
      <Header />

      <SectionCounter />

      <section className="landing-section hero-section" id="inicio">
        <BackgroundMedia mediaSet={media.hero} eager />
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
        <BackgroundMedia mediaSet={media.escape} />
        <div className="section-tint split-tint" />
        <div className="section-inner aligned-left">
          <MotionBlock className="copy-panel transparent-panel">
            <h2>Lejos del bullicio. Cerca de tu casa.</h2>
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
        <BackgroundMedia mediaSet={media.gallery} />
        <div className="section-tint gallery-tint" />
        <div className="section-inner gallery-inner">
          <MotionBlock className="gallery-copy">
            <h2>Pedidas. Cumpleaños. Cenas en familia.</h2>
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
        <BackgroundMedia mediaSet={media.experiences} />
        <div className="section-tint light-tint" />
        <div className="section-inner experiences-inner">
          <MotionBlock className="cream-panel experience-card">
            <h2>Momentos privados, creado para ti</h2>
            <p>
              Pedidas, cumpleaños, aniversarios, reuniones familiares,
              almuerzos privados y eventos de empresa. Cada formato se ajusta
              a tu lista, tu mood y tu agenda. Tú decides el tipo de día —
              nosotros armamos el escenario.
            </p>
            <CtaButton>Diseñar mi evento</CtaButton>
          </MotionBlock>

          <AutoLoopRail className="experience-list" pixelsPerSec={30} showHint>
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
        <BackgroundMedia mediaSet={media.packages} />
        <div className="section-tint package-tint" />
        <div className="section-inner packages-inner">
          <MotionBlock className="section-heading centered">
            <h2>Tres formatos. Una sola garantía: el lugar es tuyo.</h2>
            <p>
              Desde una pedida íntima hasta una boda que toma el field
              completo. El precio se ajusta a tu lista y al nivel de servicio.
              La privacidad y el coordinador dedicado vienen incluidos siempre,
              nunca son extras.
            </p>
          </MotionBlock>

          <AutoLoopRail className="tier-grid" pixelsPerSec={28}>
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
        <BackgroundMedia mediaSet={media.retreats} />
        <div className="section-tint retreat-tint" />
        <div className="section-inner retreats-inner">
          <MotionBlock className="retreat-copy">
            <h2>El field para tus encuentros más privados</h2>
            <p>
              Almuerzos familiares que prefieres en privado, parrillas con
              amigos sin público alrededor, retiros y mañanas tranquilas. Sin
              gente desconocida, sin eventos paralelos, sin sorpresas en la
              logística.
            </p>
            <CtaButton>Reservar mi fecha</CtaButton>
          </MotionBlock>

          <AutoLoopRail className="format-list" pixelsPerSec={26}>
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
        <BackgroundMedia mediaSet={media.location} />
        <div className="section-tint location-tint" />
        <div className="section-inner location-inner">
          <MotionBlock className="location-copy">
            <h2>Lejos del ruido. A 30 minutos del centro.</h2>
            <p>
              Acceso asfaltado, parqueo propio dentro del field, sin cruzar
              pueblo ni esquivar tráfico. Llegas, estacionas y desde ese
              momento estás en otra dimensión, sin haber perdido media jornada
              en la ruta.
            </p>
            <AutoLoopRail className="location-proof" pixelsPerSec={24}>
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
        <BackgroundMedia mediaSet={media.close} />
        <div className="section-tint close-tint" />
        <div className="section-inner close-inner">
          <MotionBlock className="close-copy">
            <h2>Hablemos de tu evento</h2>
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
