
export type FeelbackValueDefinition<T extends string | number | object = string> = Readonly<{
    value: T
    icon?: FeelbackValueIcon
    title?: string
    description?: string
}>

export type FeelbackValueIcon = string | readonly [string, string]
