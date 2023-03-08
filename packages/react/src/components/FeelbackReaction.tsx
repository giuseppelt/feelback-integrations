import type { TargetContent } from "@feelback/js";
import { useFeelbackAggregates, useLocalFeelback, useRemoveFeelback, useSendFeelback } from "../hooks";
import { ButtonValueDef, ButtonValueList, FeelbackButtonList } from "../parts";
import IconHappy from "@feelback/js/icons/icon-happy.svg";
import { useEffect, useRef, useState } from "react";


export type FeelbackReactionProps = Readonly<TargetContent & {
  layout?: "list" | "picker"
  preset?: readonly ButtonValueDef[]
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
    : <FeelbackButtonList {...rest} />
}


function PickerLayout(props: FeelbackReactionProps) {
  const {
    showCount = true,
    preset,
    ...content
  } = props;


  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send, isSuccess, reset } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const pickerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);

  // handler onClick outsider picker when isOpen
  useEffect(() => {
    if (isOpen) {
      const handler = (ev: Event) => {
        if (!ev.target || !pickerRef.current?.contains(ev.target as Node)) {
          setOpen(false);
          ev.stopPropagation();
          ev.preventDefault();
        }
      };

      document.addEventListener("click", handler, { capture: true });
      return () => document.removeEventListener("click", handler, { capture: true });
    }
  }, [isOpen]);


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
    <div className="feelback-container">
      <button className="feelback-btn btn-picker" style={isOpen ? { visibility: "hidden" } : undefined} onClick={() => setOpen(true)}>
        <span className="feelback-icon"><IconHappy /></span>
      </button>
      <div ref={pickerRef} className="picker" style={isOpen ? { display: "block", top: "0" } : undefined}>
        <ButtonValueList items={preset} onClick={onClickReaction} />
      </div>

      <ButtonValueList
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
