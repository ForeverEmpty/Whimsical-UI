import { describe, it, expect, vi } from 'vitest'
import { ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import useEventListener from '../useEventListener'

describe('hooks/useEventListener', () => {
    it('should add and remove event listener when target is HTMLElement', async () => {
        const target = document.createElement('button')
        const handler = vi.fn()
        const wrapper = mount(defineComponent({
            setup() {
                useEventListener(target, 'click', handler)
                return () => <div id="container1"></div>
            }
        }))
        wrapper.get('#container1').element.appendChild(target)

        await target.click()
        expect(handler).toHaveBeenCalledOnce()

        await wrapper.unmount()
        await target.click()
        expect(handler).toHaveBeenCalledOnce()
    })

    it('should add and remove event listener when target is Ref<HTMLElement>', async () => {
        const target = ref<HTMLElement | void>();
        const handler = vi.fn()
        mount(defineComponent({
            setup() {
                useEventListener(target, 'click', handler)
                return () => <button type='button' id="container2" ref={ target }>test</button>
            }
        }))
        await document.getElementById('container2')?.click()

        await target.value?.click()
        expect(handler).toHaveBeenCalledOnce()

        target.value = document.createElement('div')
        await document.getElementById('container2')?.click()
        expect(handler).toHaveBeenCalledOnce()
    })
})