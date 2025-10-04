import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3-vite'
import { fn, within, userEvent, expect } from 'storybook/test'


import { WButton } from 'whimsical-ui'

type Story = StoryObj<typeof WButton> & { argTypes: ArgTypes }

const meta: Meta<typeof WButton> = {
  title: "Example/Button",
  component: WButton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    useThrottle: {
      control: "boolean",
    },
    throttleDuration: {
      control: "number",
    },
    autofocus: {
      control: "boolean",
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" },
    },
    loadingIcon: {
      control: { type: "text" },
    },
  },
  args: { onClick: fn() },
};

const container = (val: string) => `
<div style="margin:5px">
  ${val}
</div>
`;

export const Default: Story & {args: { content: string }} = {
  argTypes: {
    content: {
      control: { type: "text" },
    },
  },
  args: {
    type: "primary",
    content: "Button",
  },
  render: (args: any) => ({
    components: { WButton },
    setup() {
      return { args };
    },
    template: container(
      `<w-button v-bind="args">{{ args.content }}</w-button>`
    ),
  }),
  play: async ({ canvasElement, args, step }: any) => {
    const canvas = within(canvasElement);
    await step("Click the button", async () => {
      await userEvent.click(canvas.getByRole("button"));
    });

    expect(args.onClick).toHaveBeenCalled();
  }
}

export default meta