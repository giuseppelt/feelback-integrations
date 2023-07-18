import type { TargetContent } from "./content";
import { getFeelbackAggregates, removeFeelback, sendFeelback } from "./feelback";
import { getFeelbackStore, FeelbackStoreType } from "./store";


export * from "./index";


function warn(message: string, ...args: any) {
    console.warn(`[Feelback] ${message}`, ...args);
}

function error(message: string | Error, error?: Error) {
    if (message instanceof Error) {
        error = message;
        message = error?.message;
    }
    console.error(`[Feelback] ${message}`, error);
}


export type FeelbackConfig = {
    store?: FeelbackStoreType
    endpoint?: string
}

export function setupFeelback(config?: FeelbackConfig) {
    if (typeof window === undefined || typeof window.document === undefined) return;

    const endpoint = config?.endpoint;
    const store = getFeelbackStore(config?.store);

    const containers = new Set([
        ...qsa(document, "[data-feelback]"),
        ...qsa(document, "[data-feelback-set]"),
        ...qsa(document, "[data-feelback-content]"),
    ]);

    containers.forEach(container => {
        const config = getConfigFromElement(container)!;
        if (!config) return;

        const target: TargetContent = config.contentId
            ? { contentId: config.contentId }
            : { contentSetId: config.contentSetId!, key: config.key };

        switch (config.component || "buttons") {
            case "buttons": setupComponentSimpleButtons(container, target, config); break;
            case "form": setupComponentForm(container, target, config); break;
            default: return warn("Unknown component: %s", config.component);
        }

        // setup behaviors
        qsa(container, "[data-behavior-action],[data-feelback-action]").forEach(button => {
            const action = button.getAttribute("data-behavior-action") ||
                button.getAttribute("data-feelback-action");
            switch (action) {
                case "switch": return BH.switch.setup(container, button);
                case "popup": return BH.popup.setup(container, button);
                case "dialog": return BH.dialog.setup(container, button);
                case "toggle-class": return BH.toggleClass.setup(container, button);
                case "set-field": return BH.setField.setup(container, button);
            }
        });
    });



    function setupComponentSimpleButtons(container: HTMLElement, target: TargetContent, params: FeelbackContainerConfig) {
        const currentValue = store.getValue(target);
        const isRevokable = store.isRevokable(target);

        const countsLabels = setupCountLabels(container, target, params);

        const buttons = [...qsa(container, "[data-feelback-value]").values()]
            .map(x => [x.getAttribute("data-feelback-value")!, x] as const);

        buttons.forEach(([value, button]) => {
            if (isSameFeelbackValue(currentValue, value)) {
                BUTTON_GROUP.activate(buttons, value);
            }

            if (currentValue !== undefined && !isRevokable) {
                BUTTON_GROUP.disableItem(button);
                return;
            }

            button.addEventListener("click", ev => {
                // need to recheck, due to multiple clicks, elapsed time
                const revokable = store.getRevocable(target);
                const currentValue = store.getValue(target);

                if (isSameFeelbackValue(currentValue, value)) {
                    if (revokable) {
                        disableTimeout(container, 1000); // disable to avoid double clicks
                        removeFeelback({ endpoint, feelbackId: revokable.feelbackId }).then(
                            () => {
                                BUTTON_GROUP.deactivate(buttons, value);
                                COUNT_LABELS.delta(countsLabels, value, -1);
                            },
                            err => {
                                error("Cannot remove feelback", err)
                            }
                        );
                    }
                } else {
                    disableTimeout(container, 1000); // disable to avoid double clicks
                    sendFeelback({ endpoint, ...target, value }).then(
                        () => {
                            BUTTON_GROUP.activate(buttons, value);

                            if (params.behavior === "switch") {
                                BH.switch.run({ container, autoCancel: store.isRevokable(target) });
                            }

                            COUNT_LABELS.delta(countsLabels, String(currentValue ?? "0"), -1);
                            COUNT_LABELS.delta(countsLabels, value, 1);
                        },
                        err => {
                            error("Cannot send feelback", err);
                        });
                }
            });
        });
    }

    function setupComponentForm(container: HTMLElement, target: TargetContent, params: FeelbackContainerConfig) {
        const forms = qsa(container, ".feelback-form");
        if (!forms) return;

        forms.forEach(form => {
            form.addEventListener("submit", ev => {
                ev.preventDefault();
                ev.stopPropagation();

                const { value, metadata } = getFormValue(form) || {};
                if (!value) return;

                disableTimeout(container, 1000); // disable to avoid double clicks                
                sendFeelback({ endpoint, ...target, value, metadata }).then(
                    () => {
                        BH.switch.run({ container });
                        if (params.behavior === "dialog") {
                            BH.dialog.closeActive?.();
                        }
                    },
                    err => {
                        error("Cannot send feelback", err);
                    });
            });
        });
    }

    function disableTimeout(el: HTMLElement, ms: number) {
        el.style.pointerEvents = "none";
        setTimeout(() => {
            el.style.pointerEvents = "";
        }, ms);
    }

    function setupCountLabels(container: HTMLElement, target: TargetContent, params: FeelbackContainerConfig) {
        if (!params.showCount) return [];

        const countsLabels = [...qsa(container, "[data-feelback-count]").values()]
            .map(x => [x.getAttribute("data-feelback-count")!, x.getAttribute("data-feelback-count-index")!, x] as const);

        if (countsLabels.length < 1) return [];

        getFeelbackAggregates({ ...target, endpoint }).then(
            data => {
                countsLabels.forEach(([, idx, label]) => {
                    COUNT_LABELS.setItem(label, data?.[Number(idx)]);
                });
            },
            () => { });

        return countsLabels;
    }
}



