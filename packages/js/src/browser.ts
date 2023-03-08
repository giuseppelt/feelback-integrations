import type { TargetContent } from "./content";
import { getFeelbackAggregates, removeFeelback, sendFeelback } from "./feelback";
import { getFeelbackStore, FeelbackStoreType } from "./store";


export * from "./index";

export type FeelbackConfig = {
    store?: FeelbackStoreType
    endpoint?: string
}

export function setupFeelback(config?: FeelbackConfig) {
    if (typeof window === undefined || typeof window.document === undefined) return;

    const endpoint = config?.endpoint;
    const store = getFeelbackStore(config?.store);

    const containers = new Set([
        ...document.querySelectorAll("[data-feelback]"),
        ...document.querySelectorAll("[data-feelback-set]"),
        ...document.querySelectorAll("[data-feelback-content]"),
    ]);

    containers.forEach(container => {
        const config = getConfigFromElement(container);
        if (!config) return;

        const target: TargetContent = config.contentId
            ? { contentId: config.contentId }
            : { contentSetId: config.contentSetId!, key: config.key };

        const currentValue = store.getValue(target);
        const isRevokable = store.isRevokable(target);

        const buttons = [...container.querySelectorAll<HTMLElement>("[data-feelback-value]").values()]
            .map(x => [x.getAttribute("data-feelback-value")!, x] as const);
        const countsLabels = !config.showCount ? [] :
            [...container.querySelectorAll("[data-feelback-count]").values()]
                .map(x => [x.getAttribute("data-feelback-count")!, x.getAttribute("data-feelback-count-index")!, x] as const);

        buttons.forEach(([value, button]) => {
            if (isSameValue(currentValue, value)) {
                activate(buttons, value);
            }

            if (currentValue !== undefined && !isRevokable) {
                disable(button);
                return;
            }

            button.addEventListener("click", ev => {
                // need to recheck, due to multiple clicks, elapsed time
                const revokable = store.getRevocable(target);
                const currentValue = store.getValue(target);

                if (isSameValue(currentValue, value)) {
                    if (revokable) {
                        removeFeelback({ endpoint, feelbackId: revokable.feelbackId })
                            .then(() => {
                                deactivate(buttons, value);
                                deltaCounts(countsLabels, value, -1);
                            })
                            .catch(() => { });
                    }
                } else {
                    sendFeelback({ endpoint, ...target, value })
                        .then(() => {
                            activate(buttons, value);
                            performBehavior(container, config.behavior, store.isRevokable(target));
                            deltaCounts(countsLabels, String(currentValue ?? "0"), -1);
                            deltaCounts(countsLabels, value, 1);
                        })
                        .catch(() => { });
                }
            });
        });

        // setup pickers

        container.querySelector(".btn-picker")?.addEventListener("click", ev => {
            const btn = ev.target as HTMLElement;
            const picker = container.querySelector<HTMLElement>(".picker");
            if (!picker) return;

            picker.style.display = "block";
            // some naive positioning
            picker.style.top = (btn.offsetTop - picker.getBoundingClientRect().height - 4) + "px";
            picker.style.left = btn.offsetLeft + "px";
            ev.stopPropagation();

            document.addEventListener("click", () => {
                picker.style.display = "none";
            }, { once: true, capture: false });
        });

        if (config.showCount && countsLabels.length > 0) {
            getFeelbackAggregates({ ...target, endpoint }).then(data => {
                countsLabels.forEach(([, idx, label]) => {
                    setSingleCount(label, data?.[Number(idx)]);
                });
            }).catch(() => { });
        }
    });
}



export type FeelbackContainerConfig = {
    contentSetId?: string
    key?: string
    contentId?: string
    revokable?: boolean
    behavior?: string
    expire?: number
    showCount?: boolean
}

export function getConfigFromElement(el: Element): FeelbackContainerConfig | undefined {
    const config = el.getAttribute("data-feelback");

    if (typeof config === "string") {
        try {
            return JSON.parse(config);
        } catch (err) {
            console.warn("[Feelback] Invalid feelback config for element", el);
            return;
        }
    }

    let target = undefined;

    const contentSetId = el.getAttribute("data-feelback-set");
    if (contentSetId) {
        target = {
            contentSetId,
            key: el.getAttribute("data-feelback-key") || undefined,
        };
    } else {
        const contentId = el.getAttribute("data-feelback-content");
        if (contentId) {
            target = {
                contentId
            };
        }
    }

    if (target) {
        // get config for individual data-* attributes
        try {
            return {
                ...target,
                revokable: el.getAttribute("data-feelback-revokable") !== "false",
                behavior: el.getAttribute("data-feelback-behavior") || undefined,
            };
        } catch (err: any) {
            console.warn(err.message);
            return;
        }
    }
}

function isSameValue(feelbackValue: any, buttonValue: any) {
    if (feelbackValue === undefined || feelbackValue === null) return false;
    if (feelbackValue === buttonValue) return true;
    if (typeof feelbackValue === "object" && feelbackValue?.value === buttonValue) return true;

    return false;
}

function activate(items: (readonly [string, Element])[], value: string) {
    items.forEach(([v, el]) => {
        if (v === value) {
            el.classList.add("active");
        } else {
            el.classList.remove("active", "disabled");
        }
    });
}

function deactivate(items: (readonly [string, Element])[], value: string) {
    items.forEach(([v, el]) => {
        if (v === value) {
            el.classList.remove("active", "disabled");
        }
    });
}

function disable(el: Element) {
    el.classList.add("disabled");
}

function performBehavior(container: Element, behavior?: string, revocable?: boolean) {
    BEHAVIORS[behavior as keyof typeof BEHAVIORS]?.(container, revocable || false);
}

function deltaCounts(items: (readonly [string, string, Element])[], value: string, delta: number) {
    const [, , label] = items.find(([v]) => v === value) || [];
    if (!label) return;
    setCounts(items, value, Number(label.textContent) + delta);
}
function setCounts(items: (readonly [string, string, Element])[], value: string, count: number | undefined) {
    items.forEach(([v, , label]) => {
        if (v === value) {
            setSingleCount(label, count);
        }
    });
}

function setSingleCount(label: Element, value: number | undefined) {
    label.textContent = (value || 0).toFixed().toString();
    label.setAttribute("data-feelback-count-value", (value || 0).toString());
}


const BEHAVIORS = {
    "switch": (container, revokable) => {
        const containerQ = container.querySelector<HTMLElement>(".feelback-q");
        const containerA = container.querySelector<HTMLElement>(".feelback-a");
        if (!containerQ || !containerA) {
            return;
        }

        const containerQDisplay = containerQ.style.display;
        containerQ.style.display = "none";
        containerA.style.display = "block";

        if (revokable) {
            setTimeout(() => {
                containerA.style.display = "none";
                containerQ.style.display = containerQDisplay;
            }, 5000);
        }
    }
} as Record<string, (container: Element, revocable: boolean) => void>
