import { useState } from 'react';
import { withBase } from '../../lib/base';

const links = [
  { href: withBase('#como-ajudamos'), label: 'Como ajudamos' },
  { href: withBase('#sobre'), label: 'Sobre' },
  { href: withBase('#depoimentos'), label: 'Depoimentos' },
  { href: withBase('#planos'), label: 'Planos' },
  { href: withBase('blog'), label: 'Blog' },
  { href: withBase('#contato'), label: 'Contato' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__since">Desde 1990 na Freguesia do Ó, São Paulo</span>
          <div className="topbar__contacts">
            <a href="tel:+551139333939">(11) 3933-3939</a>
            <a href="https://wa.me/5511925188621" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__bar">
          <a className="site-header__brand" href={withBase('')}>
            <img src={withBase('styllu-logo.png')} alt="" width="36" height="36" />
            <span>
              <span className="site-header__name">Styllu&apos;s</span>
              <span className="site-header__tagline">Assessoria Contábil</span>
            </span>
          </a>

          <nav className="site-header__links" aria-label="Principal">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="site-header__link">
                {link.label}
              </a>
            ))}
          </nav>

          <a className="btn btn-primary site-header__cta" href={withBase('#contato')}>
            Falar com especialista
          </a>

          <button
            type="button"
            className="site-header__menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>

        {open && (
          <div className="container site-header__drawer" id="mobile-menu">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a className="btn btn-primary" href={withBase('#contato')} onClick={() => setOpen(false)}>
              Falar com especialista
            </a>
          </div>
        )}
      </header>
    </>
  );
}