export type FeelbackContainerConfig = {
    component?: "buttons" | "form"
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
            warn("Invalid config for element", el);
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
                component: el.getAttribute("data-feelback-component") as any,
                revokable: el.getAttribute("data-feelback-revokable") !== "false",
                behavior: el.getAttribute("data-feelback-behavior") || undefined,
            };
        } catch (err: any) {
            warn("Invalid attributes for element", el);
            return;
        }
    }
}

function isSameFeelbackValue(valueA: any, valueB: any) {
    if (valueA === undefined || valueA === null) return false;
    if (valueA === valueB) return true;
    if (typeof valueA === "object" && valueA?.value === valueB) return true;

    return false;
}


const COUNT_LABELS = {
    delta(items: (readonly [string, string, Element])[], value: string, delta: number) {
        const [, , label] = items.find(([v]) => v === value) || [];
        if (!label) return;
        COUNT_LABELS.set(items, value, Number(label.textContent) + delta);
    },
    set(items: (readonly [string, string, Element])[], value: string, count: number | undefined) {
        items.forEach(([v, , label]) => {
            if (v === value) {
                COUNT_LABELS.setItem(label, count);
            }
        });
    },
    setItem(label: Element, value: number | undefined) {
        label.textContent = (value || 0).toFixed().toString();
        label.setAttribute("data-feelback-count-value", (value || 0).toString());
    }
};



const BUTTON_GROUP = {
    activate(items: (readonly [string, Element])[], value: string) {
        items.forEach(([v, el]) => {
            if (v === value) {
                el.classList.add("active");
            } else {
                el.classList.remove("active", "disabled");
            }
        });
    },

    deactivate(items: (readonly [string, Element])[], value: string) {
        items.forEach(([v, el]) => {
            if (v === value) {
                el.classList.remove("active", "disabled");
            }
        });
    },

    disableItem(el: Element) {
        el.classList.add("disabled");
    }
};


