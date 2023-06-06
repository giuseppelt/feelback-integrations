import { forwardRef, useRef, useState } from "react";
import { TargetContent } from "@feelback/js";
import { ButtonValueList, FeelbackLayout, Form, FormHandlerProps, RadioValueList } from "../parts";
import { FeelbackValueDefinition } from "../types";


export type FeelbackTaggedMessageProps = Readonly<TargetContent & {
  layout?: "button-switch" | "button-dialog" | "inline" | "radio-group" | "radio-group-dialog"
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
    showLabels,
    onCancel,
    onSuccess,
    ...content
  } = props;

  if (!tags) {
    console.warn("Missing tags");
    return null;
  }

  return (
    <FeelbackLayout className={`feelback-tagged-message layout-${layout}`}
      {...{ layout, label, onSuccess, ...content }}
    >
      <TaggedMessageForm {...{ title, tags, showLabels, placeholder, minLength, maxLength, onCancel }}
        layout={layout === "radio-group" || layout === "radio-group-dialog" ? "radio-group" : "form"}
      />
    </FeelbackLayout>
  );
}


type TaggedMessageFormProps = FormHandlerProps<{ tag: string, message?: string }> & Readonly<{
  layout: "form" | "radio-group"
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


  return (
    <Form {...{ title, onCancel, onSubmit, ref }}
      onValidate={onValidate}
      alignButton={layout === "radio-group" ? "left" : "right"}
    >

      {layout === "form" &&
        <>
          <ButtonValueList items={tags} showLabels={showLabels} active={tag} onClick={setTag} />
          <textarea ref={messageRef}
            required={isMessageRequired}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
          />
        </>
      }

      {layout === "radio-group" &&
        <>
          <RadioValueList items={tags} active={tag} onSelected={setTag}
            onRenderAddon={({ isSelected }) => {
              return isSelected && (
                <textarea ref={messageRef}
                  required={isMessageRequired}
                  placeholder={placeholder}
                  minLength={minLength}
                  maxLength={maxLength}
                />
              );
            }}
          />
        </>
      }
    </Form>
  );
});
