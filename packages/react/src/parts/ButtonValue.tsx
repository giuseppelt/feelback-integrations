import { ReactElement, FC, ComponentClass, createElement, isValidElement } from "react";


export type ButtonIcon = ReactElement | FC | ComponentClass | { text: string }

export type ButtonValueProps = Readonly<{
  isActive?: boolean
  isDisabled?: boolean
  title?: string
  label?: string
  count?: false | number
  icon: ButtonIcon | readonly [ButtonIcon, ButtonIcon]
  onClick?: () => void
}>

export function ButtonValue(props: ButtonValueProps) {
  const {
    count = false,
    isActive = false,
    isDisabled = false,
    label,
    title,
    icon,
    onClick,
  } = props;

  return (
    <button title={title} className={`feelback-btn ${isDisabled ? "disabled" : ""} ${isActive ? "active" : ""}`} onClick={onClick}>
      {!Array.isArray(icon)
        ? <span className="feelback-icon">{createIcon(icon as ButtonIcon)}</span>
        : (
          <>
            <span className="feelback-icon inactive">{createIcon(icon[0])}</span>
            <span className="feelback-icon active">{createIcon(icon[1])}</span>
          </>
        )}
      {label && <span className="label">{label}</span>}
      {count !== false && <span className="feelback-count">{count}</span>}
    </button>
  )
}


function createIcon(icon: ButtonIcon): ReactElement {
  if (typeof icon === "function") {
    return createElement(icon);
  } else if (typeof icon === "object" && "text" in icon) {
    return <>{icon.text}</>
  } else if (isValidElement(icon)) {
    return icon;
  }

  console.error("Invalid icon", icon);
  throw new Error("Invalid icon");
}
