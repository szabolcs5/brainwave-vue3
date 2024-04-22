<template>
	<div class="flex justify-between">
		<div></div>
		<FormInput v-model="quizTitle" :required="false" name="quizTitle" placeholder="Quiz Title" text="" />
		<BaseButton label="Add Question" icon="pi pi-plus" @click="addQuestion" />
	</div>
	<div class="flex flex-col justify-center space-y-4 mt-2">
		<p class="text-red-500 mb-4">{{ errorMessage }}</p>
		<Card v-for="(question, qIdx) in questions" :key="qIdx">
			<template #title>
				<FormInput v-model="questions[qIdx].title" :required="false" name="quizTitle" :placeholder="`Question ${qIdx + 1}`" text="" />
			</template>
			<template #content>
				<div class="flex flex-col space-y-4 mt-2 items-center">
					<div v-for="(answer, index) in question.answers" :key="index" class="flex items-center space-x-4">
						<RadioButton v-model="questions[qIdx].correctAnswer" variant="filled" :value="index" />
						<FormInput v-model="questions[qIdx].answers[index]" :required="false" name="quizTitle" :placeholder="`Answer ${index + 1}`" text="" />
						<XCircleIcon class="size-6 cursor-pointer" @click="removeAnswer(index, qIdx)" />
					</div>
					<BaseButton label="Add Answer" icon="pi pi-plus" @click="addAnswer(qIdx)" />
				</div>
			</template>
		</Card>
	</div>
	<div class="flex justify-center mt-6">
		<BaseButton v-if="questions.length" :disabled="isLoading" label="Save Quiz" icon="pi pi-check" @click="createQuiz" />
	</div>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import FormInput from '@/components/FormInput.vue';
import { IApiQuestionCreate } from '@/types/ApiQuiz';
import { computed, ref } from 'vue';
import Card from 'primevue/card';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import RadioButton from 'primevue/radiobutton';
import { useQuizStore } from '@/stores/quiz-store';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const quizStore = useQuizStore();
const router = useRouter();
const toast = useToast();

const quizTitle = ref('');
const questions = ref<IApiQuestionCreate[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

const id = computed(() => router.currentRoute.value.params.id);

function addQuestion() {
	questions.value.push({ title: '', answers: ['', '', ''], correctAnswer: 0 });
}

function addAnswer(qIdx: number) {
	questions.value[qIdx].answers.push('');
}

function removeAnswer(index: number, qIdx: number) {
	questions.value[qIdx].answers.splice(index, 1);
	if (questions.value[qIdx].correctAnswer === index) questions.value[qIdx].correctAnswer = 0;
	if (!questions.value[qIdx].answers.length) questions.value.splice(qIdx, 1);
}

function validateQuiz() {
	if (!quizTitle.value) errorMessage.value = 'Quiz title is required';
	if (!questions.value.length) errorMessage.value = 'At least one question is required';
	if (questions.value.some((question) => !question.title || question.answers.some((answer) => !answer))) errorMessage.value = 'All questions and answers are required';
}

async function createQuiz() {
	try {
		validateQuiz();
		if (errorMessage.value) return;
		isLoading.value = true;
		questions.value = questions.value.map((questions) => {
			return {
				...questions,
				correctAnswer: questions.answers[Number(questions.correctAnswer)],
			};
		});
		await quizStore.createQuiz(String(id.value), {
			questions: questions.value,
			title: quizTitle.value,
		});
		toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz created successfully' });
		router.push({ name: 'dashboard' });
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
}
</script>
