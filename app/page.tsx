"use client";

import { SessionProvider } from "next-auth/react";
import { Home } from "./components/home";

export default function App() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
