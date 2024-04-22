<template>
	<ChatComponent :id="String(id)" :channel-name="channelName" />
</template>
<script setup lang="ts">
import ChatComponent from '@/components/Chat/ChatComponent.vue';
import { useAuthStore } from '@/stores/auth-store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const id = computed(() => router.currentRoute.value.params.id);
const channelName = computed(() => authStore.user.channels.find((channel) => channel._id === id.value)?.name || '');
</script>
