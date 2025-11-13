"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import UserInfoForm from "@/components/UserInfoForm/UserInfoForm";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/lib/api/authApi";
import toastMessage, { MyToastType } from "@/lib/messageService";

import css from "./ProfilePage.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout();
      clearIsAuthenticated();
      router.push("/");
    } catch (error) {
      toastMessage(
        MyToastType.error,
        "Не вдалося вийти з кабінету. Спробуйте ще раз."
      );
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
        <button
          type="button"
          className={css.logoutBtn}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Виходжу..." : "Вийти з кабінету"}
        </button>
      </div>
    </div>
  );
}
