import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { includes, last, split, first } from 'lodash-es'
import hooks from '../core/build/hooksPlugin'
import terser from '@rollup/plugin-terser'

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

export default defineConfig({
    plugins: [
        vue(), 
        dts({
            include: ["./**/*.ts"],
            exclude: ["./vite.config.ts"],
        }),
        terser({
            compress: {
                sequences: isProd,
                arguments: isProd,
                drop_console: isProd && ["log"],
                drop_debugger: isProd,
                passes: isProd ? 4 : 1,
                global_defs: {
                    "@DEV": JSON.stringify(isDev),
                    "@PROD": JSON.stringify(isProd),
                    "@TEST": JSON.stringify(isTest),
                },
            },
            format: {
                semicolons: false,
                shorthand: isProd,
                braces: !isProd,
                beautify: !isProd,
                comments: !isProd,
            },
            mangle: {
                toplevel: isProd,
                eval: isProd,
                keep_classnames: isDev,
                keep_fnames: isDev,
            },
        }),
        hooks({
            rmFiles: ['./dist', './dist/types'],
        })
    ],
    build: {
        outDir: 'dist',
        minify: false,
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'hooks',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'vue', 'lodash-es'
            ],
            output: {
                manualChunks(id) {
                    if (includes(id, "/packages/hooks/use"))
                    return first(split(last(split(id, "/")), "."));
                }               
            }
        }
    }
})