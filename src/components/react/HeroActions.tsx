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
        <button type="button" className="btn btn-primary" onClick={() => start('abrir')}>
          Quero abrir minha empresa
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => start('tenho')}>
          Já tenho uma empresa
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => start('trocar')}>
          Quero trocar de contador →
        </button>
      </div>
      <p className="hero__cta-note">Abertura 100% guiada. Sem custo. Retorno em até 24h.</p>

      <DiagnosticoModal open={open} onClose={() => setOpen(false)} initialMomento={momento} />
    </>
  );
}
