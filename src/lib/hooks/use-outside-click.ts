import React, { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: (event: any) => void) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
