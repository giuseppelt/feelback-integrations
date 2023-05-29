import { FeelbackButtonListProps, FeelbackButtonList } from "../parts";


export type FeelbackYesNoProps = FeelbackButtonListProps

export function FeelbackYesNo(props: FeelbackYesNoProps) {
  return <FeelbackButtonList className="feelback-yesno" {...props} />
}
