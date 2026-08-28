import { useState, type FormEvent } from 'react';
import { withBase } from '../../lib/base';

type Fields = {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacy: boolean;
};

const initial: Fields = {
  name: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
};

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  function validate(next: Fields) {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!next.name.trim()) e.name = 'Informe seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) e.email = 'E-mail inválido.';
    if (next.phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone inválido.';
    if (!next.message.trim()) e.message = 'Escreva sua mensagem.';
    if (!next.privacy) e.privacy = 'É necessário autorizar o tratamento dos dados.';
    return e;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const text = [
      'Novo contato pelo site Styllu\'s',
      `Nome: ${fields.name}`,
      `E-mail: ${fields.email}`,
      `Telefone: ${fields.phone}`,
      `Mensagem: ${fields.message}`,
    ].join('\n');

    window.open(`https://wa.me/5511910155687?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setStatus('success');
    setFields(initial);
  }

  if (status === 'success') {
    return (
      <div className="form-success">
        <strong>Pronto!</strong>
        <p>
          Abrimos o WhatsApp com sua mensagem. Se a janela não abriu, use o botão de WhatsApp ao lado.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setStatus('idle')}>
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form className="form-panel" onSubmit={onSubmit} noValidate>
      <p className="eyebrow">Prefere escrever?</p>
      <p className="form-intro">
        Tempo médio de resposta: até 24h úteis
      </p>

      <div className="form-field">
        <label htmlFor="name">Nome completo *</label>
        <input
          id="name"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          autoComplete="name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email">E-mail *</label>
        <input
          id="email"
          type="email"
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
          autoComplete="email"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="phone">Telefone/WhatsApp *</label>
        <input
          id="phone"
          value={fields.phone}
          onChange={(e) => setFields({ ...fields, phone: e.target.value })}
          autoComplete="tel"
        />
        {errors.phone && <span className="form-error">{errors.phone}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="message">Mensagem *</label>
        <textarea
          id="message"
          rows={4}
          value={fields.message}
          onChange={(e) => setFields({ ...fields, message: e.target.value })}
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      <label className="form-check">
        <input
          type="checkbox"
          checked={fields.privacy}
          onChange={(e) => setFields({ ...fields, privacy: e.target.checked })}
        />
        <span>
          Autorizo o tratamento dos meus dados conforme a{' '}
          <a href={withBase('politica-privacidade')} style={{ color: 'hsl(var(--primary))' }}>
            Política de Privacidade
          </a>
          . *
        </span>
      </label>
      {errors.privacy && <span className="form-error">{errors.privacy}</span>}

      <button type="submit" className="btn btn-primary btn-block">
        Enviar mensagem
      </button>
      <p className="form-footnote">
        Levamos a privacidade a sério. Seus dados estão seguros e não serão compartilhados com terceiros.
      </p>
    </form>
  );
}
