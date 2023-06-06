import { FeelbackValueDefinition } from "../types";
import { ButtonValue } from ".";


export type ButtonValueListProps = Readonly<{
  active?: unknown
  hideZero?: boolean
  hideZeroCount?: boolean
  showTitle?: boolean
  showCount?: boolean
  showLabels?: boolean
  isDisabled?: boolean
  items: readonly FeelbackValueDefinition[]
  counts?: readonly number[]
  onClick?: (value: string) => void
}>

export function ButtonValueList(props: ButtonValueListProps) {
  const {
    active,
    showCount = false,
    showLabels = false,
    showTitle = !showLabels,
    hideZero = false,
    hideZeroCount = true,
    isDisabled = false,
    items,
    counts,
    onClick,
  } = props;

  return (
    <div className={`feelback-buttons${showCount && items.length > 1 ? " with-count" : ""}`}>
      {items.map(({ value, icon, title }, idx) => {
        // if a value is active, force it to 1
        // even if count is 0, 
        const count = counts?.[idx] || (active === value ? 1 : 0);
        if (hideZero && count <= 0) {
          return null;
        }

        return (
          <ButtonValue
            key={value}
            title={showTitle && title || undefined}
            label={showLabels && title || undefined}
            icon={icon}
            count={showCount && count || (hideZeroCount ? undefined : 0)}
            isDisabled={isDisabled}
            isActive={active === value}
            onClick={() => onClick?.(value)}
          />
        );
      })}
    </div>
  );
}
