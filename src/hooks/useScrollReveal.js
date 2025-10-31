import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    const revealElementOnScroll = () => {
      for (let i = 0, len = revealElements.length; i < len; i++) {
        if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
          revealElements[i].classList.add("revealed");
        } else {
          revealElements[i].classList.remove("revealed");
        }
      }
    };

    const handleScroll = () => revealElementOnScroll();
    const handleLoad = () => revealElementOnScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleLoad);

    // Initial call
    revealElementOnScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", handleLoad);
    };
  }, []);
};

export default useScrollReveal;