const BH = {
    switch: {
        setup(container: HTMLElement, source: HTMLElement) {
            const sideA = source.hasAttribute("data-behavior-source")
                ? getElement(source.getAttribute("data-behavior-source")!, source?.parentElement, container)
                : source;

            const target = getElement(source.getAttribute("data-behavior-target")!, source?.parentElement, container);
            if (!target) return;

            source.addEventListener("click", ev => {
                BH.switch.run({ container, sideA, sideB: target });
                stopEvent(ev);
            });
        },
        run({ container, sideA, sideB, autoCancel }: {
            container: HTMLElement
            sideA?: string | HTMLElement
            sideB?: string | HTMLElement
            autoCancel?: boolean | number
        }) {
            const sa = getElement(sideA || "[data-behavior-switch-side='a']", container);
            const sb = getElement(sideB || "[data-behavior-switch-side='b']", container);
            if (!sa || !sb) return;

            const sideA_display = sa.style.display;
            sa.style.display = "none";
            sb.style.display = "block";

            if (autoCancel) {
                setTimeout(() => {
                    sb.style.display = "none";
                    sa.style.display = sideA_display;
                }, 5000);
            }
        }
    },
    toggleClass: {
        setup(container: HTMLElement, source: HTMLElement) {
            const target = getTargetAll(source.getAttribute("data-behavior-target")!, source?.parentElement, container);
            if (!target || target.length === 0) return;

            const value = source.getAttribute("data-behavior-value")?.trim();
            if (!value) return;

            const commands = ["on", "off"];
            const directives = value.split(/,|;/).map(x => x.split(":")).filter(([command]) => commands.includes(command)) as [string, string][];

            source.addEventListener("click", ev => {
                BH.toggleClass.run({ container, target, directives });
                stopEvent(ev);
            });
        },
        run({ container, target, directives }: {
            container: HTMLElement
            target: HTMLElement | HTMLElement[]
            directives: [string, string][]
        }) {
            if (!Array.isArray(target)) {
                target = [target];
            }

            target.forEach(t => {
                directives.forEach(([command, value]) => {
                    if (command === "on") {
                        if (!t.classList.contains(value)) {
                            t.classList.add(value);
                        }
                    } else if (command === "off") {
                        if (t.classList.contains(value)) {
                            t.classList.remove(value);
                        }
                    }
                });
            });
        }
    },
    popup: {
        setup(container: HTMLElement, source: HTMLElement) {
            const target = getTarget(source.getAttribute("data-behavior-target") || ".popup", source?.parentElement, container);
            if (!target) return;

            source.addEventListener("click", ev => {
                BH.popup.run({ source, target });
                stopEvent(ev);
            });
        },
        run({ source, target }: { source: HTMLElement, target: HTMLElement }) {
            target.style.display = "block";
            // some naive positioning
            target.style.top = (source.offsetTop - (target.getBoundingClientRect().height - source.getBoundingClientRect().height) / 2) + "px";
            target.style.left = source.offsetLeft + "px";

            // hide on any click
            document.addEventListener("click", () => {
                target.style.display = "none";
            }, { once: true, capture: false });
        }
    },
    dialog: {
        closeActive: undefined as Function | undefined,
        setup(container: HTMLElement, source: HTMLElement) {
            const target = getTarget(source.getAttribute("data-behavior-target") || ".dialog", source?.parentElement, container);
            if (!target) return;

            // detach and move to dom-end
            target.remove();
            const parent = document.createElement("div");
            parent.classList.add("feelback-style");
            parent.append(target);
            document.body.append(parent);

            source.addEventListener("click", ev => {
                BH.dialog.run({ source, target });
                stopEvent(ev);
            });
        },
        run({ source, target }: { source: HTMLElement, target: HTMLElement }) {
            // const bodyOverflow = document.body.style.overflow;
            // document.body.style.overflow = "hidden";
            target.style.display = "block";

            const cancelButtons = [...qsa(target, "[data-behavior-action='cancel']")]
            cancelButtons.forEach(x => {
                x.addEventListener("click", stopEventAndCloseDialog);
            });


            const content = qs(target, ".content");
            // hide on any click
            const onClickOutside = (ev: Event) => {
                if (content?.contains(ev.target as any)) {
                    return;
                }

                stopEventAndCloseDialog(ev);
            };

            document.addEventListener("click", onClickOutside, { capture: true });

            BH.dialog.closeActive = closeDialog;

            function stopEventAndCloseDialog(ev: Event) {
                stopEvent(ev);
                closeDialog();
            }

            function closeDialog() {
                target.style.display = "none";
                // document.body.style.overflow = bodyOverflow;
                document.removeEventListener("click", onClickOutside, { capture: true });
                cancelButtons.forEach(x => x.removeEventListener("click", stopEventAndCloseDialog));
            }
        }
    },
    setField: {
        setup(container: HTMLElement, source: HTMLElement) {
            const group = source.closest("[data-feelback-type='button-group']");
            if (!group) return;

            const field = qs<HTMLInputElement>(group, "[data-feelback-field]");
            const buttons = [...qsa(group, ":scope>button")]
                .map(x => [x.getAttribute("data-feelback-value")!, x] as const);

            const reveal = getElementAll(group.getAttribute("data-reveal"), container);
            const value = source.getAttribute("data-feelback-value")!;
            source.addEventListener("click", ev => {
                BUTTON_GROUP.activate(buttons, value);
                if (field) {
                    field.value = value;
                }

                reveal.forEach(x => x.classList.remove("hidden"));

                stopEvent(ev);
            });
        }
    }
}


