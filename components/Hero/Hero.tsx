'use client';
import { useEffect, useRef, useState } from 'react';
import css from './Hero.module.css';
import Image from 'next/image';

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Затримка 1 сек перед запуском анімації
    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play();
      //console.log('play');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleEnded = () => {
    setVideoFinished(true);
  };
  return (
    <section className={css.hero}>
      <div className={css.container}>
        <div className={css.textWrapper}>
          <h1 className={css.title}>
            Знайди свій стиль з Clothica вже сьогодні!
          </h1>
          <p className={css.text}>
            Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо
            базовий одяг, який легко комбінується та підходить для будь-якої
            нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди
            будуть актуальними.
          </p>
          <ul className={css.actionsList}>
            <li className={css.actionItem}>
              <a href="#popular-goods" className={css.firstLink}>
                До товарів
              </a>
            </li>
            <li className={css.actionItem}>
              <a href="#popular-categories" className={css.secondLink}>
                Дослідити категорії
              </a>
            </li>
          </ul>
        </div>
        <div className={css.imageWrapper}>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="
        /images/hero/hero-mobile-vid.webp 1x,
        /images/hero/hero-mobile-vid.webp 2x
      "
              width="424"
              height="335"
            />
            <source
              media="(max-width: 1439px)"
              srcSet="
        /images/hero/hero-desktop-vid.webp 1x,
        /images/hero/hero-desktop-vid.webp 2x
      "
              width="336"
              height="425"
            />
            <Image
              src="/images/hero/hero-desktop-vid.webp"
              alt="Clothica — find your style"
              width={640}
              height={394}
              sizes="(max-width: 767px) 100vw,
                   (max-width: 1439px) 100vw,
                   1440px"
              className={css.heroImage}
              loading="eager"
            />
          </picture>
          {/* ---- Анімаційне відео ---- */}
          {showVideo && (
            <video
              ref={videoRef}
              src="/images/hero/main-screen.mp4"
              className={`${css.heroVideo} ${
                videoFinished ? css.hide : css.show
              }`}
              muted
              autoPlay
              playsInline
              onEnded={handleEnded}
            />
          )}
        </div>
      </div>
    </section>
  );
}
