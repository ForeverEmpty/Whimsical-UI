import type { InjectionKey, Ref } from 'vue'
import type { ConfigProviderProps } from './type'

export type ConfigProviderContext = Partial<ConfigProviderProps>

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol()