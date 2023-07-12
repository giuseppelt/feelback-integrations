import { forwardRef, useRef } from "react";
import { TargetContent } from "@feelback/js";
import { FeelbackLayout, Form, FormHandlerProps } from "../parts";


export type FeelbackMessageProps = Readonly<TargetContent & {
  layout?: "button-switch" | "button-dialog" | "inline"
  label?: string
  textAnswer?: string
}> & Pick<MessageFormProps,
  | "title"
  | "maxLength"
  | "minLength"
  | "placeholder"
  | "withEmail"
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
    withEmail,
    ...content
  } = props;


  return (
    <FeelbackLayout className={`feelback-message layout-${layout}`} {...{ layout, label, ...content }}>
      <MessageForm {...{ title, placeholder, minLength, maxLength, withEmail }} />
    </FeelbackLayout>
  )
}


type MessageFormProps = FormHandlerProps<string> & Readonly<{
  title?: string
  minLength?: number
  maxLength?: number
  placeholder?: string
  withEmail?: boolean | "optional" | "required"
}>

const MessageForm = forwardRef<any, MessageFormProps>((props, ref) => {
  const {
    title = "Send feedback",
    placeholder = "Type your message",
    minLength,
    maxLength,
    withEmail,
    onCancel,
    onSubmit,
  } = props;


  const textRef = useRef<HTMLTextAreaElement>(null);
  const isEmailRequired = withEmail === "required";
  const emailRef = useRef<HTMLInputElement>(null);

  const onValidate = () => {
    const message = textRef.current?.value.trim() || undefined;
    const email = emailRef.current?.value?.trim() || undefined;
    if (!message || (minLength && minLength > 0 && message.length < minLength)) return;
    if ((email && !email.match(/^(.+)@(.+)$/)) || isEmailRequired) return;

    return {
      value: message,
      metadata: email ? { $user: email } : undefined
    };
  };

  return (
    <Form {...{ title, onCancel, onSubmit, ref }} onValidate={onValidate}>
      <textarea ref={textRef}
        required
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
      />
      {withEmail && (
        <input ref={emailRef}
          type="email"
          name="email"
          required={isEmailRequired}
          placeholder={`your@email.com${!isEmailRequired ? " (optional)" : ""}`}
        />
      )}
    </Form>
  );
});
