import Link from "next/link";
import css from "./BurgerMenu.module.css"
import { useAuthStore } from "@/lib/store/authStore";

interface BurgerMenuProps {
  menuOpen: boolean;
  onClose: () => void;
}

export default function BurgerMenu({ menuOpen, onClose }: BurgerMenuProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return ( <div
      className={`${css.burgerMenu} ${menuOpen ? css.active : ""}`}
    >
    <ul className={css.burgerNav}>
          <li>
            <Link href="/" onClick={onClose}>Головна</Link>
          </li>
          <li>
            <Link href="/goods" onClick={onClose}>Товари</Link>
          </li>
          <li>
            <Link href="/categories" onClick={onClose}>Категорії</Link>
          </li>
        </ul>
      <div className={css.BurgerAuth}>
        {isAuthenticated ? (
          <><Link href="/sign-in" onClick={onClose} className={css.BurgerNavUp}>
            Вхід
          </Link>
          <Link href="/sign-up" onClick={onClose} className={css.BurgerNavIn}>
            Реєстрація
                </Link> </>
        ):  (<Link href="/profile" onClick={onClose} className={css.BurgerNavUpBasket}>
            Кабінет
          </Link> 
          )}    
           </div> </div> )
}