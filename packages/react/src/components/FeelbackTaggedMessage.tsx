import { ReactElement, ReactNode, forwardRef, useRef, useState } from "react";
import { TargetContent } from "@feelback/js";
import { ButtonValueList, FeelbackLayout, Form, FormHandlerProps, Question, RadioValueList } from "../parts";
import { FeelbackValueDefinition } from "../types";
import type { OneOrMany } from "../utils";


export type FeelbackTaggedMessageProps = Readonly<TargetContent & {
  layout?: "button-switch" | "button-dialog" | "inline" | "radio-group" | "radio-group-dialog" | "reveal-message"
  style?: OneOrMany<"bordered" | `width-${"sm" | "md"}` | `align-center`>
  label?: string
  textAnswer?: string
  preset?: readonly FeelbackValueDefinition[]
  onSuccess?: () => void
}> & Partial<Pick<TaggedMessageFormProps,
  | "title"
  | "tags"
  | "active"
  | "maxLength"
  | "minLength"
  | "placeholder"
  | "showLabels"
  | "withEmail"
  | "onCancel"
  | "slots"
>>

export function FeelbackTaggedMessage(props: FeelbackTaggedMessageProps) {
  const {
    layout = "button-switch",
    label = "Send feedback",
    preset,
    tags = preset,
    active,
    title,
    placeholder,
    minLength,
    maxLength,
    textAnswer = "Thanks for your feedback",
    showLabels = false,
    style: _style,
    withEmail,
    onCancel,
    onSuccess,
    slots,
    ...content
  } = props;

  if (!tags) {
    console.warn("Missing tags");
    return null;
  }

  const style = (_style && Array.isArray(_style)) ? _style.join(" ") : _style || undefined;

  return (
    <FeelbackLayout className={`feelback-tagged-message layout-${layout} ${style}`}
      {...{ layout, label, onSuccess, ...content }}
    >
      <TaggedMessageForm {...{ title, tags, showLabels, placeholder, minLength, maxLength, withEmail, onCancel, slots }}
        layout={layout === "reveal-message" ? layout : layout === "radio-group" || layout === "radio-group-dialog" ? "radio-group" : "form"}
      />
    </FeelbackLayout>
  );
}


type TaggedMessageFormProps = FormHandlerProps<{ tag: string, message?: string }> & Readonly<{
  layout: "form" | "radio-group" | "reveal-message"
  tags: readonly FeelbackValueDefinition[]
  active?: "$auto" | (string & {})
  showLabels?: boolean
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

const TaggedMessageForm = forwardRef<any, TaggedMessageFormProps>((props, ref) => {
  const {
    layout,
    title = "Send feedback",
    active,
    tags,
    showLabels = true,
    placeholder = "Type your message",
    minLength,
    maxLength,
    withEmail,
    slots,
    onCancel,
    onSubmit,
  } = props;

  const isMessageRequired = !!minLength && minLength > 0;
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const isEmailRequired = withEmail === "required";
  const emailRef = useRef<HTMLInputElement>(null);
  const [tag, setTag] = useState(active === "$auto" ? tags[0].value : active);

  const onValidate = () => {
    const message = messageRef.current?.value?.trim() || undefined;
    const email = emailRef.current?.value?.trim() || undefined;

    if (!tag) return;
    if (isMessageRequired && (!message || message.length < minLength)) return;
    if ((email && !email.match(/^(.+)@(.+)$/)) || isEmailRequired) return;

    return {
      value: {
        tag,
        message,
      },
      metadata: email ? { $user: email } : undefined
    };
  }


  const MessageInput = (
    <>
      {slots?.BeforeMessage}
      <textarea ref={messageRef}
        required={isMessageRequired}
        placeholder={placeholder || undefined}
        minLength={minLength}
        maxLength={maxLength}
      />
    </>
  );

  const EmailInput = withEmail && (
    <>
      {slots?.BeforeEmail}
      <input ref={emailRef}
        type="email"
        name="email"
        required={isEmailRequired}
        placeholder={`your@email.com${!isEmailRequired ? " (optional)" : ""}`}
      />
    </>
  );


  return (
    <Form {...{ onCancel, onSubmit, ref }}
      onValidate={onValidate}
      title={layout === "reveal-message" ? false : title}
      showButton={layout === "reveal-message" ? !!tag : true}
      alignButton={layout === "radio-group" ? "left" : "right"}
      slots={slots}
    >

      {layout === "form" &&
        <>
          <ButtonValueList items={tags} showLabels={showLabels} active={tag} onClick={setTag} />
          {MessageInput}
          {EmailInput}
        </>
      }

      {layout === "radio-group" &&
        <RadioValueList items={tags} active={tag} onSelected={setTag}
          onRenderAddon={({ isSelected }) => isSelected && (
            <>
              {MessageInput}
              {EmailInput}
            </>
          )}
        />
      }

      {layout === "reveal-message" &&
        <>
          <Question text={title} items={tags} showLabels={showLabels} active={tag} onClick={setTag} />
          {tag && (
            <>
              {MessageInput}
              {EmailInput}
            </>
          )}
        </>
      }
    </Form>
  );
});
