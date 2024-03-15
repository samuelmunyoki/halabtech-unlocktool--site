"use client";
import CardComponent from "@/components/card/CardComponent";
import { HeaderComponent } from "@/components/header/HeaderComponent";
import { dummyPackages } from "@/data/packages";

export default function Home() {
  return (
    <>
      <HeaderComponent />
      <main className="relative flex flex-col  justify-center flex-grow p-6 min-w-full h-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-center  justify-center md:justify-evenly h-fit mx-10 space-x-10 mb-16">
          <div className="flex flex-col space-y-10 h-fit">
            <p className="font-bold text-[6vw] md:text-[3vw] w-full">
              <span className="text-blue-700">UnlockTool</span> for all Phones
              <br></br>
              <span className="font-normal">- Make every byte count</span>
              <span className="text-blue-700 font-normal">.</span>
            </p>
            <p className="w-full md:w-[40vw] text-sm leading-loose ">
              With the help of these unlock tools, users can bypass security
              measures, remove restrictions, and gain full control over their
              devices. Whether it's a phone,or tablet - there's an unlock tool
              available for every device.
            </p>
            <button className="bg-blue-700 hover:bg-blue-500 cursor-pointer transition-colors px-14 py-3 text-white mt-5 rounded-md md:w-[280px]">
              Coming Soon
            </button>
          </div>

          <img
            src="/image.png"
            alt="BG"
            className="object-contain mt-10 md:mt-0 md:w-[325px] "
          ></img>
        </div>
        <>
          <div className="bg-blue-700 py-3 w-[60vw] mx-auto mt-10 flex flex-row items-center justify-center mb-4">
            <p className="text-xl text-white">Our Packages</p>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:grid-flow-row md:gap-x-8 md:gap-y-10 mx-auto mt-6">
            {dummyPackages.map((packageItem, index) => (
              <CardComponent packageItem={packageItem} key={packageItem.Id} />
            ))}
          </div>
        </>
      </main>
    </>
  );
}
