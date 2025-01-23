import { useEffect } from "react";

export function useKey(key, action, initialFocusRef = null) {
  useEffect(() => {
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }

    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [key, action, initialFocusRef]);
}
