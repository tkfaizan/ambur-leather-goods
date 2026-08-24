"use client";

import { Toaster } from "react-hot-toast";

export function ToasterWrapper() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '12px',
        },
      }}
    />
  );
}
