<template>
	<Textarea
		id="description"
		v-model="value"
		name="description"
		rows="3"
		class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
	/>
</template>
<script setup lang="ts">
import Textarea from 'primevue/textarea';
import { computed } from 'vue';

interface IProps {
	modelValue?: string;
}

interface IEmits {
	(event: 'update:modelValue', value: string): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const value = computed({
	get: () => props.modelValue,
	set: (value: string) => emit('update:modelValue', value),
});
</script>
