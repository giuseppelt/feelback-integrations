import type { FeelbackValueIcon } from "../types";
import { ReactElement, createElement, isValidElement, Fragment } from "react";


export function createIcon(icon: FeelbackValueIcon): ReactElement {
    if (typeof icon === "function") {
        return createElement(icon);
    } else if (typeof icon === "object" && "text" in icon) {
        return createElement(Fragment, undefined, [icon.text]);
    } else if (isValidElement(icon)) {
        return icon;
    }

    console.error("Invalid icon", icon);
    throw new Error("Invalid icon");
}


export function mergeCallback(cb1: ((...args: any[]) => void) | undefined, cb2: ((...args: any[]) => void) | undefined) {
    if (!cb1 || !cb2) {
        return cb1 || cb2;
    }

    // wrap and call both
    return function (this: any) {
        cb1.apply(this, arguments as any);
        cb2.apply(this, arguments as any);
    };
}
