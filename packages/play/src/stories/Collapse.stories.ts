import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { WCollapse, WCollapseItem } from 'whimsical-ui'
import 'whimsical-ui/dist/theme/Collapse.css'

type Story = StoryObj<typeof WCollapse>;

const meta: Meta<typeof WCollapse> = {
  title: "Example/Collapse",
  component: WCollapse,
  subcomponents: { WCollapseItem },
  tags: ["autodocs"],
};

export const Default: Story = {
  render: (args) => ({
    components: {
      WCollapse,
      WCollapseItem,
    },
    setup() {
      return {
        args,
      };
    },
    template: `
    <w-collapse v-bind="args">
      <w-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </w-collapse-item>
      <w-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </w-collapse-item>
      <w-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </w-collapse-item>
    </w-collapse>
    `,
  }),
  args: {
    accordion: true,
    modelValue: ["a"],
  },
};

export default meta;