import type { Language, TranslatePair } from '@whimsical-ui/locale'

export interface ConfigProviderProps {
    locale?: Language
    extendsI18nMsg?: TranslatePair
}
