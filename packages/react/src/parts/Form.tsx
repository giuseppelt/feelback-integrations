import { ReactElement, ReactNode, forwardRef } from "react";


export type FeelbackData<T = any> = {
  value: T
  metadata?: Record<string, string | number>
}

export type FormHandlerProps<T> = Readonly<{
  onCancel?: () => void
  onSubmit?: (value: FeelbackData<T>) => void
}>

export type FormProps<T> = FormHandlerProps<T> & Readonly<{
  title?: string | false
  showButton?: boolean,
  alignButton?: "left" | "right"
  slots?: {
    BeforeFormButtons?: ReactElement
  },
  children?: ReactNode
  onValidate: () => (FeelbackData<T> | undefined)
}>

export const Form = forwardRef<HTMLDivElement, FormProps<any>>((props, ref) => {
  const {
    title = "Send feedback",
    alignButton = "right",
    showButton = true,
    onCancel,
    onSubmit,
    onValidate,
    slots,
    children,
  } = props;


  const onClickSend = () => {
    const value = onValidate();
    if (value !== undefined) {
      onSubmit?.(value);
    }
  }

  return (
    <div ref={ref} className="feelback-form">
      <div className="content">
        {title && <span className="feelback-text form-title">{title}</span>}

        {children}

        {showButton && slots?.BeforeFormButtons}

        {showButton &&
          <div className={`form-buttons feelback-buttons ${alignButton === "right" ? "align-end" : ""}`}>
            <button className="feelback-btn btn-action" onClick={onClickSend}>Send</button>
            {onCancel && <button className="feelback-btn btn-cancel" onClick={onCancel}>Cancel</button>}
          </div>
        }
      </div>
    </div>
  );
}) as <T>(props: FormProps<T>) => ReactElement;

