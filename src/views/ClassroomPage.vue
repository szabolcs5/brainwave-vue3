<template>
	<ChatComponent :id="String(id)" :channel-name="channelName">
		<template #header>
			<DocumentTextIcon class="h-7 w-7 text-primary cursor-pointer" @click="navigateToQuizPage" />
		</template>
	</ChatComponent>
</template>
<script setup lang="ts">
import ChatComponent from '@/components/Chat/ChatComponent.vue';
import { useAuthStore } from '@/stores/auth-store';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const id = computed(() => router.currentRoute.value.params.id);
const channelName = computed(() => authStore.user.classrooms.find((classroom) => classroom._id === id.value)?.name || '');

function navigateToQuizPage() {
	router.push(`/classrooms/${id.value}/quizzes`);
}
</script>
