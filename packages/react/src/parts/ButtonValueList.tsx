import { ButtonIcon, ButtonValue } from "./ButtonValue";


export type ButtonValueDef = readonly [value: string, icon: ButtonIcon | readonly [ButtonIcon, ButtonIcon], title: string | undefined]

export type ButtonValueListProps = Readonly<{
  active?: unknown
  hideZero?: boolean
  showTitle?: boolean
  showCount?: boolean
  isDisabled?: boolean
  items: readonly ButtonValueDef[]
  counts?: readonly number[]
  onClick?: (value: string) => void
}>

export function ButtonValueList(props: ButtonValueListProps) {
  const {
    active,
    showTitle = true,
    showCount = false,
    hideZero = false,
    isDisabled = false,
    items,
    counts,
    onClick,
  } = props;

  return (
    <div className={`feelback-buttons ${showCount ? "with-count" : ""} ${hideZero ? "hide-zero" : ""}`}>
      {items.map(([value, icon, title], idx) => {
        if (hideZero && (counts?.[idx] || 0) <= 0) {
          return null;
        }

        return (
          <ButtonValue
            key={value}
            title={showTitle && title || undefined}
            icon={icon}
            count={showCount && counts?.[idx]}
            isDisabled={isDisabled}
            isActive={active === value}
            onClick={() => onClick?.(value)}
          />
        );
      })}
    </div>
  );
}