function qs<T extends Element = HTMLElement>(el: ParentNode, selector: string) {
    return el.querySelector<T>(selector) || undefined;
}

function qsa<T extends Element = HTMLElement>(el: ParentNode, selector: string) {
    return el.querySelectorAll<T>(selector);
}

function stopEvent(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
}

function getTarget(el: string | HTMLElement, ...containers: (HTMLElement | undefined | null)[]): HTMLElement | undefined {
    if (el === ":container") {
        return containers[containers.length - 1] || undefined;
    }

    return getElement(el, ...containers);
}

function getTargetAll(el: string | HTMLElement, ...containers: (HTMLElement | undefined | null)[]): HTMLElement[] {
    if (el === ":container") {
        return [containers[containers.length - 1] || undefined!].filter(x => !!x);
    }

    return getElementAll(el, ...containers);
}


function getElement(el: string | HTMLElement, ...containers: (HTMLElement | undefined | null)[]): HTMLElement | undefined {
    if (typeof el !== "string") return el || undefined;

    for (const container of containers) {
        if (container) {
            const child = qs(container, el);
            if (child) {
                return child;
            }
        }
    }
}

function getElementAll(el: string | HTMLElement | HTMLElement[] | undefined | null, ...containers: (HTMLElement | undefined | null)[]): HTMLElement[] {
    if (!el) return [];
    if (typeof el !== "string") {
        return Array.isArray(el) ? el : [el];
    }

    for (const container of containers) {
        if (container) {
            const child = qsa(container, el);
            if (child.length) {
                return [...child.values()];
            }
        }
    }

    return [];
}


function getFormValue(form: HTMLElement): { value: any, metadata?: any } | undefined {
    const isSingleValue = form.getAttribute("data-feelback-type") === "form-single";

    const fields = [...qsa(form, "[data-feelback-field]")];
    let value = undefined! as object;
    let metadata = undefined! as object;

    for (const field of fields) {
        const entry = getFieldEntry(field);
        if (!entry) continue;
        if (entry?.$error) return;

        Object.entries(entry).forEach(([key, fieldValue]) => {
            if (key.startsWith("#")) {
                metadata = { ...metadata, [key.substring(1)]: fieldValue };
            } else {
                value = { ...value, [key]: fieldValue };
            }
        });
    }

    if (!value || Object.keys(value).length === 0) {
        return;
    }

    if (isSingleValue) {
        value = Object.values(value).pop(); // pick the last value
    }

    return { value, metadata };
}

function getFieldEntry(el: HTMLElement) {
    let name = el.getAttribute("data-feelback-field") || (el as any).name as string;

    // override name with metadata key
    if (el.hasAttribute("data-feelback-metadata")) {
        // use # prefix to identify metadata keys
        name = "#" + el.getAttribute("data-feelback-metadata")!;
    }

    if (!name) return;

    if (el.tagName === "INPUT") {
        const input = el as HTMLInputElement;
        const value = input.value.trim() || undefined;
        const isRequired = input.required;

        if (input.type === "radio" && !input.checked) return;
        if (!value) return;
        if (!value && isRequired) return { $error: "required" };

        return { [name]: value };
    }

    if (el.tagName === "TEXTAREA") {
        const value = (el as HTMLTextAreaElement).value.trim() || undefined;
        if (!value) return;
        return { [name]: value };
    }

    const type = el.getAttribute("data-feelback-type");
    if (type === "button-group") {
        return { [name]: qs(el, "button.active")?.getAttribute("data-feelback-value") };
    }

    const value = el.getAttribute("data-feelback-value");
    if (value) {
        return { [name]: value };
    }
}
