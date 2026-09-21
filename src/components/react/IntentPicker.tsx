import { useMemo, useState } from 'react';

const intents = [
  {
    id: 'abrir',
    title: 'Quero abrir minha empresa',
    description: 'Do CNPJ ao primeiro imposto, com alguém explicando cada passo.',
    message: 'Olá! Quero abrir minha empresa e gostaria de orientação da Styllu\'s.',
  },
  {
    id: 'trocar',
    title: 'Quero trocar de contador',
    description: 'A transição é mais simples do que parece. Cuidamos dela por você.',
    message: 'Olá! Quero trocar de contador e entender como a Styllu\'s pode ajudar na transição.',
  },
  {
    id: 'financeiro',
    title: 'Quero organizar o financeiro',
    description: 'Contas em ordem, fluxo de caixa claro e menos surpresa no fim do mês.',
    message: 'Olá! Quero organizar o financeiro da minha empresa com a Styllu\'s.',
  },
  {
    id: 'impostos',
    title: 'Quero entender meus impostos',
    description: 'Saber quanto paga, por que paga e o que pode ser feito legalmente.',
    message: 'Olá! Quero entender melhor meus impostos e oportunidades tributárias.',
  },
  {
    id: 'crescendo',
    title: 'Minha empresa está crescendo',
    description: 'Mais equipe, mais números, mais decisões, com acompanhamento próximo.',
    message: 'Olá! Minha empresa está crescendo e preciso de assessoria mais completa.',
  },
  {
    id: 'falar',
    title: 'Só quero falar com alguém',
    description: 'Sem formulário longo: conte sua dúvida e a gente te orienta.',
    message: 'Olá! Gostaria de falar com um especialista da Styllu\'s.',
  },
];

const WA = 'https://wa.me/5511937746793';

export default function IntentPicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = useMemo(() => intents.find((i) => i.id === selected), [selected]);

  return (
    <div>
      <div className="intent-grid">
        {intents.map((intent) => (
          <button
            key={intent.id}
            type="button"
            className="intent-card"
            aria-pressed={selected === intent.id}
            onClick={() => setSelected(intent.id)}
          >
            <strong>{intent.title}</strong>
            <span>{intent.description}</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="intent-actions">
          <a
            className="btn btn-primary"
            href={`${WA}?text=${encodeURIComponent(current.message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuar no WhatsApp
          </a>
          <a className="btn btn-outline" href="#contato">
            Prefiro o formulário
          </a>
        </div>
      )}
    </div>
  );
}
