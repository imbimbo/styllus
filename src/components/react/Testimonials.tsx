import { useMemo, useState } from 'react';

const testimonials = [
  {
    quote:
      "A Styllu's é uma excelente empresa contábil, satisfação e conforto em ter um parceiro confiável e sempre muito atento às mudanças de leis, tributações e etc. Alguns profissionais em destaque, Sr. Jonas, Sr. Emerson, Sr. Felipe Rinaldi entre outros profissionais de alta qualidade. Gratidão em ter este time nos meus negócios.",
    name: 'RASF Comercial',
    role: 'CEO',
  },
  {
    quote:
      'A melhor empresa que você vai encontrar no país. Atendimento primoroso, todos os meses te ligam para saber se faltou algo, como podem melhorar? E sempre se superam. Nota 10. Recomendo com louvor.',
    name: 'Jaime Albuquerque',
    role: 'CEO',
  },
  {
    quote:
      "Quero compartilhar minha experiência positiva com a Styllu's Assessoria Contábil. Eles oferecem serviços excepcionais e são extremamente profissionais. O Felipe Rinaldi, em particular, é muito atencioso e sempre pronto para esclarecer dúvidas.",
    name: 'Leilaine Campioto',
    role: 'CEO • Znith',
  },
  {
    quote:
      "Estou com a Styllu's há 2 anos e tem sido uma experiência e tanto. Atendimento impecável em todos os setores. É maravilhoso conseguir ficar tranquila tocando as outras coisas da empresa sabendo que da parte contábil eu não tenho que me preocupar.",
    name: 'Sara Bertelli',
    role: 'CEO • Odontologista',
  },
  {
    quote:
      "Sou cliente da Styllu's há muitos anos, e super indico. Agilidade no atendimento, pró-atividade e excelência. Um lugar onde pude encontrar uma verdadeira parceria.",
    name: 'Nathália Sobrinho',
    role: 'CEO • Rs Artefatos de Madeira',
  },
  {
    quote:
      "Sou cliente há muitos anos e indico com certeza. Empresa séria, sólida e experiente e uma equipe excelente, prontamente a atender.",
    name: 'Arnaldo Santos Bruno',
    role: 'CEO • Santos Bruno Imóveis',
  },
];

export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () => (expanded ? testimonials : testimonials.slice(0, 3)),
    [expanded],
  );

  return (
    <div>
      <div className="grid-3">
        {visible.map((item) => (
          <blockquote key={item.name} className="quote">
            <p>“{item.quote}”</p>
            <footer>
              {item.name}
              <span>{item.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button type="button" className="btn btn-outline" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Ver menos' : 'Ver mais depoimentos'}
        </button>
      </div>
    </div>
  );
}
