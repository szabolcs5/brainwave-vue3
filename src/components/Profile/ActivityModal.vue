<template>
	<BaseModal v-model="isModalVisible">
		<slot name="title"> </slot>
		<slot name="content"></slot>
		<BaseButton label="Update Activity" @click="onSubmit" />
	</BaseModal>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '../BaseModal.vue';
import BaseButton from '../BaseButton.vue';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(event: 'update:modelValue', value: boolean): void;
	(event: 'submit'): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const isModalVisible = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function onSubmit() {
	emit('submit');
}
</script>
