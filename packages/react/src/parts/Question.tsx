import { ReactElement, isValidElement } from "react";
import { ButtonValueList, ButtonValueListProps } from ".";


export type QuestionProps = ButtonValueListProps & Readonly<{
  text?: string | ReactElement
}>

export function Question(props: QuestionProps) {
  const {
    text,
    ...buttonProps
  } = props;

  return (
    <div className="feelback-q">
      {text && typeof text === "string" && <span className="feelback-text">{text}</span>}
      {text && isValidElement(text) && text}
      <ButtonValueList {...buttonProps} />
    </div>
  );
}
