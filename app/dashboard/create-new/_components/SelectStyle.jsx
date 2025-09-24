"use client";
import React, { useState } from "react";
import Image from "next/image";

function SelectStyle({onUserSelect}) {
  const styleOptions = [
    {
      name: "Realstic",
      image: "/realstic.jpg",
    },
    {
      name: "Cartoon",
      image: "/cartoon.webp",
    },
    {
      name: "Comic",
      image: "/comic.webp",
    },
    {
      name: "WaterColor",
      image: "/watercolor.webp",
    },
    {
      name: "GTA",
      image: "/gta.jpg",
    },
  ];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl text-white">Style</h2>
      <p className="text-gray-500">Select Your Video Style</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-3">
        {styleOptions.map((item, index) => (
          <div key={item.name} className={`relative hover:scale-105 
          transition-all cursor-pointer rounded-xl ${
            selectedOption == item.name && "border-4 border-primary"
          }`}
          >
            <Image
              src={item.image}
              width={200}
              height={100}
              className="h-60 object-cover rounded-lg w-full"
              alt={item.name}
              onClick={() => {
                setSelectedOption(item.name);
                onUserSelect("imageStyle", item.name);
              }}
            />
            <h2
              className="absolute p-1 bg-black bottom-0 w-full
          text-white text-center rounded-b-lg  "
            >
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectStyle;
