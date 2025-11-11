import css from "./Style.module.css";

export default function Style() {
  return (
    <section className={css.style}>
      <div className={css.container}>
        <h2 className={css.title}>Обери свій унікальний стиль сьогодні</h2>
        <ul className={css.list}>
          <li className={css.item}>
            <div className={`${css.icon} ${css.iconNatural}`}></div>
            <h3 className={css.cardTitle}>Якість та натуральність</h3>
            <p className={css.description}>
              тільки приємні до тіла тканини, які зберігають форму навіть після
              десятків прань.
            </p>
          </li>
          <li className={css.item}>
            <div className={`${css.icon} ${css.iconUniversal}`}></div>
            <h3 className={css.cardTitle}>Універсальний дизайн</h3>
            <p className={css.description}>
              базові кольори та лаконічний стиль, що легко комбінуються між
              собою.
            </p>
          </li>
          <li className={css.item}>
            <div className={`${css.icon} ${css.iconComfort}`}></div>
            <h3 className={css.cardTitle}>Комфорт на кожен день</h3>
            <p className={css.description}>
              одяг, який не обмежує рухів і підходить для будь-якої ситуації.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
