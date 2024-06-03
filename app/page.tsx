import { SessionProvider } from "next-auth/react";
import { Home } from "./components/home";
import { auth } from "./lib/auth";

export default async function App() {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Home />
    </SessionProvider>
  );
}
