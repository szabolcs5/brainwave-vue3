<template>
	<div class="flex justify-between w-full">
		<h3 class="text-lg mb-2 font-medium leading-6 text-gray-900">{{ channelName }}</h3>
		<slot name="header" />
	</div>
	<hr />
	<div id="messages" ref="messagePanel" class="mt-4 space-y-6 h-[60vh] overflow-y-scroll">
		<infinite-loading v-if="isReloadNeeded" :top="true" target="#messages" firstload @infinite="loadMoreData">
			<template #complete><span></span></template>
		</infinite-loading>
		<div v-for="message in messages" :key="message.created_at" class="flex flex-col space-y-2">
			<div class="flex items-center space-x-4">
				<img v-if="message.from.avatar" :src="message.from.avatar" :alt="message.from.nickname" class="w-8 h-8 rounded-full" />
				<span class="text-indigo-500 font-bold">{{ message.from.nickname }}</span>
			</div>

			<p class="text-gray-700">{{ message.message }}</p>
		</div>
	</div>
	<div class="flex w-full items-center mt-4 space-x-1">
		<FormInput v-model="messageToSend" text="" name="" :required="false" class="w-full" />
		<PaperAirplaneIcon class="h-7 w-7 text-indigo-500 cursor-pointer" @click="sendMessage" />
	</div>
</template>
<script setup lang="ts">
import FormInput from '@/components/FormInput.vue';
import { computed, nextTick, ref, watch } from 'vue';
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import InfiniteLoading from 'v3-infinite-loading';
import { IPagination } from '@/types/Pagination';
import { useMessageStore } from '@/stores/message-store';
import { IApiMessage } from '@/types/ApiMessage';
import { socket } from '@/socket';

interface IProps {
	channelName: string;
	id: string;
}

const props = defineProps<IProps>();

const messageStore = useMessageStore();

const messageToSend = ref('');
const isLoading = ref(false);
const isReloadNeeded = ref(true);
const messagePanel = ref<HTMLElement | null>(null);
const pagination = ref<IPagination>({
	page: 1,
	limit: 10,
});

const messages = computed(() => messageStore.messages);

async function loadMoreData(stateEvent: InfiniteLoaderEvent) {
	if (isLoading.value || messageStore.isLoadedAll) {
		stateEvent.complete();
		return;
	}
	isLoading.value = true;
	try {
		await messageStore.getMessages(props.id, pagination.value.page, pagination.value.limit);
		pagination.value.page++;
		stateEvent.loaded();
		if (messageStore.isLoadedAll) stateEvent.complete();
	} catch (error) {
		stateEvent.error();
	} finally {
		isLoading.value = false;
	}
}

socket.on('message', async (message: IApiMessage) => {
	if (message.chat_id === props.id) {
		messageStore.messages.push(message);
		await nextTick();
		messagePanel.value?.scrollTo(0, messagePanel.value?.scrollHeight);
	}
});

function sendMessage() {
	if (messageToSend.value) {
		socket.emit('message', {
			chat_id: props.id,
			message: messageToSend.value,
		});
		messageToSend.value = '';
	}
}

watch(
	() => props.id,
	async () => {
		pagination.value.page = 1;
		messageStore.messages = [];
		isReloadNeeded.value = false;
		await nextTick();
		isReloadNeeded.value = true;
		messageStore.getMessages(props.id, 1, pagination.value.limit);
	},
);

interface InfiniteLoaderEvent {
	loading: () => void;
	loaded: () => void;
	complete: () => void;
	error: () => void;
}
</script>
