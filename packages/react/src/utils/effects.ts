
export function mergeEffect(...effects: (() => void)[]): () => void {
    return () => effects.forEach(x => x());
}

export function timeoutEffect(ms: number, func: () => void) {
    let timeout = setTimeout(func, ms);
    return () => clearTimeout(timeout);
}


export function windowEventEffect<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any) {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
}

export function windowEventEffectOnce<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any) {
    const handler = function (this: Window, ev: WindowEventMap[K]) {
        const ret = listener.call(this, ev);
        this.window.removeEventListener(type, handler);
        return ret;
    };

    return windowEventEffect(type, handler);
}

export function documentEventEffect<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any) {
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
}

export function documentEventOnceEffect<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any) {
    const handler = function (this: Document, ev: DocumentEventMap[K]) {
        const ret = listener.call(this, ev);
        document.removeEventListener(type, handler);
        return ret;
    };

    return documentEventEffect(type, handler);
}
