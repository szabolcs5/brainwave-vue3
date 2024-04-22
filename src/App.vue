<template>
	<Toast />
	<RouterView v-if="!isLoggedIn || isAssignPage" />
	<LoggedLayout v-else>
		<RouterView />
	</LoggedLayout>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth-store';
import { computed } from 'vue';
import LoggedLayout from './components/Layout/LoggedLayout.vue';
import Toast from 'primevue/toast';

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAssignPage = computed(() => router.currentRoute.value.name === 'assign');
</script>
