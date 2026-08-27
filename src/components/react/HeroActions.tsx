import { useState } from 'react';
import DiagnosticoModal from './DiagnosticoModal';

type Preset = {
  momento?: string;
  necessidade?: string;
};

export default function HeroActions() {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>({});

  function start(next: Preset) {
    setPreset(next);
    setOpen(true);
  }

  return (
    <>
      <div className="hero__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => start({ momento: 'abrir', necessidade: 'Abrir empresa' })}
        >
          Quero abrir minha empresa
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => start({ momento: 'tenho' })}>
          Já tenho uma empresa
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => start({ momento: 'trocar', necessidade: 'Não sei ainda' })}
        >
          Quero trocar de contador →
        </button>
      </div>
      <p className="hero__cta-note">Abertura 100% guiada. Sem custo. Retorno em até 24h.</p>

      <DiagnosticoModal
        open={open}
        onClose={() => setOpen(false)}
        initialMomento={preset.momento}
        initialNecessidade={preset.necessidade}
      />
    </>
  );
}
