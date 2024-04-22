<template>
	<Button :label="label" class="rounded px-3 py-1.5 !bg-primary text-white w-[160px]" @click="$emit('click')" />
</template>
<script setup lang="ts">
import Button from 'primevue/button';

interface IProps {
	label: string;
}

defineProps<IProps>();
defineEmits(['click']);
</script>
