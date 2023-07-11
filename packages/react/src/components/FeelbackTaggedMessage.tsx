import { forwardRef, useRef, useState } from "react";
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
  | "onCancel"
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
    onCancel,
    onSuccess,
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
      <TaggedMessageForm {...{ title, tags, showLabels, placeholder, minLength, maxLength, onCancel }}
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
  placeholder?: string
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
    onCancel,
    onSubmit,
  } = props;


  const isMessageRequired = !!minLength && minLength > 0;
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [tag, setTag] = useState(active === "$auto" ? tags[0].value : active);

  const onValidate = () => {
    const message = messageRef.current?.value.trim() || undefined;

    if (!tag) return;
    if (isMessageRequired && (!message || message.length < minLength)) return;

    return {
      tag,
      message,
    };
  }


  const TextArea = (
    <textarea ref={messageRef}
      required={isMessageRequired}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
    />
  );


  return (
    <Form {...{ onCancel, onSubmit, ref }}
      onValidate={onValidate}
      title={layout === "reveal-message" ? false : title}
      showButton={layout === "reveal-message" ? !!tag : true}
      alignButton={layout === "radio-group" ? "left" : "right"}
    >

      {layout === "form" &&
        <>
          <ButtonValueList items={tags} showLabels={showLabels} active={tag} onClick={setTag} />
          {TextArea}
        </>
      }

      {layout === "radio-group" &&
        <RadioValueList items={tags} active={tag} onSelected={setTag}
          onRenderAddon={({ isSelected }) => isSelected && TextArea}
        />
      }

      {layout === "reveal-message" &&
        <>
          <Question text={title} items={tags} showLabels={showLabels} active={tag} onClick={setTag} />
          {tag && TextArea}
        </>
      }
    </Form>
  );
});
