import { useState } from "react";
import type { TargetContent } from "@feelback/js";
import type { FeelbackValueDefinition } from "../types";
import { useFeelbackAggregates, useOnClickOutside, useLocalFeelback, useRemoveFeelback, useSendFeelback } from "../hooks";
import { ButtonValueList, FeelbackButtonList, Question } from "../parts";
import IconHappy from "@feelback/js/icons/icon-happy.svg";


export type FeelbackReactionProps = Readonly<TargetContent & {
  layout?: "list" | "picker"
  preset?: readonly FeelbackValueDefinition[]
  showCount?: boolean
  textQuestion?: string
  textAnswer?: string
}>

export function FeelbackReaction(props: FeelbackReactionProps) {
  const {
    layout = "list",
    ...rest
  } = props;

  return layout === "picker"
    ? <PickerLayout {...rest} />
    : <FeelbackButtonList className="feelback-reaction layout-list" {...rest} />
}


function PickerLayout(props: FeelbackReactionProps) {
  const {
    showCount = true,
    preset,
    ...content
  } = props;


  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send, isSuccess } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const [isOpen, setOpen] = useState(false);
  const pickerRef = useOnClickOutside<HTMLDivElement>(isOpen, () => setOpen(false));

  const onClickReaction = (value: string) => {
    if (isOpen) {
      setOpen(false);
    }

    if (value === localValue) {
      if (isRevokable) {
        remove();
      }
    } else {
      send(value);
    }
  };


  if (!preset || preset.length === 0) {
    console.warn("[feelback] Invalid preset or items");
    return null;
  }

  return (
    <div className="feelback-container feelback-reaction layout-picker">
      <Question
        text={
          <>
            <button className="feelback-btn btn-reaction-picker" style={isOpen ? { visibility: "hidden" } : undefined} onClick={() => setOpen(true)}>
              <span className="feelback-icon"><IconHappy /></span>
            </button>
            <div ref={pickerRef} className="popup" style={isOpen ? { display: "block", top: "0" } : undefined}>
              <ButtonValueList items={preset} onClick={onClickReaction} />
            </div>
          </>
        }
        items={preset}
        hideZero
        showCount={showCount}
        counts={counts}
        isDisabled={isOpen || (localValue !== undefined && !isRevokable)}
        active={localValue}
        onClick={onClickReaction}
      />
    </div>
  );
}
