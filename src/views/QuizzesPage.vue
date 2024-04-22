<template>
	<div class="space-y-6">
		<div v-if="!isStudent" class="w-full flex justify-end">
			<BaseButton label="Create Quiz" icon="pi pi-plus" @click="createQuiz" />
		</div>
		<Card v-for="quiz in quizzes" :key="quiz._id">
			<template #title
				><div class="w-full text-center">{{ quiz.title }}</div></template
			>
			<template #content>
				<div class="flex flex-col text-center">
					<p>Created At: {{ moment(quiz.createdAt).fromNow() }}</p>
				</div>
				<div class="flex flex-col space-y-4 mt-2 items-center">
					<BaseButton v-if="isStudent" label="Start Quiz" @click="() => startQuiz(quiz._id)" />
					<BaseButton v-if="isStudent" label="View Results" @click="() => viewEntries(quiz._id)" />
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
import BaseButton from '@/components/BaseButton.vue';
import { useAuthStore } from '@/stores/auth-store';
import { ROLES } from '@/modules/Constants';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const quizzes = computed(() => quizStore.quizzes);
const classroomID = computed(() => router.currentRoute.value.params.id);
const isStudent = computed(() => authStore.user.role === ROLES.Student);

function createQuiz() {
	router.push({ name: 'create-quiz', params: { id: String(classroomID.value) } });
}

function viewEntries(quizID: string) {
	router.push({
		name: 'entries',
		params: { id: String(classroomID.value), quizID },
	});
}

function startQuiz(quizID: string) {
	router.push({
		name: 'quiz',
		params: { id: String(classroomID.value), quizID },
	});
}

onMounted(() => quizStore.getQuizzes(String(classroomID.value)));
</script>
