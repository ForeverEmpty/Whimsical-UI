import { describe, expect, it } from 'vitest'
import type { Plugin } from 'vue'
import { WAlert, WButton, WButtonGroup, WCollapse, WCollapseItem, WIcon } from '../'
import { map, get } from 'lodash-es'

const comp = [
    WAlert,
    WButton,
    WButtonGroup,
    WCollapse,
    WCollapseItem,
    WIcon
] as Plugin[]

describe('components/index', () => {
    it.each(map(comp, (c) => [get(c, 'name') ?? '', c]))(
        '%s should be exported',
        (_, component) => {
            expect(component).toBeDefined()
            expect(component.install).toBeDefined()
        }
    )
})