import { forwardRef, useRef, useState } from "react";
import { TargetContent } from "@feelback/js";
import { ButtonValueDef, ButtonValueList, FeelbackButtonForm, Form, FormHandlerProps } from "../parts";


export type FeelbackTaggedMessageProps = Readonly<TargetContent & {
  layout?: "button-switch" | "button-dialog" | "inline"
  label?: string
  textAnswer?: string
}> & Pick<TaggedMessageFormProps,
  | "title"
  | "preset"
  | "maxLength"
  | "minLength"
  | "placeholder"
>

export function FeelbackTaggedMessage(props: FeelbackTaggedMessageProps) {
  const {
    layout = "button-switch",
    label = "Send feedback",
    preset,
    title,
    placeholder,
    minLength,
    maxLength,
    textAnswer = "Thanks for your feedback",
    ...content
  } = props;


  return (
    <FeelbackButtonForm className={`feelback-tagged-message layout-${layout}`} {...{ layout, label, ...content }}>
      <TaggedMessageForm {...{ title, preset, placeholder, minLength, maxLength }} />
    </FeelbackButtonForm>
  )
}


type TaggedMessageFormProps = FormHandlerProps<{ tag: string, message: string }> & Readonly<{
  preset: readonly ButtonValueDef[]
  title?: string
  minLength?: number
  maxLength?: number
  placeholder?: string
}>

const TaggedMessageForm = forwardRef<any, TaggedMessageFormProps>((props, ref) => {
  const {
    title = "Send feedback",
    preset,
    placeholder = "Type your message",
    minLength,
    maxLength,
    onCancel,
    onSubmit,
  } = props;


  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [tag, setTag] = useState(preset[0][0]);

  const onValidate = () => {
    const message = messageRef.current?.value.trim() || undefined;
    if (!message || !tag) return;

    return {
      tag,
      message,
    };
  }

  return (
    <Form {...{ title, onCancel, onSubmit, ref }} onValidate={onValidate}>
      <ButtonValueList items={preset} showLabels active={tag} onClick={setTag} />
      <textarea ref={messageRef}
        required
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
      />
    </Form>
  );
});
