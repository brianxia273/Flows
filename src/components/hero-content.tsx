"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import "./styles.css";
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import { BsSoundwave } from "react-icons/bs";
import { motion } from "framer-motion";

export function Herocontent() {
  const router = useRouter();

  const handleLoginClick = async () => {
    setLoading(true);
    await router.push("/login");
  };

  const handleSignupClick = async () => {
    setLoading(true);
    await router.push("/signup");
  };

  const flowGradients: string[] = [
    "linear-gradient(45deg, #3c87fd, #a16be3)", // Study
    "linear-gradient(45deg, #e53935, #ff7043)", // Working out
    "linear-gradient(45deg, #ffec61, #ffb74d)", // Art/Creativity
  ];

  const backImages: string[] = [
    "/images/_M6A0532_1440x690_1.jpg", // Library
    "/images/photo-1571902943202-507ec2618e8f.jpg", // Gym
    "/images/360_F_971633562_ISv2cCFxAAo48L6jimWsHujVyYTizcCJ.jpg", // Art Canvas
  ];

  const backGradients: string[] = [
    "linear-gradient(to bottom, rgba(30, 35, 60, 0.65), #0e1111)", // Study
    "linear-gradient(to bottom, rgba(70, 40, 40, 0.7), #0e1111)",
    "linear-gradient(to bottom, rgba(60, 60, 40, 0.6), #0e1111)",
  ];

  const buttonShadow: string[] = [
    "0 0 20px #5d66e7",
    "0 0 20px #f2533b",
    "0 0 20px #b3943d",
  ];

  const buttonHover: string[] = ["#383d8b ", " #913223", " #806a2c"];

  const activityName: string[] = ["studying", "workout", "creativity"];

  // For Log In text, Sign Up text, and Button box
  const componentColor: string[] = ["#5d66e7", "#f2533b", "#b3943d"];

  const [index, setIndex] = useState(0);

  const handleRSlideClick = () => {
    setIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  const handleLSlideClick = () => {
    setIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  const [isLHovered, setIsLHovered] = useState(false);
  const [isSHovered, setIsSHovered] = useState(false);
  const [isBHovered, setIsBHovered] = useState(false);
  const [isLAHovered, setIsLAHovered] = useState(false);
  const [isRAHovered, setIsRAHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <nav
        className="w-full px-6 py-6 flex justify-between items-center"
        style={{ backgroundColor: "#0e1111" }}
      >
        <div className="home-text logo-text">
          Fl
          <BsSoundwave
            style={{
              fontSize: "1.6rem",
              color: "#ebf6f9",
              verticalAlign: "middle",
              display: "inline-block",
            }}
          />
          ws
        </div>

        <div className="space-x-4 flex items-center gap-5">
          <button
            className="login-text home-text"
            onClick={handleLoginClick}
            onMouseEnter={() => setIsLHovered(true)}
            onMouseLeave={() => setIsLHovered(false)}
            style={{
              color: isLHovered ? componentColor[index] : " #ebf6f9",
            }}
          >
            Log In
          </button>
          <button
            className="login-text home-text"
            onClick={handleSignupClick}
            onMouseEnter={() => setIsSHovered(true)}
            onMouseLeave={() => setIsSHovered(false)}
            style={{
              color: isSHovered ? componentColor[index] : " #ebf6f9",
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>
      <div
        className="w-full"
        style={{
          backgroundImage: `${backGradients[index]}, url(${backImages[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex items-center justify-center h-200 flex-col pb-28"
        >
          <div className="flow-box">
            <Button
              className="arrow-buttons"
              onClick={handleLSlideClick}
              onMouseEnter={() => setIsLAHovered(true)}
              onMouseLeave={() => setIsLAHovered(false)}
            >
              {" "}
              <ChevronLeftIcon
                style={{
                  width: "4rem",
                  height: "4rem",
                  color: isLAHovered ? componentColor[index] : " #ebf6f9",
                }}
                className="transition-colors duration-300"
              />
            </Button>
            <div className="hero-text home-text w-200 mb-12">
              Your music, your
              <span
                className="flows-text"
                style={{
                  backgroundImage: flowGradients[index],
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                }}
              >
                Fl
                <BsSoundwave
                  style={{
                    fontSize: "10rem",
                    color: componentColor[index],
                    verticalAlign: "middle",
                    display: "inline-block",
                    filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4))",
                  }}
                />
                ws
              </span>
            </div>
            <Button
              className="arrow-buttons "
              onClick={handleRSlideClick}
              onMouseEnter={() => setIsRAHovered(true)}
              onMouseLeave={() => setIsRAHovered(false)}
            >
              {" "}
              <ChevronRightIcon
                style={{
                  width: "4rem",
                  height: "4rem",
                  color: isRAHovered ? componentColor[index] : " #ebf6f9",
                }}
                className="transition-colors duration-300"
              />
            </Button>
          </div>
          <div className="home-text flows-description-text mb-18">
            Evaluate the perfect focus sound for your{" "}
            <span
              style={{
                backgroundImage: flowGradients[index],
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                display: "inline-block",
                fontWeight: 600,
                position: "relative",
              }}
            >
              {activityName[index]}
              <span
                style={{
                  position: "absolute",
                  bottom: "-2px", // Position the underline just below the text
                  left: "0",
                  width: "100%", // Underline width should match the text width
                  height: "2px", // Height of the underline
                  backgroundImage: flowGradients[index], // Gradient for underline
                }}
              ></span>
            </span>
          </div>
          <div className="pt-2">
            <Button
              className="start-button home-text shadow-md rounded-lg"
              onClick={handleLoginClick}
              onMouseEnter={() => setIsBHovered(true)}
              onMouseLeave={() => setIsBHovered(false)}
              style={{
                background: isBHovered
                  ? buttonHover[index]
                  : componentColor[index],
                boxShadow: buttonShadow[index],
              }}
            >
              {loading ? "Loading" : "Get Started"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
