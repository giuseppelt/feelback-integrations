import { ReactElement, FC, ComponentClass } from "react";


export type FeelbackValueIcon = ReactElement | FC | ComponentClass | { text: string }

export type FeelbackValueDefinition<T extends string | number | object = string> = Readonly<{
    value: T
    icon?: FeelbackValueIcon | readonly [FeelbackValueIcon, FeelbackValueIcon]
    title?: string
    description?: string
}>
