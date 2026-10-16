import { useMemo, useState } from 'react';
import DiagnosticoModal from './DiagnosticoModal';

type Momento = 'abrir' | 'tenho' | 'trocar';

const intents: { id: string; title: string; description: string; momento?: Momento }[] = [
  {
    id: 'crescendo',
    title: 'Minha empresa está crescendo',
    description: 'Simples ou Lucro Presumido, com equipe e mais decisão todo mês.',
    momento: 'tenho',
  },
  {
    id: 'impostos',
    title: 'Quero entender meus impostos',
    description: 'Saber quanto paga, por que paga e o que pode ser feito legalmente.',
    momento: 'tenho',
  },
  {
    id: 'financeiro',
    title: 'Quero organizar o financeiro',
    description: 'Contas em ordem, fluxo de caixa claro e menos surpresa no fim do mês.',
    momento: 'tenho',
  },
  {
    id: 'trocar',
    title: 'Quero trocar de contador',
    description: 'A transição é mais simples do que parece. Cuidamos dela por você.',
    momento: 'trocar',
  },
  {
    id: 'abrir',
    title: 'Quero abrir minha empresa',
    description: 'Abertura guiada, com o primeiro honorário grátis ao fechar contrato.',
    momento: 'abrir',
  },
  {
    id: 'falar',
    title: 'Só quero falar com alguém',
    description: 'Fale diretamente com um especialista!',
  },
];

const WA_FALAR = `https://wa.me/5511925188621?text=${encodeURIComponent("Olá! Quero falar com um especialista da Styllu's.")}`;

export default function IntentPicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const current = useMemo(() => intents.find((i) => i.id === selected), [selected]);

  function choose(id: string) {
    setSelected(id);
    if (id === 'falar') {
      window.open(WA_FALAR, '_blank', 'noopener,noreferrer');
      return;
    }
    setFormOpen(true);
  }

  return (
    <div>
      <div className="intent-grid">
        {intents.map((intent) => (
          <button
            key={intent.id}
            type="button"
            className="intent-card"
            aria-pressed={selected === intent.id}
            onClick={() => choose(intent.id)}
          >
            <strong>{intent.title}</strong>
            <span>{intent.description}</span>
          </button>
        ))}
      </div>

      <DiagnosticoModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialMomento={current?.momento}
      />
    </div>
  );
}
