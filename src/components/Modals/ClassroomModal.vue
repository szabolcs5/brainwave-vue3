<template>
	<BaseModal v-model="isModalVisible">
		<div class="flex flex-col justify-center items-center space-y-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Join to classroom</h3>
			<FormInput v-model="classroomCode" required name="code" text="Classroom Code" :error-message="errorMessage" />
			<BaseButton label="Submit" @click="onSubmit" />
		</div>
	</BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue';
import { computed, ref } from 'vue';
import BaseButton from '../BaseButton.vue';
import FormInput from '../FormInput.vue';
import { useClassroomStore } from '@/stores/classroom-store';
import { AxiosError } from 'axios';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(event: 'update:modelValue', value: boolean): boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const classroomStore = useClassroomStore();

const errorMessage = ref('');
const classroomCode = ref('');

const isModalVisible = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

async function onSubmit() {
	if (classroomCode.value === '') {
		errorMessage.value = 'Classroom code is required';
		return;
	}

	try {
		await classroomStore.joinClassroom(classroomCode.value);
		isModalVisible.value = false;
	} catch (error) {
		const { response } = error as AxiosError;
		const { message } = response?.data as { message: string };
		errorMessage.value = message ?? 'An error occurred';
	}
}
</script>
