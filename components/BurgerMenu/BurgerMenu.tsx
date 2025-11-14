import Link from "next/link";
import css from "./BurgerMenu.module.css";
import { useAuthStore } from "@/stores/authStore";

interface BurgerMenuProps {
  menuOpen: boolean;
  onClose: () => void;
}

export default function BurgerMenu({ menuOpen, onClose }: BurgerMenuProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className={`${css.burgerMenu} ${menuOpen ? css.active : ""}`}>
      <ul className={css.burgerNav}>
        <li>
          <Link href="/" onClick={onClose}>
            Головна
          </Link>
        </li>
        <li>
          <Link href="/goods" onClick={onClose}>
            Товари
          </Link>
        </li>
        <li>
          <Link href="/categories" onClick={onClose}>
            Категорії
          </Link>
        </li>
      </ul>

      <div className={css.BurgerAuth}>
        {isAuthenticated ? ( // ✅ якщо залогінений
          <Link
            href="/profile"
            onClick={onClose}
            className={css.BurgerNavUpBasket}
          >
            Кабінет
          </Link>
        ) : (
          <>
            <Link href="/sign-in" onClick={onClose} className={css.BurgerNavUp}>
              Вхід
            </Link>
            <Link href="/sign-up" onClick={onClose} className={css.BurgerNavIn}>
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
