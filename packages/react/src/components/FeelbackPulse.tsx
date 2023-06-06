import type { TargetContent } from "@feelback/js";
import type { FeelbackValueDefinition } from "../types";
import { useFeelbackAggregates, useLocalFeelback, useRemoveFeelback, useSendFeelback } from "../hooks";
import { ButtonValueList } from "../parts";


export type FeelbackPulseProps = Readonly<TargetContent & {
  preset?: readonly FeelbackValueDefinition[]
  showCount?: boolean
}>

export function FeelbackPulse(props: FeelbackPulseProps) {
  const {
    showCount,
    preset,
    ...content
  } = props;

  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const onClick = () => {
    if (localValue === "+") {
      if (isRevokable) {
        remove();
      }
    } else {
      send("+");
    }
  };

  if (!preset || preset.length === 0) {
    console.warn("[feelback] Invalid preset or items");
    return null;
  }

  return (
    <div className="feelback-container feelback-pulse">
      <ButtonValueList
        items={preset}
        showCount={showCount}
        counts={counts}
        isDisabled={localValue !== undefined && !isRevokable}
        active={localValue}
        onClick={onClick} />
    </div>
  );
}
