import { ReactElement, cloneElement, forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TargetContent } from "@feelback/js";
import { useSendFeelback, useOnClickOutside } from "../hooks";
import { mergeCallback } from "./utils";
import { Answer, FeelbackData, FormHandlerProps } from ".";



export type FeelbackLayoutProps<T> = Readonly<TargetContent & {
  className?: string
  layout?: "button-switch" | "button-dialog" | "inline" | "radio-group" | "radio-group-dialog" | "reveal-message"
  label?: string
  textAnswer?: string
  onClose?: () => void
  onSuccess?: () => void
  children: ReactElement<FormHandlerProps<T>>
}>

export const FeelbackLayout = forwardRef<HTMLDivElement, FeelbackLayoutProps<any>>((props, ref) => {
  const {
    className,
    layout,
    label = "Send feedback",
    textAnswer = "Thanks for your feedback",
    onClose,
    onSuccess,
    children: Form,
    ...content
  } = props;


  const { call, isSuccess } = useSendFeelback(content);

  const onSubmit = ({ value, metadata }: FeelbackData) => {
    call(value, metadata);
  }

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
    }
  }, [isSuccess]);


  return (
    <div ref={ref} className={`feelback-container${className ? " " + className : ""}`}>
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
