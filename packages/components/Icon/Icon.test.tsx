import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'

describe('Icon.vue', () => {
    it('applies correct inline color style when color prop is set', () => {
        const wrapper = mount(() => (
            <Icon icon="spinner" color="red"></Icon>
        ));
        expect(wrapper.get('i').element.style.color).toBe('red')
    })

    it('does not set inline color when color prop is not provided', () => {
        const wrapper = mount(() => (
            <Icon icon="spinner"></Icon>
        ));
        expect(wrapper.get('i').element.style.color).toBe('')
    })
})