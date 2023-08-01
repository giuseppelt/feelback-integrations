import type { TargetContent } from "@feelback/js";
import type { FeelbackValueDefinition } from "../types";
import { useFeelbackAggregates, useLocalFeelback, useRemoveFeelback, useSendFeelback, useValueTimeout } from "../hooks";
import { ButtonValueList } from "../parts";


export type FeelbackPulseProps = Readonly<TargetContent & {
  preset?: readonly FeelbackValueDefinition[]
  revokable?: boolean
  showCount?: boolean
}>

export function FeelbackPulse(props: FeelbackPulseProps) {
  const {
    showCount,
    preset,
    revokable = true,
    ...content
  } = props;

  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const { value: isDisabled, set: setDisabled } = useValueTimeout(1000); // disable submitting for 1s, to avoid double clicks

  const onClick = () => {
    if (localValue === "+") {
      if (isRevokable) {
        setDisabled(true);
        remove();
      }
    } else {
      setDisabled(true);
      send("+", { revokable });
    }
  };

  if (!preset || preset.length === 0) {
    console.warn("[feelback] Invalid preset or items");
    return null;
  }

  return (
    <div className="feelback-container feelback-pulse" style={{ pointerEvents: isDisabled ? "none" : undefined }}>
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
