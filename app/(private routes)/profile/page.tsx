import UserInfoForm from "@/components/UserInfoForm/UserInfoForm";
import css from "./ProfilePage.module.css";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className={css.profile}>
      <h2 className={css.title}>Кабінет</h2>
      <div className={css.profCont}>
        <div className={css.information}>
          <UserInfoForm />
        </div>
        <div className={css.order}>
          <h3 className={css.text}>Мої замовлення</h3>
        </div>
      </div>
          <div className={css.orderBut}>
              <Link href="">Вийти з кабінету</Link>
      </div>
    </div>
  );
}
