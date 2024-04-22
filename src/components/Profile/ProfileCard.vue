<template>
	<Card>
		<template #title>{{ title }}</template>
		<template #content>
			<p>{{ description }}</p>
			<ProgressBar :value="percentage"></ProgressBar>
			<div class="mt-6 w-full text-center">
				<BaseButton label="Update Activity" @click="showUpdateModal" />
			</div>
		</template>
	</Card>
	<ActivityModal v-if="isModalVisible" v-model="isModalVisible" @close="closeModal" @submit="onSubmit">
		<template #title>
			<h3 class="text-lg font-medium leading-6 text-gray-900">Update {{ isBook ? 'Book' : 'TV Series' }}</h3>
		</template>
		<template #content>
			<FormInput v-model="modelValue.title" :required="true" name="title" text="Title" />
			<FormInput v-if="isBook" v-model="modelValue.author" :required="true" name="author" text="Author" />
			<div class="flex flex-col space-y-2">
				<label for="percentage">Percentage</label>
				<InputNumber v-model="modelValue.percentage" show-buttons mode="decimal" class="border-2 px-1 rounded-lg" :min="0" :max="100" />
			</div>
		</template>
	</ActivityModal>
</template>
<script setup lang="ts">
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import BaseButton from '@/components/BaseButton.vue';
import { computed, onMounted, ref } from 'vue';
import ActivityModal from './ActivityModal.vue';
import FormInput from '../FormInput.vue';
import { useProfileStore } from '@/stores/profile-store';
import InputNumber from 'primevue/inputnumber';

interface IProps {
	title: string;
	description: string;
	percentage?: number;
	isBook?: boolean;
}

type ProfileType = {
	title: string;
	author: string;
	percentage: number;
};

const profileStore = useProfileStore();
const props = defineProps<IProps>();

const profile = computed(() => profileStore.userProfile);

const modelValue = ref<ProfileType>({} as ProfileType);
const isModalVisible = ref(false);

function closeModal() {
	isModalVisible.value = false;
}

function showUpdateModal() {
	isModalVisible.value = true;
}

function onSubmit() {
	props.isBook ? (profileStore.userProfile.current_book = modelValue.value) : (profileStore.userProfile.current_tv_show = modelValue.value);
	closeModal();
}

onMounted(() => {
	modelValue.value = {
		title: props.isBook ? profile.value.current_book?.title : profile.value.current_tv_show?.title,
		author: profile.value.current_book?.author,
		percentage: props.percentage ?? 0,
	};
});
</script>
