import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import css from "./NotFound.module.css";

export const metadata: Metadata = {
  title: `404 - Сторінку на Clothica не знайдено`,
  description: "Такої сторінки не існує.",
  openGraph: {
    title: `404 - Сторінку на Clothica не знайдено`,
    description: "Такої сторінки не існує.",
    url: `https://clothica-team-04-frontend.vercel.app/`,
    siteName: "Clothica",
    type: "website",
  },
};

const NotFound = () => {
  return (
    <div className={css.NotFoundContainer}>
      <h1 className={css.NotFoundTitle}>ОПАНЬКИ!!!</h1>
      <p className={css.NotFoundTitle}>404</p>

      <Image
        src="https://res.cloudinary.com/dyounr2tf/image/upload/v1763228561/%D0%97%D0%BD%D1%96%D0%BC%D0%BE%D0%BA_%D0%B5%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2025-11-15_194135_rcpesh.png"
        alt="img"
        width={250}
        height={250}
        className={css.NotFoundImage}
      />
      <h3 className={css.NotFoundDescr}>Сторінку не знайдено!!!</h3>
      <p className={css.NotFoundText}>Ви перейшли на неїснуюче посилання.</p>
      <p className={css.NotFoundText}>Спробуйте з головної сторінки.</p>

      <Link href="/" className={css.NotFoundLink}>
        На головну сторінку
      </Link>
    </div>
  );
};

export default NotFound;
