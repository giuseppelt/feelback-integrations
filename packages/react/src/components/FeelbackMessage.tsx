import { forwardRef, useRef } from "react";
import { TargetContent } from "@feelback/js";
import { FeelbackButtonForm, Form, FormHandlerProps } from "../parts";


export type FeelbackMessageProps = Readonly<TargetContent & {
  layout?: "button-switch" | "button-dialog" | "inline"
  label?: string
  textAnswer?: string
}> & Pick<MessageFormProps,
  | "title"
  | "maxLength"
  | "minLength"
  | "placeholder"
>

export function FeelbackMessage(props: FeelbackMessageProps) {
  const {
    layout = "button-switch",
    label = "Send feedback",
    title,
    placeholder,
    minLength,
    maxLength,
    textAnswer = "Thanks for your feedback",
    ...content
  } = props;


  return (
    <FeelbackButtonForm className={`feelback-message layout-${layout}`} {...{ layout, label, ...content }}>
      <MessageForm {...{ title, placeholder, minLength, maxLength }} />
    </FeelbackButtonForm>
  )
}


type MessageFormProps = FormHandlerProps<string> & Readonly<{
  title?: string
  minLength?: number
  maxLength?: number
  placeholder?: string
}>

const MessageForm = forwardRef<any, MessageFormProps>((props, ref) => {
  const {
    title = "Send feedback",
    placeholder = "Type your message",
    minLength,
    maxLength,
    onCancel,
    onSubmit,
  } = props;


  const textRef = useRef<HTMLTextAreaElement>(null);

  const onValidate = () => {
    return textRef.current?.value.trim() || undefined;
  };

  return (
    <Form {...{ title, onCancel, onSubmit, ref }} onValidate={onValidate}>
      <textarea ref={textRef}
        required
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
      />
    </Form>
  );
});
