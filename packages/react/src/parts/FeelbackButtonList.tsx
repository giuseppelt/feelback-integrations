import type { TargetContent } from "@feelback/js";
import { useFeelbackAggregates, useLocalFeelback, useRemoveFeelback, useSendFeelback } from "../hooks";
import { useTimeout } from "../hooks/useTimeout";
import { ButtonValueDef, ButtonValueList } from ".";


export type FeelbackButtonListProps = Readonly<TargetContent & {
  className?: string
  preset?: readonly ButtonValueDef[]
  showCount?: boolean
  textQuestion?: string
  textAnswer?: string
}>

export function FeelbackButtonList(props: FeelbackButtonListProps) {
  const {
    className,
    showCount,
    preset,
    textQuestion,
    textAnswer,
    ...content
  } = props;

  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send, isSuccess, reset } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const isAnswerVisible = textAnswer && isSuccess;

  const onClick = (value: string) => {
    if (value === localValue) {
      if (isRevokable) {
        remove();
      }
    } else {
      send(value);
    }
  };

  useTimeout(5000, isSuccess, reset);


  if (!preset || preset.length === 0) {
    console.warn("[feelback] Invalid preset or items");
    return null;
  }

  return (
    <div className={`feelback-container${className ? " " + className : ""}`}>
      {!isAnswerVisible &&
        <div className="feelback-q">
          {textQuestion && <span className="feelback-text">{textQuestion}</span>}
          <ButtonValueList
            items={preset}
            showCount={showCount}
            counts={counts}
            isDisabled={localValue !== undefined && !isRevokable}
            active={localValue}
            onClick={onClick}
          />
        </div>
      }

      {isAnswerVisible &&
        <div className="feelback-a">
          <span className="feelback-text">{textAnswer}</span>
        </div>
      }
    </div>
  );
}
