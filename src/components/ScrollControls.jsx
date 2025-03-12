import { useEffect, useState } from "react";
import { DownIcon, UpIcon } from "./SVGs";


export default function ScrollControls() {
  const [showButtons, setShowButtons] = useState(false);
  console.log("ScrollControls mounted");

  useEffect(() => {
    console.log("ScrollControls mounted");
    const handleScroll = () => {
      setShowButtons(window.scrollY > 50); // Show only when user scrolls
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (position) => {
    window.scrollTo({
      top: position === "top" ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!showButtons) return null;

  return (
    <div
      className={`fixed right-4 bottom-10 flex flex-col z-50 gap-2 transition-opacity ${
        showButtons ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        onClick={() => scrollTo("top")}
        className=" text-white rounded-full shadow-lg hover:bg-gray-200 transition"
      >
        <img src={UpIcon} alt="Tags" width={50} height={50} />
      </button>
      <button
        onClick={() => scrollTo("bottom")}
        className=" text-white rounded-full shadow-lg hover:bg-gray-200 transition"
      >
        <img src={DownIcon} alt="Tags" width={50} height={50} />
      </button>
    </div>
  );
}
