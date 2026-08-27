import { useState } from 'react';

const links = [
  { href: '/#como-ajudamos', label: 'Como ajudamos' },
  { href: '/#planos', label: 'Planos' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#depoimentos', label: 'Depoimentos' },
  { href: '/#contato', label: 'Contato' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__shell">
        <div className="nav-pill">
          <a className="nav-pill__brand" href="/">
            Styllu&apos;s
          </a>

          <nav className="nav-pill__links" aria-label="Principal">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="nav-pill__link">
                {link.label}
              </a>
            ))}
          </nav>

          <a className="nav-pill__cta" href="/#contato">
            Falar com especialista
          </a>

          <button
            type="button"
            className="nav-pill__menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <div className="nav-pill__drawer" id="mobile-menu">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a className="btn btn-primary" href="/#contato" onClick={() => setOpen(false)}>
              Falar com especialista
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
