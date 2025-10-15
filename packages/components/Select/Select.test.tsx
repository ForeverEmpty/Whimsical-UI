import { rAF } from '@whimsical-ui/utils'
import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Select from './Select.vue'
import Option from './Option.vue'
import type { SelectOptionProps } from './types'
import { SELECT_CTX_KEY } from './constants'

describe('select', () => {
    test('Select render with default props', async () => {
        const wrapper = mount(Select, {
            props: {
                modelValue: '',
                options: [{
                    value: '1',
                    label: 'option 1'
                }]
            }
        })

        wrapper.find('input').trigger('click')
        
        await rAF()
        expect(wrapper.text()).toContain('option 1')
    })

    test('select an option', async () => {
        const wrapper = mount(Select, {
            props: {
                modelValue: '',
                options: [{
                    value: '1',
                    label: 'option 1'
                }]
            }
        })

        wrapper.find('input').trigger('click')
        
        await rAF()
        const option = wrapper.findAll('li').at(0)
        await option?.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    })

    test('Option emits an event on click', async () => {
        const ctx = {
            handleSelect: vi.fn(),
            SelectState: {
                selectedOption: null
            },
            renderLabel: (props: SelectOptionProps) => `lable:${props.label}`
        }

        const warpper = mount(Option, {
            props: {
                value: '1',
                lable: 'option 1'
            },
            global: {
                provide: {
                    [SELECT_CTX_KEY as any]: ctx
                }
            }
        })

        await warpper.trigger('click')
        expect(ctx.handleSelect).toHaveBeenCalled()
    })
})