"use client";

import { useState } from "react";
import Modal from "@/components/Modal/Modal";

export default function ModalPlayground() {
  const [open, setOpen] = useState(true); // одразу true, щоб модалка була видна

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={() => setOpen(true)}>Відкрити модалку</button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>Привіт, я модалка 😈</h2>
        <p>Якщо ти це бачиш — все працює.</p>
        <button onClick={() => setOpen(false)}>Закрити</button>
      </Modal>
    </div>
  );
}
