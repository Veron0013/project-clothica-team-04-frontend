import Link from "next/link";
import css from "./BurgerMenu.module.css"
import { useAuthStore } from "@/lib/store/authStore";

interface BurgerMenuProps {
  menuOpen: boolean;
}

export default function BurgerMenu({ menuOpen }: BurgerMenuProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return ( <div
      className={`${css.burgerMenu} ${menuOpen ? css.active : ""}`}
    >
    <ul className={css.burgerNav}>
          <li>
            <Link href="">Головна</Link>
          </li>
          <li>
            <Link href="">Товари</Link>
          </li>
          <li>
            <Link href="">Категорії</Link>
          </li>
        </ul>
      <div className={css.BurgerAuth}>
        {!isAuthenticated ? (
          <><Link href="" className={css.BurgerNavUp}>
            Вхід
          </Link>
          <Link href="" className={css.BurgerNavIn}>
            Реєстрація
                </Link> </>
        ):  (<Link href="" className={css.BurgerNavUpBasket}>
            Кабінет
          </Link> 
          )}    
           </div> </div> )
}