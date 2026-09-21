import { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const WA_NUMBER = '5511937746793';

type Momento = 'abrir' | 'tenho' | 'trocar';

const MOMENTO_LABELS: Record<Momento, string> = {
  abrir: 'Quero abrir minha empresa',
  tenho: 'Já tenho uma empresa',
  trocar: 'Quero trocar de contador',
};

type Answers = {
  momento?: Momento;
  segmento?: string;
  tamanho?: string;
  necessidade?: string;
  financeiro?: string;
  nome?: string;
  whatsapp?: string;
};

type Step = {
  key: keyof Pick<Answers, 'segmento' | 'tamanho' | 'necessidade' | 'financeiro'>;
  question: string;
  help: string;
  options: { value: string; label: string }[];
};

const MOMENTO_OPTIONS = [
  { value: 'abrir' as const, label: 'Quero abrir minha empresa' },
  { value: 'tenho' as const, label: 'Já tenho uma empresa' },
  { value: 'trocar' as const, label: 'Quero trocar de contador' },
];

const FLOWS: Record<Momento, Step[]> = {
  abrir: [
    {
      key: 'segmento',
      question: 'Que tipo de negócio você quer abrir?',
      help: 'Isso muda o caminho de abertura e as obrigações iniciais.',
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
      key: 'tamanho',
      question: 'Você já sabe se terá sócios ou funcionários?',
      help: 'Mesmo na abertura, isso altera o enquadramento e os custos.',
      options: [
        { value: 'Ainda nenhum', label: 'Só eu, por enquanto' },
        { value: '1 a 5', label: 'Sócios, sem funcionários' },
        { value: '6 a 20', label: 'Vou contratar funcionários' },
        { value: 'Ainda não sei', label: 'Ainda não sei' },
      ],
    },
    {
      key: 'necessidade',
      question: 'O que mais te preocupa na abertura?',
      help: 'Vamos priorizar o que gera mais dúvida agora.',
      options: [
        { value: 'Abrir empresa', label: 'CNPJ, contratos e documentação' },
        { value: 'Impostos', label: 'Escolher o regime tributário certo' },
        { value: 'Folha e equipe', label: 'Contratar pessoas do jeito certo' },
        { value: 'Financeiro', label: 'Entender custos e capital inicial' },
        { value: 'Não sei ainda', label: 'Quero orientação completa do zero' },
      ],
    },
    {
      key: 'financeiro',
      question: 'Quer organização financeira desde o início?',
      help: 'Contas a pagar e receber, conciliações e fluxo de caixa.',
      options: [
        { value: 'Sim', label: 'Sim, quero começar organizado' },
        { value: 'Talvez', label: 'Talvez, quero entender melhor' },
        { value: 'Não', label: 'Não, por enquanto só a abertura' },
      ],
    },
  ],
  tenho: [
    {
      key: 'segmento',
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
      key: 'tamanho',
      question: 'Quantas pessoas trabalham com você?',
      help: 'Considere sócios e funcionários registrados.',
      options: [
        { value: 'Ainda nenhum', label: 'Só eu' },
        { value: '1 a 5', label: '1 a 5 pessoas' },
        { value: '6 a 20', label: '6 a 20 pessoas' },
        { value: 'Mais de 20', label: 'Mais de 20 pessoas' },
      ],
    },
    {
      key: 'necessidade',
      question: 'O que sua empresa mais precisa resolver agora?',
      help: 'Escolha o ponto mais urgente no dia a dia.',
      options: [
        { value: 'Impostos', label: 'Impostos e obrigações em dia' },
        { value: 'Folha e equipe', label: 'Folha, CLT e equipe' },
        { value: 'Relatórios', label: 'Números claros para decidir' },
        { value: 'Financeiro', label: 'Organizar o financeiro' },
        { value: 'Não sei ainda', label: 'Quero um diagnóstico geral' },
      ],
    },
    {
      key: 'financeiro',
      question: "Quer que a Styllu's cuide também da rotina financeira?",
      help: 'Contas a pagar e receber, conciliações e fluxo de caixa.',
      options: [
        { value: 'Sim', label: 'Sim, isso me interessa' },
        { value: 'Talvez', label: 'Talvez, quero entender melhor' },
        { value: 'Não', label: 'Não, por enquanto não' },
      ],
    },
  ],
  trocar: [
    {
      key: 'segmento',
      question: 'Em que área sua empresa atua?',
      help: 'Ajuda a preparar a transição com o contexto certo.',
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
      key: 'tamanho',
      question: 'Qual o tamanho da operação hoje?',
      help: 'Isso influencia o volume da transição contábil.',
      options: [
        { value: 'Ainda nenhum', label: 'Só eu' },
        { value: '1 a 5', label: '1 a 5 pessoas' },
        { value: '6 a 20', label: '6 a 20 pessoas' },
        { value: 'Mais de 20', label: 'Mais de 20 pessoas' },
      ],
    },
    {
      key: 'necessidade',
      question: 'Por que você quer trocar de contador?',
      help: 'Conte o que mais te incomoda hoje. Isso guia a transição.',
      options: [
        { value: 'Impostos', label: 'Erros, atrasos ou impostos confusos' },
        { value: 'Relatórios', label: 'Pouca orientação e poucos números' },
        { value: 'Folha e equipe', label: 'Problemas com folha e pessoal' },
        { value: 'Financeiro', label: 'Quero alguém mais próximo do financeiro' },
        { value: 'Não sei ainda', label: 'Busco mais atenção e parceria' },
      ],
    },
    {
      key: 'financeiro',
      question: 'Além da contabilidade, precisa de BPO financeiro?',
      help: 'Podemos assumir a rotina financeira junto com a transição.',
      options: [
        { value: 'Sim', label: 'Sim, quero isso na troca' },
        { value: 'Talvez', label: 'Talvez, quero entender melhor' },
        { value: 'Não', label: 'Não, só a contabilidade por agora' },
      ],
    },
  ],
};

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
  initialMomento?: Momento;
};

