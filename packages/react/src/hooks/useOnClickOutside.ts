import { useEffect, useRef } from "react";


export function useOnClickOutside<T extends HTMLElement = HTMLElement>(isActive: boolean, callback: () => void) {
    const ref = useRef<T>(null);

    // handler onClick outside picker
    useEffect(() => {
        if (isActive) {
            const handler = (ev: Event) => {
                if (!ev.target || !ref.current?.contains(ev.target as Node)) {
                    callback();
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            };

            document.addEventListener("click", handler, { capture: true });
            return () => document.removeEventListener("click", handler, { capture: true });
        }
    }, [isActive]);

    return ref;
}
