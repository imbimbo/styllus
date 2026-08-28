import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import googleReviews from '../../data/google-reviews.json';

type GoogleReview = {
  quote: string;
  name: string;
  role?: string;
  rating?: number;
};

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);

  return (
    <span className="google-stars" aria-label={`${rating.toFixed(1)} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < full ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setSlidesPerView(3);
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return slidesPerView;
}

export default function Testimonials() {
  const { reviews, rating, total, mapsUrl } = googleReviews;
  const slidesPerView = useSlidesPerView();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideSize, setSlideSize] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const isReady = slideSize > 0;

  const maxIndex = Math.max(0, reviews.length - slidesPerView);
  const pageCount = maxIndex + 1;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () => {
      setSlideSize(viewport.clientWidth / slidesPerView);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [slidesPerView]);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (pageCount <= 1) return;
      if (index < 0) {
        setCurrentIndex(maxIndex);
        return;
      }
      if (index > maxIndex) {
        setCurrentIndex(0);
        return;
      }
      setCurrentIndex(index);
    },
    [maxIndex, pageCount],
  );

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const viewportStyle = {
    ...(isReady ? { '--slide-size': `${slideSize}px` } : { '--slides-per-view': slidesPerView }),
  } as CSSProperties;

  const trackStyle = {
    transform: isReady ? `translateX(-${currentIndex * slideSize}px)` : undefined,
  } as CSSProperties;

  function onTouchStart(event: TouchEvent) {
    setTouchStart(event.touches[0].clientX);
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStart === null) return;

    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 48) {
      if (delta < 0) goNext();
      else goPrev();
    }

    setTouchStart(null);
  }

  return (
    <div>
      <div className="google-reviews-summary">
        <div className="google-reviews-summary__rating">
          <Stars rating={rating} />
          <strong className="google-reviews-summary__score text-gold-shine">{rating.toFixed(1)}</strong>
          <span className="google-reviews-summary__count">{total} avaliações no Google</span>
        </div>
        <a
          className="btn btn-outline google-reviews-summary__link"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver no Google Maps
        </a>
      </div>

      <div className={`reviews-carousel ${isReady ? 'is-ready' : 'is-loading'}`}>
        {pageCount > 1 && isReady && (
          <button
            type="button"
            className="reviews-carousel__nav reviews-carousel__nav--prev"
            onClick={goPrev}
            aria-label="Depoimento anterior"
          >
            ←
          </button>
        )}

        {!isReady && (
          <div className="reviews-carousel__loading" aria-label="Carregando depoimentos">
            <span className="reviews-carousel__loading-dots" aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}

        <div
          ref={viewportRef}
          className="reviews-carousel__viewport"
          style={viewportStyle}
          aria-busy={!isReady}
          onTouchStart={isReady ? onTouchStart : undefined}
          onTouchEnd={isReady ? onTouchEnd : undefined}
        >
          <div className="reviews-carousel__track" style={trackStyle} aria-live="polite">
            {reviews.map((item) => (
              <div
                key={`${item.name}-${item.quote.slice(0, 24)}`}
                className="reviews-carousel__slide"
              >
                <ReviewCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {pageCount > 1 && isReady && (
          <button
            type="button"
            className="reviews-carousel__nav reviews-carousel__nav--next"
            onClick={goNext}
            aria-label="Próximo depoimento"
          >
            →
          </button>
        )}

        {pageCount > 1 && isReady && (
          <div className="reviews-carousel__dots" role="tablist" aria-label="Depoimentos">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                className={`reviews-carousel__dot ${index === currentIndex ? 'is-active' : ''}`}
                aria-label={`Ir para depoimento ${index + 1}`}
                aria-selected={index === currentIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>

      <p className="google-reviews-attribution">
        Depoimentos publicados no Google pela Styllu&apos;s.{' '}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Escreva sua avaliação
        </a>
      </p>
    </div>
  );
}

function ReviewCard({ item }: { item: GoogleReview }) {
  return (
    <blockquote className="quote">
      {item.rating ? (
        <div className="quote__stars" aria-label={`${item.rating} de 5 estrelas`}>
          {'★'.repeat(item.rating)}
        </div>
      ) : null}
      <p>“{item.quote}”</p>
      <footer>
        {item.name}
        {item.role ? <span>{item.role}</span> : null}
      </footer>
    </blockquote>
  );
}
