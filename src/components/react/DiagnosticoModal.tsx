import { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const WA_NUMBER = '5511910155687';

const MOMENTO_LABELS: Record<string, string> = {
  abrir: 'Quero abrir minha empresa',
  tenho: 'Já tenho uma empresa',
  trocar: 'Quero trocar de contador',
};

type Answers = {
  momento?: string;
  segmento?: string;
  tamanho?: string;
  necessidade?: string;
  financeiro?: string;
  nome?: string;
  whatsapp?: string;
};

const STEPS = [
  {
    key: 'momento' as const,
    question: 'Qual é o seu momento agora?',
    help: 'Escolha a opção que mais se parece com a sua situação.',
    options: [
      { value: 'abrir', label: 'Quero abrir minha empresa' },
      { value: 'tenho', label: 'Já tenho uma empresa' },
      { value: 'trocar', label: 'Quero trocar de contador' },
    ],
  },
  {
    key: 'segmento' as const,
    question: 'Em que área sua empresa atua?',
    help: 'Isso ajuda a entender as obrigações do seu negócio.',
    options: [
      { value: 'Comércio', label: 'Comércio ou loja' },
      { value: 'Serviços', label: 'Prestação de serviços' },
      { value: 'Saúde', label: 'Saúde, clínica ou consultório' },
      { value: 'Alimentação', label: 'Alimentação ou food service' },
      { value: 'Indústria', label: 'Indústria ou produção' },
      { value: 'Outro', label: 'Outro segmento' },
    ],
  },
  {
    key: 'tamanho' as const,
    question: 'Quantas pessoas trabalham com você?',
    help: 'Considere sócios e funcionários registrados.',
    options: [
      { value: 'Ainda nenhum', label: 'Ainda nenhum' },
      { value: '1 a 5', label: '1 a 5 pessoas' },
      { value: '6 a 20', label: '6 a 20 pessoas' },
      { value: 'Mais de 20', label: 'Mais de 20 pessoas' },
    ],
  },
  {
    key: 'necessidade' as const,
    question: 'O que você mais precisa resolver?',
    help: 'Pode escolher o ponto mais urgente.',
    options: [
      { value: 'Abrir empresa', label: 'Abrir a empresa do jeito certo' },
      { value: 'Impostos', label: 'Entender e organizar os impostos' },
      { value: 'Folha e equipe', label: 'Cuidar da folha e da equipe' },
      { value: 'Relatórios', label: 'Ter relatórios para decidir' },
      { value: 'Financeiro', label: 'Organizar o financeiro' },
      { value: 'Não sei ainda', label: 'Ainda não sei — quero orientação' },
    ],
  },
  {
    key: 'financeiro' as const,
    question: "Quer que a Styllu's cuide também da rotina financeira?",
    help: 'Contas a pagar e receber, conciliações e fluxo de caixa.',
    options: [
      { value: 'Sim', label: 'Sim, isso me interessa' },
      { value: 'Talvez', label: 'Talvez, quero entender melhor' },
      { value: 'Não', label: 'Não, por enquanto não' },
    ],
  },
];

function suggestPlan(answers: Answers) {
  if (answers.financeiro === 'Sim') return 'Premium';
  if (answers.necessidade === 'Relatórios' || answers.tamanho === 'Mais de 20') return 'Ouro';
  if (
    answers.necessidade === 'Folha e equipe' ||
    answers.tamanho === '6 a 20' ||
    answers.tamanho === '1 a 5'
  ) {
    return 'Prata';
  }
  return 'Bronze';
}

function buildWhatsAppUrl(answers: Answers, plan: string) {
  const lines = [
    "Olá! Fiz o diagnóstico no site da Styllu's.",
    '',
    `Nome: ${answers.nome ?? '-'}`,
    `WhatsApp: ${answers.whatsapp ?? '-'}`,
    `Momento: ${answers.momento ? MOMENTO_LABELS[answers.momento] : '-'}`,
    `Segmento: ${answers.segmento ?? '-'}`,
    `Equipe: ${answers.tamanho ?? '-'}`,
    `Principal necessidade: ${answers.necessidade ?? '-'}`,
    `Rotina financeira: ${answers.financeiro ?? '-'}`,
    `Plano sugerido pelo site: ${plan}`,
  ];
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  initialMomento?: string;
  initialNecessidade?: string;
};

export default function DiagnosticoModal({
  open,
  onClose,
  initialMomento,
  initialNecessidade,
}: Props) {
  const titleId = useId();
  const totalSteps = STEPS.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next: Answers = {};
    if (initialMomento) next.momento = initialMomento;
    if (initialNecessidade) next.necessidade = initialNecessidade;
    setAnswers(next);
    setStep(initialMomento ? 1 : 0);
    setDone(false);
  }, [open, initialMomento, initialNecessidade]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const plan = useMemo(() => suggestPlan(answers), [answers]);
  const isContactStep = step === STEPS.length;
  const current = STEPS[step];
  const canSubmit = Boolean(answers.nome?.trim() && answers.whatsapp?.trim());
  const firstName = answers.nome?.trim().split(/\s+/)[0];

  function choose(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  }

  function openWhatsApp() {
    window.open(buildWhatsAppUrl(answers, plan), '_blank', 'noopener,noreferrer');
  }

  function finish() {
    if (!canSubmit) return;
    openWhatsApp();
    setDone(true);
  }

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="diag-overlay" role="presentation" onClick={onClose}>
      <div
        className="diag-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="diag-close" aria-label="Fechar" onClick={onClose}>
          ✕
        </button>

        {done ? (
          <div className="diag-success">
            <div className="diag-success__icon" aria-hidden="true">
              ✓
            </div>
            <h2 id={titleId}>Tudo certo{firstName ? `, ${firstName}` : ''}!</h2>
            <p>Abrimos uma conversa no WhatsApp com o seu resumo. Se a janela não abriu, toque no botão abaixo.</p>
            <div className="diag-plan-hint">
              <p>
                Pelo que você contou, o plano <strong>{plan}</strong> pode fazer mais sentido.
              </p>
              <span>É uma sugestão inicial — nossa equipe confirma com você antes de qualquer proposta.</span>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={openWhatsApp}>
              Abrir conversa no WhatsApp
            </button>
          </div>
        ) : (
          <div className="diag-body">
            <div className="diag-progress">
              <span className="diag-progress__label">Diagnóstico gratuito</span>
              <span>
                Etapa {step + 1} de {totalSteps}
              </span>
            </div>
            <div className="diag-progress__bar" aria-hidden="true">
              <div style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
            </div>

            {isContactStep ? (
              <div className="diag-contact">
                <h2 id={titleId}>Para onde levamos o seu diagnóstico?</h2>
                <p>Sem custo e sem compromisso. Retorno em até 24h úteis.</p>

                <div className="form-field">
                  <label htmlFor="diag-nome">Seu nome</label>
                  <input
                    id="diag-nome"
                    autoFocus
                    placeholder="Como podemos te chamar?"
                    value={answers.nome ?? ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="diag-whats">WhatsApp</label>
                  <input
                    id="diag-whats"
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    value={answers.whatsapp ?? ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={!canSubmit}
                  onClick={finish}
                >
                  Ver meu diagnóstico →
                </button>
                <p className="diag-footnote">
                  Usamos seus dados apenas para entrar em contato sobre este diagnóstico.
                </p>
              </div>
            ) : (
              <div>
                <h2 id={titleId}>{current.question}</h2>
                <p className="diag-help">{current.help}</p>
                <div className="diag-options">
                  {current.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="diag-option"
                      aria-pressed={answers[current.key] === option.value}
                      onClick={() => choose(current.key, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step > 0 && (
              <button type="button" className="diag-back" onClick={() => setStep((prev) => Math.max(0, prev - 1))}>
                ← Voltar
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
