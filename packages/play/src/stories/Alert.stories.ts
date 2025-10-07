import type { StoryObj, Meta, ArgTypes } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { fn } from 'storybook/test'
import { WAlert, type AlertInstance } from 'whimsical-ui'
import 'whimsical-ui/dist/theme/Alert.css'

type Story = StoryObj<typeof WAlert> & { argTypes?: ArgTypes };

const meta: Meta<typeof WAlert> = {
  title: "Example/Alert",
  component: WAlert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["success", "warning", "info", "danger"],
    },
    effect: {
      control: "select",
      options: ["light", "dark"],
    },
    center: {
      control: "boolean",
    },
 },
  args: {
    onClose: fn(),
  },
};

export const Default: Story & { args: { visible: boolean } } = {
  args: {
    title: "标题",
    description: "这是一段描述",
    type: "success",
    effect: "light",
    closable: true,
    showIcon: true,
    visible: true,
  },
  render: (args: any) => ({
    components: { WAlert },
    setup() {
      const alertRef = ref<AlertInstance>();
      watch(
        () => (args as any).visible,
        (val: boolean) => {
          if (val) {
            alertRef.value?.open();
          } else {
            alertRef.value?.close();
          }
        }
      );
      return { args, alertRef };
    },
    template: `
     <w-alert ref="alertRef" v-bind="args"></w-alert>
    `,
  }),
};

export default meta;