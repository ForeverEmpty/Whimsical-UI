import type { StoryObj, Meta } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'

import { WTooltip } from 'whimsical-ui'
import 'whimsical-ui/dist/theme/Tooltip.css'

type Story = StoryObj<typeof WTooltip>

const meta: Meta<typeof WTooltip> = {
    title: 'Example/Tooltip',
    component: WTooltip,
    tags: ['autodocs'],
    argTypes: {
        trigger: {
            options: ['hover', 'click', 'contextmenu'],
            control: {
                type: 'select'
            }
        },
        placement: {
            options: ['top', 'bottom', 'left', 'right'],
            control: {
                type: 'select'
            }
        }
    },
    args: {
        'onVisible-change': fn()
    }
}

export const Default: Story = {
    args: {
        content: 'This is a tooltip',
        placement: 'top',
        trigger: 'hover'
    },
    render: (args: any) => ({
        components: { WTooltip },
        setup() {
            return { args }
        },
        template: `
            <w-tooltip v-bind="args" style="background: red">123</w-tooltip>
        `,
    })
}

export default meta