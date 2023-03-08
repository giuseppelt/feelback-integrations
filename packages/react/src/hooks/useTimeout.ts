import { useCallback, useEffect, useRef, useState } from "react";
import { timeoutEffect } from "../utils";



export function useTimeout<T>(timeout = 5000, condition: T, callback: (value: T) => void) {
    useEffect(() => {
        if (condition) {
            return timeoutEffect(timeout, () => callback(condition));
        }
    }, [condition]);
}

export function useValueTimeout<T = boolean>(timeout = 5000, initialState = false) {
    const initialValue = useRef<any>(initialState);
    const [state, setState] = useState<any>();

    const reset = useCallback(() => setValue(initialValue.current), []);
    const setValue = useCallback((v?: T) => setState(v ?? true), []);

    useTimeout(timeout, state, reset);

    return {
        value: state as T,
        set: setValue,
        reset
    };
}
