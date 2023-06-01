import { useEffect, useReducer, useRef } from "react";
import { useIsMounted } from ".";


export type UseAsyncCallOptions = Readonly<{
    paused?: boolean
}>

type State<T = unknown> = Readonly<{
    data?: T
    isLoading: boolean
    isCompleted: boolean
    isSuccess: boolean
    isError: boolean
    error: Error | undefined
}>

type Output<O, I extends any[]> = State<O> & Readonly<{
    reset(): void
    call(...input: I): Promise<State<O>>
    exec(...input: I): Promise<O>
}>


type StateAction<T> = Readonly<
    | { type: "LOADING" }
    | { type: "SUCCESS", data: T }
    | { type: "ERROR", error: Error }
    | { type: "RESET" }
>

const INITIAL_STATE = {
    data: undefined,
    isLoading: false,
    isCompleted: false,
    isSuccess: false,
    isError: false,
    error: undefined,
};


export function useAsyncCall<O, I extends any[]>(func: (...input: I) => Promise<O>): Output<O, I>;
export function useAsyncCall<O>(func: () => Promise<O>, deps?: any[], options?: UseAsyncCallOptions): Output<O, []>;
export function useAsyncCall<O, I extends any[]>(func: (...args: any[]) => Promise<O>, deps?: any[], options?: UseAsyncCallOptions): Output<O, I> {
    const callId = useRef(0);
    const isMounted = useIsMounted();
    const isPaused = !!options?.paused;
    const isInitialLoading = !!deps && !isPaused;

    const [state, dispatch] = useReducer(reducer, isInitialLoading, isLoading => ({ ...INITIAL_STATE, isLoading }));

    async function call(...args: any[]) {
        const actualCallId = ++callId.current;
        try {
            if (!state.isLoading) {
                dispatch({ type: "LOADING" });
            }

            const data = await func(...args);

            if (isMounted() && actualCallId === callId.current) {
                dispatch({ type: "SUCCESS", data });
            }

            return reducer(state as any, { type: "SUCCESS", data });

        } catch (error: any) {
            if (isMounted() && actualCallId === callId.current) {
                dispatch({ type: "ERROR", error });
            }

            return reducer(state, { type: "ERROR", error });
        }
    }

    const exec = async (...args: any[]) => {
        const result = await call(...args);
        if (result.error) {
            throw result.error;
        }

        return result.data;
    };

    const reset = () => {
        dispatch({ type: "RESET" });
    };


    useEffect(() => {
        if (!isPaused && deps) {
            call();
        }
    }, [isPaused, ...deps || []]);

    return {
        ...state as State<O>,
        call,
        exec,
        reset,
    };
}


function reducer<T, S extends State<T>>(state: S, action: StateAction<T>): S {
    switch (action.type) {
        case "LOADING": return {
            ...INITIAL_STATE as any,
            isLoading: true,
            data: state.data,
        };

        case "SUCCESS": return {
            ...INITIAL_STATE as any,
            isCompleted: true,
            isSuccess: true,
            data: action.data,
        };

        case "ERROR": return {
            ...INITIAL_STATE as any,
            isCompleted: true,
            error: action.error,
            isError: true,
        };

        case "RESET": return {
            ...INITIAL_STATE as any,
        };

        default:
            const _: never = action;
            throw new Error("unknown action");
    }
}
