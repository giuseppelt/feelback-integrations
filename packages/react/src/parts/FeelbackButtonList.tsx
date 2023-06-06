import type { TargetContent } from "@feelback/js";
import type { FeelbackValueDefinition } from "../types";
import { useFeelbackAggregates, useTimeout, useLocalFeelback, useRemoveFeelback, useSendFeelback } from "../hooks";
import { Answer, Question } from ".";


export type FeelbackButtonListProps = Readonly<TargetContent & {
  className?: string
  preset?: readonly FeelbackValueDefinition[]
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
