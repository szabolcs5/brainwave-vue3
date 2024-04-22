<template>
	<ArrowLeftIcon class="size-7 text-primary mb-4 cursor-pointer" @click="navigateBack" />
	<div class="space-y-6">
		<h3 class="text-lg mb-2 font-medium leading-6 text-gray-900">Entries for: {{ user.nickname }}</h3>
		<Card v-for="entry in entries" :key="entry._id">
			<template #title></template>
			<template #content>
				<div class="flex flex-col text-center">
					<p>Submitted At: {{ moment(entry.createdAt).fromNow() }}</p>
					<p>Score: {{ entry.points }}</p>
				</div>
			</template>
		</Card>
	</div>
</template>
<script setup lang="ts">
import { useQuizStore } from '@/stores/quiz-store';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import moment from 'moment';
import { useAuthStore } from '@/stores/auth-store';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

const quizStore = useQuizStore();
const router = useRouter();
const authStore = useAuthStore();

const entries = computed(() => quizStore.entries);
const classroomID = computed(() => router.currentRoute.value.params.id);
const quizID = computed(() => router.currentRoute.value.params.quizID);
const user = computed(() => authStore.user);

function navigateBack() {
	router.push({
		name: 'quizzes',
		params: { id: String(classroomID.value) },
	});
}

onMounted(() => quizStore.getEntries(String(classroomID.value), String(quizID.value)));
</script>