export default function DiagnosticoModal({ open, onClose, initialMomento }: Props) {
  const titleId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [lockedMomento, setLockedMomento] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next: Answers = {};
    if (initialMomento) next.momento = initialMomento;
    setAnswers(next);
    setStep(0);
    setDone(false);
    setLockedMomento(Boolean(initialMomento));
  }, [open, initialMomento]);

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

  const flow = answers.momento ? FLOWS[answers.momento] : null;
  const selectingMomento = !answers.momento;
  const totalSteps = (flow?.length ?? FLOWS.abrir.length) + 1;
  const isContactStep = Boolean(flow) && step >= flow!.length;
  const current = flow?.[step];
  const plan = useMemo(() => suggestPlan(answers), [answers]);
  const canSubmit = Boolean(answers.nome?.trim() && answers.whatsapp?.trim());
  const firstName = answers.nome?.trim().split(/\s+/)[0];
  const canGoBack = step > 0 || (Boolean(answers.momento) && !lockedMomento);

  function chooseMomento(value: Momento) {
    setAnswers({ momento: value });
    setStep(0);
  }

  function choose(key: Step['key'], value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  }

  function goBack() {
    if (step > 0) {
      setStep((prev) => prev - 1);
      return;
    }
    if (answers.momento && !lockedMomento) {
      setAnswers({});
      setStep(0);
    }
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

  const progressIndex = selectingMomento ? 1 : Math.min(step + 1, totalSteps);

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
              <span>É uma sugestão inicial. Nossa equipe confirma com você antes de qualquer proposta.</span>
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
                Etapa {progressIndex} de {totalSteps}
              </span>
            </div>
            <div className="diag-progress__bar" aria-hidden="true">
              <div style={{ width: `${(progressIndex / totalSteps) * 100}%` }} />
            </div>

            {selectingMomento ? (
              <div>
                <h2 id={titleId}>Qual é o seu momento agora?</h2>
                <p className="diag-help">Escolha a opção que mais se parece com a sua situação.</p>
                <div className="diag-options">
                  {MOMENTO_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="diag-option"
                      onClick={() => chooseMomento(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : isContactStep ? (
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
            ) : current ? (
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
            ) : null}

            {canGoBack && (
              <button type="button" className="diag-back" onClick={goBack}>
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
