import { ReactElement, cloneElement, forwardRef, useState } from "react";
import { createPortal } from "react-dom";
import { TargetContent } from "@feelback/js";
import { useSendFeelback, useOnClickOutside } from "../hooks";
import { FormHandlerProps } from ".";


export type FeelbackButtonFormProps = Readonly<TargetContent & {
  className?: string
  layout?: "button-switch" | "button-dialog" | "inline"
  label?: string
  textAnswer?: string
  children: ReactElement<FormHandlerProps<any>>
}>

export const FeelbackButtonForm = forwardRef<HTMLDivElement, FeelbackButtonFormProps>((props, ref) => {
  const {
    className,
    layout,
    label = "Send feedback",
    textAnswer = "Thanks for your feedback",
    children: Form,
    ...content
  } = props;


  const { call: send, isSuccess } = useSendFeelback(content);

  return (
    <div ref={ref} className={`feelback-container${className ? " " + className : ""}`}>
      {!isSuccess && (() => {
        switch (layout) {
          case "button-switch":
            return (
              <OpenButton label={label} behavior="remove-when-open">
                {onClose => cloneElement(Form, { onSubmit: send, onCancel: onClose })}
              </OpenButton>
            );

          case "button-dialog":
            return (
              <OpenButton label={label} behavior="disable-when-open">
                {onClose => (
                  <Dialog onClose={onClose}>
                    {cloneElement(Form, { onSubmit: send, onCancel: onClose })}
                  </Dialog>
                )}
              </OpenButton>
            );

          case "inline":
          default:
            return cloneElement(Form, { onSubmit: send })
        }
      })()}

      {isSuccess &&
        <div className="feelback-a">
          <span className="feelback-text">{textAnswer}</span>
        </div>
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
  onClose: () => void
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
