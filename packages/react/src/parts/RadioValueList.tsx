import { ReactElement, useId } from "react";
import { FeelbackValueDefinition } from "../types";
import { RadioValue } from ".";


export type RadioValueListProps = Readonly<{
  active?: unknown
  isDisabled?: boolean
  items: readonly FeelbackValueDefinition[]
  onRenderAddon?: (entry: { item: FeelbackValueDefinition, isSelected: boolean, isDisabled: boolean }) => ReactElement | undefined | null | false | void
  onSelected?: (value: string) => void
}>

export function RadioValueList(props: RadioValueListProps) {
  const {
    active,
    isDisabled = false,
    items,
    onRenderAddon,
    onSelected,
  } = props;

  const group = `rg-${useId()}`;

  return (
    <fieldset className="feelback-radio-group">
      {items.map(item =>
        <div key={item.value} className="feelback-radio-item-wrap">
          <RadioValue group={group} checked={active === item.value} value={item.value} label={item.title} description={item.description} onSelected={() => onSelected?.(item.value)} />
          {onRenderAddon?.({ item, isSelected: active === item.value, isDisabled }) || null}
        </div>
      )}
    </fieldset>
  );
}
