import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
      >
        <FaArrowUp size={24} />
      </button>
      <button
        onClick={() => scrollTo("bottom")}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
      >
        <FaArrowDown size={24} />
      </button>
    </div>
  );
}
