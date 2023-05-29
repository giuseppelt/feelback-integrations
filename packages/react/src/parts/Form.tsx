import { ReactNode } from "react";


export type FormHandlerProps<T> = Readonly<{
  onCancel?: () => void
  onSubmit?: (value: T) => void
}>

export type FormProps<T> = FormHandlerProps<T> & Readonly<{
  title?: string
  children?: ReactNode
  onValidate: () => T | undefined
}>

export function Form<T>(props: FormProps<T>) {
  const {
    title = "Send feedback",
    onCancel,
    onSubmit,
    onValidate,
    children,
  } = props;


  const onClickSend = () => {
    const value = onValidate();
    if (value !== undefined) {
      onSubmit?.(value);
    }
  }

  return (
    <div className="feelback-form">
      <div className="content">
        {title && <span className="feelback-text form-title">{title}</span>}

        {children}
        <div className="form-buttons feelback-buttons align-end">
          {onCancel && <button className="feelback-btn btn-cancel" onClick={onCancel}>Cancel</button>}
          <button className="feelback-btn btn-action" onClick={onClickSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

