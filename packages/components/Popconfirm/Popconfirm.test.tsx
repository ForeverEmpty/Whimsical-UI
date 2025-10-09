import { describe, it, test, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { each, get } from "lodash-es";
import type { PopconfirmProps } from "./types";

import Popconfirm from "./Popconfirm.vue";

const onConfirm = vi.fn();
const onCancel = vi.fn();

// 测试组件是否能够接收所有 props
describe("Popconfirm.vue", () => {
  const props = {
    title: "Test Title",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonType: "primary",
    cancelButtonType: "info",
    icon: "check-circle",
    iconColor: "green",
    hideIcon: false,
    hideAfter: 500,
    width: 200,
  } as PopconfirmProps;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it("should accept all props", () => {
    const wrapper = mount(Popconfirm, {
      props,
    });

    // 检查 props 是否被正确设置
    each(Object.keys(props), (key) => {
      expect(get(wrapper.props(), key)).toBe(get(props, key));
    });
  });

  // 测试插槽内容
  it("should renders slot content correctly", () => {
    const slotContent = "Slot Content";
    const wrapper = mount(Popconfirm, {
      props,
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });

  test("popconfirm emits", async () => {
    const wrapper = mount(() => (
      <div>
        <div id="outside"></div>
        <Popconfirm
          title="Test Title"
          hideIcon={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          <button id="trigger">trigger</button>
        </Popconfirm>
      </div>
    ));
    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();

    triggerArea.trigger("click");
    await vi.runAllTimers();

    // 弹出层是否出现
    expect(wrapper.find(".w-popconfirm").exists()).toBeTruthy();
    const confirmButton = wrapper.find(".w-popconfirm__confirm");
    expect(confirmButton.exists()).toBeTruthy();

    confirmButton.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".w-popconfirm").exists()).toBeFalsy();
    expect(onConfirm).toBeCalled();

    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".w-popconfirm").exists()).toBeTruthy();
    const cancelButton = wrapper.find(".w-popconfirm__cancel");
    expect(cancelButton.exists()).toBeTruthy();

    await vi.runAllTimers();
    cancelButton.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".w-popconfirm").exists()).toBeFalsy();
    expect(onCancel).toBeCalled();
  });
});