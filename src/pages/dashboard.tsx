import Head from "next/head";
import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Projeto aplicado</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen">
        <h1>{user?.email}</h1>
      </main>
    </>
  );
}