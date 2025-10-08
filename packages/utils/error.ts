import { isString } from 'lodash-es'

class WUIError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = 'WUIError'
    }
}

function creatWError(scope: string, msg: string) {
    return new WUIError(`[${scope}]: ${msg}`)
}

export function throwError(scope: string, msg: string) {
    throw creatWError(scope, msg)
}

export function debugWarn(error: Error): void
export function debugWarn(scope: string, msg: string): void
export function debugWarn(scope: string| Error, msg?: string) {
    if (process.env.NODE_ENV !== 'production') {
        const err = isString(scope) ? creatWError(scope, msg!) : scope
        console.warn(err)
    }
}