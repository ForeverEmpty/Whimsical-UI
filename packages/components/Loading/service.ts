import { defer, delay, isNil, isString } from 'lodash-es';
import type { LoadingOptions, LoadingOptionsResolved } from './types'
import { useZIndex } from '@whimsical-ui/hooks'
import { createApp, reactive, ref, nextTick } from 'vue'
import LoadingComp from './Loading.vue'

const LOADING_NUMB_KEY = 'w-loading-numb' as const
const HIDDEN_CLASS = 'w-loading-parent--hide' as const
const RELATIVE_CLASS = 'w-loading-parent-relative' as const

const instanceMap: Map<HTMLElement, LoadingInstance> = new Map()
const { nextZIndex } = useZIndex(3000)

function creatLoading(opts: LoadingOptionsResolved) {
    const visible = ref(opts.visible)
    const afterLeaveFlag = ref(false)

    const handlerAfterLeave = () => {
        if (!afterLeaveFlag.value) return
        destory()
    }

    const data = reactive({
        ...opts,
        onAfterLeave: handlerAfterLeave
    })

    const setText = (text: string) => data.text = text

    const app = createApp(LoadingComp, {
        ...data,
        zIndx: data.fullscreen ? nextZIndex() : void 0,
        visible
    })
    const vm = app.mount(document.createElement('div'))

    const destory = () => {
        const target = data.parent
        subLoadingNumber(target)
        if (getLoadingNumber(target)) return
        delay(() => {
            removeRelativeClass(target)
            removeHiddenClass(target)
        }, 1)
        instanceMap.delete(target ?? document.body)
        vm.$el?.parentNode?.removeChild(vm.$el)
        app.unmount()
    }

    let afterLeaveTimer: number
    const close = () => {
        if (opts.beforeClose && !opts.beforeClose()) return
        afterLeaveFlag.value = true
        clearTimeout(afterLeaveTimer)
        afterLeaveTimer = defer(handlerAfterLeave)

        visible.value = false
        opts.closed?.()
    }

    return {
        get $el(): HTMLElement {
            return vm.$el
        },
        vm,
        close,
        visible,
        setText
    }
}

function resolveOptions(opts: LoadingOptions): LoadingOptionsResolved {
    let target: HTMLElement;
    if (isString(opts.target)) target = document.querySelector(opts.target) ?? document.body
    else target = opts.target ?? document.body

    return {
        parent: target === document.body || opts.body ? document.body : target,
        background: opts.background ?? 'rgba(0, 0, 0, 0.5)',
        spinner: opts.spinner,
        text: opts.text,
        fullscreen: target === document.body && (opts.fullscreen ?? true),
        lock: opts.lock ?? false,
        visible: opts.visible ?? true,
        target
    }
}

let fullscreenInstance: LoadingInstance | null = null
export type  LoadingInstance = ReturnType<typeof creatLoading>

export function Loading(options: LoadingOptions): LoadingInstance {
    const resolved = resolveOptions(options)
    const target = resolved.parent ?? document.body

    if (resolved.fullscreen && !isNil(fullscreenInstance)) return fullscreenInstance

    addLoadingNumber(resolved?.parent)
    if (instanceMap.has(target)) return instanceMap.get(target)!

    const instance = creatLoading({
        ...resolved,
        closed: () => {
            resolved.closed?.()

            if (resolved.fullscreen) {
                fullscreenInstance = null
            }
        }
    })

    addClass(options, resolved?.parent)

    resolved.parent?.appendChild(instance.$el)

    nextTick(() => (instance.visible.value = !!resolved.visible))

    if (resolved.fullscreen) {
        fullscreenInstance = instance
    }

    instanceMap.set(target, instance)

    return instance
}

function addLoadingNumber(target: HTMLElement = document.body) {
    const number = getLoadingNumber(target) ?? '0'
    target.setAttribute(LOADING_NUMB_KEY, `${Number.parseInt(number) + 1}`)
}

function subLoadingNumber(target: HTMLElement = document.body) {
    const number = getLoadingNumber(target)
    if (number) {
        const newNumber = Number.parseInt(number) - 1
        if (newNumber === 0) {
            removeLoadingNumber(target)
        } else {
            target.setAttribute(LOADING_NUMB_KEY, `${newNumber}`)
        }
    }
        
}

function getLoadingNumber(target: HTMLElement = document.body) {
    return target.getAttribute(LOADING_NUMB_KEY)
}

function removeLoadingNumber(target: HTMLElement = document.body) {
    target.removeAttribute(LOADING_NUMB_KEY)
}

function addRelativeClass(target: HTMLElement = document.body) {
    target.classList.add(RELATIVE_CLASS)
}

function removeRelativeClass(target: HTMLElement = document.body) {
    target.classList.remove(RELATIVE_CLASS)
}

function addHiddenClass(target: HTMLElement = document.body) {
    target.classList.add(HIDDEN_CLASS)
}

function removeHiddenClass(target: HTMLElement = document.body) {
    target.classList.remove(HIDDEN_CLASS)
}

function addClass(opts: LoadingOptions, target: HTMLElement = document.body) {
    if (opts.lock) {
        addHiddenClass(target)
    } else {
        removeHiddenClass(target)
    }

    addRelativeClass(target)
}