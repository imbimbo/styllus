import { useState } from 'react';
import DiagnosticoModal from './DiagnosticoModal';

type Momento = 'abrir' | 'tenho' | 'trocar';

export default function HeroActions() {
  const [open, setOpen] = useState(false);
  const [momento, setMomento] = useState<Momento | undefined>();

  function start(next: Momento) {
    setMomento(next);
    setOpen(true);
  }

  return (
    <>
      <div className="hero__actions">
        <button type="button" className="btn btn-primary" onClick={() => start('tenho')}>
          Falar com especialista
        </button>
      </div>
      <p className="hero__cta-note">
        Algumas perguntas rápidas e um especialista volta com o melhor caminho.{' '}
        <a href="#comece">Comece por aqui!</a>
      </p>

      <DiagnosticoModal open={open} onClose={() => setOpen(false)} initialMomento={momento} />
    </>
  );
}
