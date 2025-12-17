import React from "react";
import hero from "../Assets/hero2.jpg";

const Hero = () => {
  return (
    <div className="flex justify-center items-center h-[600px] w-full bg-black relative">
      {/* Left Text */}
      <div className="text-white mr-[100px]">
        <p className="text-[80px] font-bold m-0 leading-none">FIND YOUR</p>
        <p className="text-[80px] font-bold m-0 leading-none">PERFECT FIT</p>
      </div>

      {/* Right Image */}
      <div className="ml-[100px]">
        <img
          src={hero}
          alt="Hero"
          className="h-[90%] max-w-[75%] w-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
