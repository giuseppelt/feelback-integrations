import { useId } from "react";


export type RadioValueProps = Readonly<{
  group?: string
  value: string
  label?: string
  checked?: boolean
  description?: string
  onSelected?: () => void
}>

export function RadioValue(props: RadioValueProps) {
  const {
    group,
    value,
    label,
    description,
    checked,
    onSelected,
  } = props;


  const id = `radio-${useId()}`;

  return (
    <div className="feelback-radio-item">
      <input id={id} name={group} type="radio" value={value} checked={checked} onChange={ev => ev.target.checked ? onSelected?.() : undefined} />
      <div className="feelback-radio-side">
        {label && <label htmlFor={id}>{label}</label>}
        {description && <span className="feelback-text">{description}</span>}
      </div>
    </div>
  );
}
