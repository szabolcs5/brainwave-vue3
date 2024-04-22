<template>
	<div class="flex flex-col">
		<label :for="name">{{ text }}<span v-if="required" class="text-red-500">*</span></label>
		<Password
			v-if="name === 'password'"
			v-model="value"
			:input-id="name"
			class="border-2 rounded-lg p-1"
			:feedback="false"
			toggle-mask
			:class="{ 'p-invalid': errorMessage }"
		/>
		<InputText v-else :id="name" v-model="value" :placeholder="placeholder" class="border-2 rounded-lg p-2" :class="{ 'p-invalid': errorMessage }" />
		<small v-if="errorMessage" id="text-error" class="p-error">{{ errorMessage || '&nbsp;' }}</small>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
interface IProps {
	modelValue?: string;
	required: boolean;
	name: string;
	text: string;
	errorMessage?: string;
	placeholder?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

const value = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});
</script>
<style scoped>
:deep(.p-password-input) {
	width: 100%;
}

:deep(.p-invalid) {
	border-color: #f56565;
}
</style>
