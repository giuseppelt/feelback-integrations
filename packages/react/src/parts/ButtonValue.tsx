import type { FeelbackValueIcon } from "../types";
import { createIcon } from "./utils";


export type ButtonValueProps = Readonly<{
  isActive?: boolean
  isDisabled?: boolean
  title?: string
  label?: string
  count?: false | number
  icon?: FeelbackValueIcon | readonly [FeelbackValueIcon, FeelbackValueIcon]
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
      {icon && (
        !Array.isArray(icon)
          ? <span className="feelback-icon">{createIcon(icon as FeelbackValueIcon)}</span>
          : (
            <>
              <span className="feelback-icon inactive">{createIcon(icon[0])}</span>
              <span className="feelback-icon active">{createIcon(icon[1])}</span>
            </>
          )
      )}
      {label && <span className="label">{label}</span>}
      {count !== false && <span className="feelback-count">{count}</span>}
    </button>
  )
}
