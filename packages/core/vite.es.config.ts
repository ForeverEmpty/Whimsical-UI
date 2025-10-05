import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { includes } from 'lodash-es'

const COMP_NAMES = [
    'Alert',
    'Button',
    'Collapse',
    'Dropdown',
    'Form',
    'Icon',
    'Input',
    'Loading',
    'Message',
    'MessageBox',
    'Notification',
    'Overlay',
    'Popconfirm',
    'Select',
    'Switch',
    'Tooltip',
    'Upload'
] as const

export default defineConfig({
    plugins: [vue(), dts({
        tsconfigPath: '../../tsconfig.build.json',
        outDir: 'dist/types'
    })],
    build: {
        outDir: 'dist/es',
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'WhimsicalUI',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'vue',
                "@fortawesome/fontawesome-svg-core",
                "@fortawesome/free-brands-svg-icons",
                "@fortawesome/vue-fontawesome",
                "@popperjs/core",
                "async-validator",
            ],
            output: {
                assetFileNames: (assetInfo: any) => {
                    if (assetInfo.name === 'style.css') return 'index.css'
                    return assetInfo.name as string
                },
                manualChunks(id) {
                    if (includes(id, "node_modules")) return "vendor";

                    if (includes(id, "/packages/hooks")) return "hooks";

                    if (
                      includes(id, "/packages/utils") ||
                      includes(id, "plugin-vue:export-helper")
                    )
                      return "utils";
                    for (const item of COMP_NAMES) {
                        if (includes(id, `/packages/components/${item}`)) {
                            return item;
                        }
                    }
                }
            }
        }
    }
})