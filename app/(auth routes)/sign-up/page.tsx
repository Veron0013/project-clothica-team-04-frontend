"use client";

// Додаємо імпорти
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginRequest } from "@/lib/api/clientApi";
import css from "./SignInPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { ApiError } from "@/lib/api/api";
import AuthComponent from "@/components/AuthComponent/AuthComponent";

const SignUp = () => {
  //   const router = useRouter();
  //   const [error, setError] = useState("");
  //   const setUser = useAuthStore((state) => state.setUser);

  //   const handleSubmit = async (formData: FormData) => {
  //     try {
  //       // Типізуємо дані форми
  //       const formValues = Object.fromEntries(formData) as LoginRequest;
  //       // Виконуємо запит
  //       const res = await login(formValues);

  //       if (!res.email && (res.error === "" || res.error === undefined)) {
  //         setError("Server under maintanance");
  //       } else if (res) {
  //         setUser(res);
  //         router.push("/profile");
  //       } else {
  //         setError("Invalid email or password");
  //       }
  //     } catch (error) {
  //       setError(
  //         (error as ApiError).response?.data?.error ??
  //           (error as ApiError).message ??
  //           "Oops... some error"
  //       );
  //     }
  //   };

  return <AuthComponent login={false} />;
};

export default SignUp;
