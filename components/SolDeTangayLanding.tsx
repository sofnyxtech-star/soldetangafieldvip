"use client";

import { useEffect, useState } from "react";
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

function useActiveSectionId() {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      const centerY = window.innerHeight * 0.5;
      let nextId = sections[0].id;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= centerY && rect.bottom >= centerY) {
          nextId = section.id;
          break;
        }

        const distance = Math.min(Math.abs(rect.top - centerY), Math.abs(rect.bottom - centerY));
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextId = section.id;
        }
      }

      setActiveId((current) => (current === nextId ? current : nextId));
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    const activateHashSection = () => {
      const hashId = window.location.hash.replace("#", "");
      if (sections.some((section) => section.id === hashId)) {
        setActiveId((current) => (current === hashId ? current : hashId));
      }
    };

    updateActiveSection();
    activateHashSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", activateHashSection);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", activateHashSection);
      if (rafId) window.cancelAnimationFrame(rafId);
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
  return <Tag className={className}>{text}</Tag>;
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

function BackgroundMedia() {
  return <div className="media-layer" data-media-disabled="true" aria-hidden="true" />;
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
        <BackgroundMedia />
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
