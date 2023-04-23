import Head from "next/head";
import { ReactElement } from "react";

import { SignupUser } from "@/components/signupUser";
import { UserSignupProvider } from "@/contexts/UserSignupContext";

export default function Signup(): ReactElement {
  return (
    <>
      <Head>
        <title>Caramelo - Pet na web</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen">
        <div className="container flex items-center justify-center">
          <div className="flex flex-col z-10 ">
            <UserSignupProvider>
              <SignupUser />
            </UserSignupProvider>
          </div>
        </div>
      </main>
    </>
  );
}
