<script setup lang="ts">
import { h } from "vue";
import { WMessage, WMessageBox } from "whimsical-ui";
import { delay } from "lodash-es";

function openMsgBox() {
  const action = WMessageBox({
    title: "Message",
    message: h("p", null, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    type: "danger",
    icon: "trash",
    beforeClose(action, instance, done) {
      if (action !== "confirm") {
        done();
        return;
      }
      instance.confirmButtonLoading = true;
      instance.confirmButtonText = "Loading...";
      delay(() => {
        done();
        delay(() => (instance.confirmButtonLoading = false), 1000);
      }, 3000);
    },
    callback(action) {
      if (action === "confirm") {
        WMessage.info(action);
      } else {
        WMessage.warning(action);
      }
    }
  });
}
</script>

<template>
  <W-button @click="openMsgBox" plain>Click to open Message Box</W-button>
</template>