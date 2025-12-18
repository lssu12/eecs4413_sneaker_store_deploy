import React from "react";
import hero from "../Components/Assets/hero2.jpg";

const Hero = () => {
    return (
        <div className="flex justify-center items-center h-[600px] w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary relative text-brand-surface">
            {/* Left Text */}
            <div className="mr-[100px]">
                <p className="text-[80px] font-display font-semibold tracking-wide m-0 leading-none">
                    FIND YOUR
                </p>
                <p className="text-[80px] font-display font-semibold m-0 leading-none">
                    PERFECT FIT
                </p>
                </div>

            {/* Right Image */}
            <div className="ml-[100px] flex items-center justify-center w-[540px] h-[520px]">
                <img
                    src={hero}
                    alt="Hero"
                    className="h-[85%] w-auto object-contain mix-blend-screen"
                />
            </div>
        </div>
    );
};

export default Hero;
