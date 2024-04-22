<template>
	<Stepper>
		<StepperPanel v-for="(question, index) in questions" :key="question._id" :header="`Question ${index + 1}`">
			<template #content="{ nextCallback, prevCallback }">
				<div v-for="answer in question.answers" :key="answer" class="mt-4">
					<RadioButton v-model="selectedAnswer" :input-id="answer" :name="answer" :value="answer" variant="filled" />
					<label :for="answer" class="ml-2">{{ answer }}</label>
				</div>
				<div class="flex pt-4 justify-between w-full">
					<BaseButton v-if="index !== 0" label="Back" icon="pi pi-arrow-left" @click="loadAnswer(question._id, prevCallback)" />
					<span v-else></span>
					<BaseButton v-if="index !== questions.length - 1" label="Next" icon="pi pi-arrow-right" @click="addAnswer(question._id, nextCallback)" />
				</div>
				<div class="flex flex-col space-y-4 mt-2 items-center">
					<BaseButton v-if="index === questions.length - 1" label="Submit Answers" @click="sendAnswers(question._id)" />
				</div>
			</template>
		</StepperPanel>
	</Stepper>
</template>
<script setup lang="ts">
import { useQuizStore } from '@/stores/quiz-store';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import BaseButton from '@/components/BaseButton.vue';
import { IApiAnswers } from '@/types/ApiQuiz';
import RadioButton from 'primevue/radiobutton';
import { useToast } from 'primevue/usetoast';

const quizStore = useQuizStore();
const router = useRouter();
const toast = useToast();

const selectedAnswer = ref<string>('');
const answers = ref<IApiAnswers[]>([]);
const currentIndex = ref<number>(0);

const questions = computed(() => quizStore.questions);
const quizID = computed(() => String(router.currentRoute.value.params.quizID));
const classroomID = computed(() => String(router.currentRoute.value.params.id));

function addAnswer(questionID: string, nextCallback: Function) {
	answers.value[currentIndex.value] = { _id: questionID, answer: selectedAnswer.value };
	currentIndex.value++;
	selectedAnswer.value = answers.value[currentIndex.value]?.answer ?? questions.value[currentIndex.value].answers[0];
	nextCallback();
}

function loadAnswer(questionID: string, prevCallback: Function) {
	answers.value[currentIndex.value] = { _id: questionID, answer: selectedAnswer.value };
	currentIndex.value--;
	selectedAnswer.value = answers.value[currentIndex.value].answer;
	prevCallback();
}

async function sendAnswers(questionID: string) {
	answers.value[currentIndex.value] = { _id: questionID, answer: selectedAnswer.value };
	try {
		await quizStore.submitQuiz(classroomID.value, quizID.value, answers.value);
		toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz submitted successfully, you will be redirected to homepage!', life: 3000 });
		setTimeout(() => router.push({ name: 'dashboard' }), 3000);
	} catch (error) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while submitting the quiz!', life: 3000 });
	}
}

onMounted(async () => {
	await quizStore.getQuizQuestions(classroomID.value, quizID.value);
	selectedAnswer.value = questions.value[0].answers[0];
});
</script>
<style scoped>
:deep(.p-stepper-action) {
	pointer-events: none;
}
</style>
