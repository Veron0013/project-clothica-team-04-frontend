import { useState, useEffect } from "react";

const DESKTOP_BREAKPOINT = 1440;
const BASE_LIMIT = 4;
const DESKTOP_LIMIT = 6;

export const useIsDesktop = () => {
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setLimit(DESKTOP_LIMIT);
      } else {
        setLimit(BASE_LIMIT);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return limit;
};
