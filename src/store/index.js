import { inject, observer } from 'mobx-react'

export * from './ProjectStore'
export * from './ProjectDetailStore'
export * from './BuildStore'
export const connect = str => Comp => inject([str])(observer(Comp))
