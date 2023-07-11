import { useRef } from "react";

// polyfill for react17
export function useId() {
    const id = useRef("");
    if (!id.current) {
        id.current = "i" + Math.random().toString().substring(2);
    }

    return id.current;
}
