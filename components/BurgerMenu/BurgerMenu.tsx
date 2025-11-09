import css from "./BurgerMenu.module.css"

interface BurgerMenuProps {
  menuOpen: boolean;
}

export default function BurgerMenu({menuOpen}: BurgerMenuProps ){
    return ( <div
      className={`${css.burgerMenu} ${menuOpen ? css.active : ""}`}
    >
    <ul className={css.burgerNav}>
          <li>
            <a href="">Головна</a>
          </li>
          <li>
            <a href="">Товари</a>
          </li>
          <li>
            <a href="">Категорії</a>
          </li>
        </ul>
        <div className={css.BurgerAuth}>
          <a href="" className={css.BurgerNavUp}>
            Вхід
          </a>
          <a href="" className={css.BurgerNavIn}>
            Реєстрація
                </a> 
                {/* <a href="" className={css.BurgerNavUpBasket}>
            Кабінет
          </a> */
          }    
           </div> </div> )
}