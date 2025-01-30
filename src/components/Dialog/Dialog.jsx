import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./style.css";

function Dialog({ onClose, children }) {
  const contentRef = useRef();
  const backdropRef = useRef();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyUp);

    blockOutsideAccess();

    return () => {
      unBlockOutsideAccess();
      document.removeEventListener("keydown", handleKeyUp);
    };
  }, []);

  function blockOutsideAccess() {
    const body = document.getElementsByTagName("body")[0];

    [...body.children].forEach((el) => {
      if (!el.getAttribute("data-dialog")) {
        el.setAttribute("aria-hidden", true);
        el.setAttribute("inert", true);
      }
    });
  }

  function unBlockOutsideAccess() {
    const body = document.body;

    [...body.children].forEach((el) => {
      if (!el.getAttribute("data-dialog")) {
        el.removeAttribute("aria-hidden");
        el.removeAttribute("inert");
      }
    });
  }

  function handleKeyUp(e) {
    if (e.key === "Escape") {
      handleClose();
    }

    if (e.key === "Tab") {
      if (document.activeElement.classList.contains("save")) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByClassName("dialog-close")[0].focus();
      }
    }
  }

  function handleClose() {
    contentRef.current.classList.add("hide-dialog");
    backdropRef.current.classList.add("hide-dialog");

    contentRef.current.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  }

  function handleAnimationEnd() {
    onClose();
  }

  return createPortal(
    <div data-dialog="true" className="dialog z-50">
      <div
        onClick={handleClose}
        ref={backdropRef}
        className="dialog-backdrop"
      />
      <div ref={contentRef} className="dialog-content">
        {!!onClose && (
          <button onClick={handleClose} className=" absolute top-0 px-2 right-0 text-2xl font-bold">
            &times;
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Dialog;