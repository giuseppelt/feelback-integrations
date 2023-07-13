import { ReactElement, forwardRef, useRef } from "react";
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
  | "slots"
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
    slots,
    ...content
  } = props;


  return (
    <FeelbackLayout className={`feelback-message layout-${layout}`} {...{ layout, label, ...content }}>
      <MessageForm {...{ title, placeholder, minLength, maxLength, withEmail, slots }} />
    </FeelbackLayout>
  )
}


type MessageFormProps = FormHandlerProps<string> & Readonly<{
  title?: string
  minLength?: number
  maxLength?: number
  placeholder?: string | false
  withEmail?: boolean | "optional" | "required"
  slots?: {
    BeforeMessage?: ReactElement
    BeforeEmail?: ReactElement
    BeforeFormButtons?: ReactElement
  }
}>

const MessageForm = forwardRef<any, MessageFormProps>((props, ref) => {
  const {
    title = "Send feedback",
    placeholder = "Type your message",
    minLength,
    maxLength,
    withEmail,
    slots,
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
    <Form {...{ slots, title, onCancel, onSubmit, ref }} onValidate={onValidate}>
      {slots?.BeforeMessage}
      <textarea ref={textRef}
        required
        placeholder={placeholder || undefined}
        minLength={minLength}
        maxLength={maxLength}
      />

      {withEmail && (
        <>
          {slots?.BeforeEmail}
          <input ref={emailRef}
            type="email"
            name="email"
            required={isEmailRequired}
            placeholder={`your@email.com${!isEmailRequired ? " (optional)" : ""}`}
          />
        </>
      )}
    </Form>
  );
});
