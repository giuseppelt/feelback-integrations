
export type AnswerProps = Readonly<{
  text: string
}>

export function Answer(props: AnswerProps) {
  const {
    text,
  } = props;

  return (
    <div className="feelback-a">
      <span className="feelback-text">{text}</span>
    </div>
  );
}
