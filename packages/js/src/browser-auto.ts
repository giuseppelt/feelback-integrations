import * as feelback from "./browser";


declare global {
    interface Window {
        feelback: typeof feelback
    }
}


// assign to global variable
if (typeof window !== "undefined") {
    window.feelback = feelback;
}

// run auto setup
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        feelback.setupFeelback();
    });
}
