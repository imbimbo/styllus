import { useState } from 'react';

type Answers = {
  stage: string;
  team: string;
  need: string;
};

const questions = [
  {
    key: 'stage' as const,
    title: 'Em que momento está a sua empresa?',
    options: [
      { value: 'opening', label: 'Vou abrir agora' },
      { value: 'running', label: 'Já está em funcionamento' },
      { value: 'switching', label: 'Quero trocar de contador' },
    ],
  },
  {
    key: 'team' as const,
    title: 'Você tem funcionários?',
    options: [
      { value: 'none', label: 'Ainda não' },
      { value: 'few', label: 'Sim, até 10' },
      { value: 'many', label: 'Sim, mais de 10' },
    ],
  },
  {
    key: 'need' as const,
    title: 'Qual é a sua maior prioridade?',
    options: [
      { value: 'tax', label: 'Impostos e obrigações em dia' },
      { value: 'reports', label: 'Números claros para decidir' },
      { value: 'finance', label: 'Rotina financeira / BPO' },
    ],
  },
];

function recommend(answers: Answers) {
  if (answers.need === 'finance' || answers.team === 'many') {
    return {
      plan: 'Premium',
      reason: 'Com operação financeira e mais complexidade, o Premium cobre BPO e consultoria estratégica.',
    };
  }
  if (answers.need === 'reports' || answers.team === 'few') {
    return {
      plan: 'Ouro',
      reason: 'Para visão gerencial e acompanhamento consultivo mensal, o Ouro costuma ser o caminho.',
    };
  }
  if (answers.team === 'few' || answers.stage === 'switching') {
    return {
      plan: 'Prata',
      reason: 'Com folha e rotinas trabalhistas, o Prata traz tranquilidade para crescer.',
    };
  }
  return {
    plan: 'Bronze',
    reason: 'Para começar com a base fiscal organizada, o Bronze é um ótimo ponto de partida.',
  };
}

const WA = 'https://wa.me/5511910155687';

export default function PlanQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ stage: '', team: '', need: '' });
  const [done, setDone] = useState(false);

  const current = questions[step];

  function choose(value: string) {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({ stage: '', team: '', need: '' });
    setDone(false);
  }

  if (done) {
    const result = recommend(answers);
    const message = `Olá! Fiz o quiz de planos e o indicado foi ${result.plan}. Quero solicitar uma proposta.`;
    return (
      <div className="quiz-panel">
        <p className="eyebrow">Sugestão</p>
        <h3 className="quiz-panel__result-title">Plano {result.plan}</h3>
        <p className="quiz-panel__result-text">{result.reason}</p>
        <div className="quiz-actions">
          <a
            className="btn btn-primary"
            href={`${WA}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar proposta
          </a>
          <button type="button" className="btn btn-outline" onClick={reset}>
            Refazer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <p className="eyebrow">
        Pergunta {step + 1} de {questions.length}
      </p>
      <h3 className="quiz-panel__title">{current.title}</h3>
      <div className="quiz-options">
        {current.options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="intent-card"
            onClick={() => choose(option.value)}
          >
            <strong>{option.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
