<script lang="ts" setup>
import { reactive, ref } from "vue";
import { WMessage, type FormInstance } from "whimsical-ui";

const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  region: "",
  delivery: false,
  desc: "",
});

const options = ref([
  { value: "beijing", label: "Zone One" },
  { value: "shanghai", label: "Zone Two" },
]);

const rules = reactive({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
  desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
});

const onSubmit = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      WMessage.success("submit!");
    }
  });
};

const onReset = () => {
  formRef.value?.resetFields();
};
</script>

<template>
  <w-form ref="formRef" :model="form" :rules="rules">
    <w-form-item label="Activity name" prop="name">
      <w-input v-model="form.name" />
    </w-form-item>
    <w-form-item label="Activity zone" prop="region">
      <w-select
        v-model="form.region"
        placeholder="please select your zone"
        :options="options"
      />
    </w-form-item>
    <w-form-item label="Instant delivery" prop="delivery">
      <w-switch v-model="form.delivery" />
    </w-form-item>
    <w-form-item label="Activity form" prop="desc">
      <w-input v-model="form.desc" type="textarea" />
    </w-form-item>
    <w-form-item>
      <w-button type="primary" @click="onSubmit">Create</w-button>
      <w-button @click="onReset">Reset</w-button>
    </w-form-item>
  </w-form>
</template>
