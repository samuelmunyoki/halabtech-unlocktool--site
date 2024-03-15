import { dummyPackages } from "@/data/packages";
import React from "react";
import CardComponent from "../card/CardComponent";

const SalesComponent = () => {
  return (
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
  );
};

export default SalesComponent;
