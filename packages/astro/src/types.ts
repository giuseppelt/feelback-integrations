
export type FeelbackValueDefinition<T extends string | number | object = string> = Readonly<{
    value: T
    icon?: string | readonly [string, string]
    title?: string
    description?: string
}>
