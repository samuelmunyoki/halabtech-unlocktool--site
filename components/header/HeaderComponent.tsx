import Link from "next/link";
import React from "react";

export const HeaderComponent = () => {
  return (
    <header className="sticky flex flex-row justify-evenly items-center bg-transparent p-4 md:m-2 md:p-2  ">
      <div className="flex items-center ">
        <h1 className="font-normal text-blue-700 ">Halabtech</h1>
        <svg
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-blue-700 w-4 h-4 ml-1 font-bold"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>
      <div className=" flex flex-row space-x-5 items-center">
        <Link
          href="/register"
          className="cursor-pointer flex items-center justify-center text-sm border border-blue-600 px-5  py-1  w-[100px] bg-blue-700 hover:bg-blue-200 transition-colors hover:border-blue-100 text-white rounded-full"
        >
          Sign Up
        </Link>
        <div className=" flex items-center justify-center text-sm border bg-white hover:bg-blue-200 hover:text-white transition-colors cursor-pointer px-5 rounded-full py-1 w-[100px]">
          <Link href="/login">Login</Link>
        </div>
      </div>
    </header>
  );
};
