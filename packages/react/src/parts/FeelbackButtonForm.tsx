import { ReactElement, cloneElement, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TargetContent } from "@feelback/js";
import { useSendFeelback, useOnClickOutside, useValueTimeout } from "../hooks";
import { mergeCallback } from "./utils";
import { Answer, FeelbackData, FormHandlerProps } from ".";



export type FeelbackLayoutProps<T> = Readonly<TargetContent & {
  className?: string
  layout?: "button-switch" | "button-dialog" | "inline" | "radio-group" | "radio-group-dialog" | "reveal-message"
  label?: string
  textAnswer?: string
  revokable?: boolean
  onClose?: () => void
  onSuccess?: (feelback: TargetContent & { value: T }) => void
  children: ReactElement<FormHandlerProps<T>>
}>

export const FeelbackLayout = forwardRef<HTMLDivElement, FeelbackLayoutProps<any>>((props, ref) => {
  const {
    className,
    layout,
    label = "Send feedback",
    textAnswer = "Thanks for your feedback",
    revokable = true,
    onClose,
    onSuccess,
    children: Form,
    ...content
  } = props;


  const { call, isSuccess } = useSendFeelback(content);
  const { value: isDisabled, set: setDisabled } = useValueTimeout(1000); // disable submitting for 1s, to avoid double clicks

  const onSubmit = ({ value, metadata }: FeelbackData) => {
    setDisabled(true);
    call(value, { metadata, revokable }).then(({ isSuccess }) => {
      if (isSuccess) {
        onSuccess?.({ ...content, value });
      }
    });
  }

  return (
    <div ref={ref} className={`feelback-container${className ? " " + className : ""}`} style={{ pointerEvents: isDisabled ? "none" : undefined }}>
      {!isSuccess && (() => {
        switch (layout) {
          case "button-switch":
            return (
              <OpenButton label={label} behavior="remove-when-open">
                {onClose => cloneElement(Form, { onSubmit, onCancel: onClose })}
              </OpenButton>
            );

          case "button-dialog":
            return (
              <OpenButton label={label} behavior="disable-when-open">
                {onClose => (
                  <Dialog onClose={onClose}>
                    {cloneElement(Form, { onSubmit, onCancel: onClose })}
                  </Dialog>
                )}
              </OpenButton>
            );

          case "radio-group-dialog":
            return (
              <Dialog onClose={onClose}>
                {cloneElement(Form, { onSubmit, onCancel: mergeCallback(Form.props.onCancel, onClose) })}
              </Dialog>
            );

          case "reveal-message":
          case "inline":
          case "radio-group":
          default:
            return cloneElement(Form, { onSubmit })
        }
      })()}

      {isSuccess &&
        <Answer text={textAnswer} />
      }
    </div>
  );
});


type OpenButtonProps = Readonly<{
  label: string
  behavior?: "remove-when-open" | "disable-when-open"
  children: (onClose: () => void) => (ReactElement | null)
}>

function OpenButton(props: OpenButtonProps) {
  const {
    label,
    behavior = "remove-when-open",
    children,
  } = props;

  const [isOpen, setOpen] = useState(false);

  const isButtonVisible = !isOpen || behavior !== "remove-when-open";

  return (
    <>
      {isButtonVisible &&
        <button
          className="feelback-btn btn-action trigger-btn"
          disabled={isOpen}
          onClick={() => setOpen(true)}>
          {label}
        </button>
      }
      {isOpen && children(() => setOpen(false))}
    </>
  );
}


type DialogProps = Readonly<{
  onClose?: () => void
  children: ReactElement
}>

function Dialog(props: DialogProps) {
  const {
    onClose,
    children,
  } = props;

  const contentRef = useOnClickOutside<HTMLDivElement>(true, onClose);

  return createPortal((
    <div className="feelback-style">
      <div className="dialog">
        {cloneElement(children, { ref: contentRef })}
      </div>
    </div>
  ), document.body);
}
