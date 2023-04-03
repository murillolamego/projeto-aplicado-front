import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit } = useForm();

  function handleSignIn(data) {
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen">
        <div className="container flex items-center justify-center">
          <div className="flex z-10">
            <form
              className="flex-col border bg-white px-6 py-14 shadow-md rounded-[4px]"
              onSubmit={handleSubmit(handleSignIn)}
              autoComplete="off"
            >
              <div className="flex flex-col text-sm rounded-md">
                <input
                  {...register("email")}
                  className="mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
                  type="text"
                  placeholder="Username or Email id"
                  autoComplete="off"
                />
                <input
                  {...register("password")}
                  className="border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </div>
              <button
                className="mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300"
                type="submit"
              >
                Sign in
              </button>
              <div className="mt-5 flex justify-between text-sm text-gray-600">
                <a href="#">Forgot password?</a>
                <a href="#">Sign up</a>
              </div>
            </form>
          </div>

          <div className="absolute top-0 left-0 hidden transition-all duration-300 lg:flex lg:w-[840px] lg:h-[400px]">
            <Image
              className="object-contain relative"
              src="/paw-print.svg"
              alt="Drawing of a french bulldog sitting looking back at you"
              fill
              priority
            />
          </div>

          <div className="absolute top-0 left-0 w-72 h-32 transition-all duration-300 lg:w-[480px] lg:h-56 lg:bottom-0 lg:top-auto">
            <Image
              className="object-contain relative"
              src="/cat.png"
              alt="Drawing of a french bulldog sitting looking back at you"
              fill
              priority
            />
          </div>

          <div className="absolute bottom-0 right-0 w-48 h-48 transition-all duration-300 lg:w-96 lg:h-96">
            <Image
              className="object-contain relative"
              src="/dog.png"
              alt="Drawing of a french bulldog sitting looking back at you"
              fill
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
