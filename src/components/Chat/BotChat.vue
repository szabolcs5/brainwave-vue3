<template>
	<h3 class="text-lg mb-2 font-medium leading-6 text-gray-900">LinguaNinja</h3>
	<hr />
	<div id="messages" ref="messagePanel" class="mt-4 space-y-6 h-[60vh] overflow-y-scroll">
		<div v-for="message in messages" :key="message.created_at" class="flex flex-col space-y-2">
			<div class="flex items-center space-x-4">
				<img v-if="message.from.avatar" :src="message.from.avatar" :alt="message.from.nickname" class="w-8 h-8 rounded-full" />
				<span class="text-indigo-500 font-bold">{{ message.from.nickname }}</span>
			</div>

			<p class="text-gray-700">{{ message.message }}</p>
		</div>
	</div>
	<div class="flex w-full items-center mt-4 space-x-1">
		<Dropdown v-model="selectedLanguage" option-label="name" option-value="code" :options="languages" name="language" class="md:w-14rem border-2 rounded-lg" />
		<FormInput v-model="messageToSend" text="" name="" :required="false" class="w-full" />
		<PaperAirplaneIcon class="h-7 w-7 text-indigo-500 cursor-pointer" @click="sendMessage" />
	</div>
</template>
<script setup lang="ts">
import FormInput from '@/components/FormInput.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import Dropdown from 'primevue/dropdown';
import { useMessageStore } from '@/stores/message-store';
import { IApiMessage, IApiTranslation } from '@/types/ApiMessage';
import { useAuthStore } from '@/stores/auth-store';

const messageStore = useMessageStore();
const authStore = useAuthStore();
const languages = [
	{ name: 'English', code: 'EN' },
	{ name: 'Spanish', code: 'ES' },
	{ name: 'French', code: 'FR' },
	{ name: 'German', code: 'DE' },
	{ name: 'Italian', code: 'IT' },
];
const linguaNinja = {
	nickname: 'LinguaNinja',
	avatar: '/src/assets/linguaninja.jpg',
	role: 0,
	_id: 'linguaninja',
};

const messages = ref([] as IApiMessage[]);
const messageToSend = ref('');
const isLoading = ref(false);
const messagePanel = ref<HTMLDivElement | null>(null);
const selectedLanguage = ref(languages[0].code);

const user = computed(() => authStore.user);

async function sendMessage() {
	if (isLoading.value) return;
	try {
		isLoading.value = true;
		const botMessage = await messageStore.sendBotMessage(messageToSend.value, selectedLanguage.value);
		pushMessages(botMessage);
		messageToSend.value = '';
		await nextTick();
		messagePanel.value?.scrollTo(0, messagePanel.value?.scrollHeight);
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
}

function pushMessages(botMessage: IApiTranslation[]) {
	messages.value.push({
		chat_id: 'linguaninja',
		message: messageToSend.value,
		from: { nickname: user.value.nickname, avatar: user.value.avatar, role: user.value.role, _id: user.value._id },
		created_at: new Date().toISOString(),
		scheduled_at: new Date().toISOString(),
	});
	messages.value.push({
		chat_id: 'linguaninja',
		message: botMessage[0].text,
		from: linguaNinja,
		created_at: new Date().toISOString(),
		scheduled_at: new Date().toISOString(),
	});
}

onMounted(() => {
	messages.value.push({
		chat_id: 'linguaninja',
		message: 'Hello! I am LinguaNinja, your language learning assistant. How can I help you today?',
		from: linguaNinja,
		created_at: new Date().toISOString(),
		scheduled_at: new Date().toISOString(),
	});
});
</script>
