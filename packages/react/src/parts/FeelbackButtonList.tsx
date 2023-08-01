import type { TargetContent } from "@feelback/js";
import type { FeelbackValueDefinition } from "../types";
import { useFeelbackAggregates, useTimeout, useLocalFeelback, useRemoveFeelback, useSendFeelback, useValueTimeout } from "../hooks";
import { Answer, Question } from ".";


export type FeelbackButtonListProps = Readonly<TargetContent & {
  className?: string
  preset?: readonly FeelbackValueDefinition[]
  revokable?: boolean
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
    revokable = true,
    ...content
  } = props;

  const { value: localValue, isRevokable } = useLocalFeelback(content) || {};
  const { data: counts } = useFeelbackAggregates(content, { paused: !showCount });
  const { call: send, isSuccess, reset } = useSendFeelback(content);
  const { call: remove } = useRemoveFeelback(content);

  const { value: isDisabled, set: setDisabled } = useValueTimeout(1000); // disable submitting for 1s, to avoid double clicks

  const isAnswerVisible = textAnswer && isSuccess;

  const onClick = (value: string) => {
    if (value === localValue) {
      if (isRevokable) {
        setDisabled(true);
        remove();
      }
    } else {
      setDisabled(true);
      send(value, { revokable });
    }
  };

  useTimeout(5000, isSuccess, reset);


  if (!preset || preset.length === 0) {
    console.warn("[feelback] Invalid preset or items");
    return null;
  }

  return (
    <div className={`feelback-container${className ? " " + className : ""}`} style={{ pointerEvents: isDisabled ? "none" : undefined }}>
      {!isAnswerVisible &&
        <Question text={textQuestion}
          items={preset}
          showCount={showCount}
          counts={counts}
          isDisabled={localValue !== undefined && !isRevokable}
          active={localValue}
          onClick={onClick}
        />
      }

      {isAnswerVisible &&
        <Answer text={textAnswer} />
      }
    </div>
  );
}
