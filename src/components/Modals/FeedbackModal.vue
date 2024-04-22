<template>
	<BaseModal v-model="isModalVisible">
		<div class="flex flex-col justify-center items-center space-y-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Give Feedback</h3>
			<FormTextArea v-model="feedback" />
			<p class="text-red-500">{{ errorMessage }}</p>
			<rate v-model="rateValue" :length="5" />
			<BaseButton label="Submit" @click="onSubmit" />
		</div>
	</BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue';
import { useFeedbackStore } from '@/stores/feedback-store';
import FormTextArea from '@/components/Form/FormTextArea.vue';
import { computed, ref } from 'vue';
import BaseButton from '../BaseButton.vue';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(event: 'update:modelValue', value: boolean): boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const feedbackStore = useFeedbackStore();

const feedback = ref('');
const errorMessage = ref('');
const rateValue = ref(0);

const isModalVisible = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

function onSubmit() {
	try {
		feedbackStore.sendFeedback(feedback.value, rateValue.value);
		isModalVisible.value = false;
	} catch (error) {
		console.error(error);
	}
}
</script>
