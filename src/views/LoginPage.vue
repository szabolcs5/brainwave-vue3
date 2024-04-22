<template>
	<GuestLayout>
		<div class="w-full lg:w-1/2">
			<form class="flex flex-col space-y-8" @submit.prevent="login" @keypress="checkSubmit">
				<FormInput v-model="credentials.email" name="email" text="Email" required :error-message="errorMessages.email" />
				<FormInput v-model="credentials.password" name="password" text="Password" required :error-message="errorMessages.password" />
				<p class="text-red-500 text-center">{{ requestMessage }}</p>
				<div class="w-full flex flex-col items-center space-y-4">
					<BaseButton label="Log in" @click="login" />
					<BaseButton label="Sign up" @click="pushToSignUp" />
				</div>
			</form>
		</div>
	</GuestLayout>
</template>
<script setup lang="ts">
import FormInput from '@/components/FormInput.vue';
import { IApiLogin } from '@/types/ApiLogin';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import { validate, rules } from '@/modules/FormValidator';
import BaseButton from '@/components/BaseButton.vue';
import { useRouter } from 'vue-router';
import GuestLayout from '@/components/Layout/GuestLayout.vue';

const authStore = useAuthStore();
const router = useRouter();

const credentials = ref<IApiLogin>({
	email: '',
	password: '',
});

const formRules: Record<keyof IApiLogin, keyof typeof rules> = {
	email: 'required',
	password: 'required',
};

const errorMessages = ref<Record<keyof IApiLogin, string>>({
	email: '',
	password: '',
});

const requestMessage = ref('');

async function login() {
	errorMessages.value = validate(credentials.value, formRules);
	if (Object.values(errorMessages.value).some((error) => error !== '')) return;
	try {
		await authStore.login(credentials.value);
		router.push({
			name: 'dashboard',
		});
	} catch (error) {
		requestMessage.value = 'Invalid credentials';
	}
}

function pushToSignUp() {
	router.push({
		name: 'sign-up',
	});
}

function checkSubmit(event: KeyboardEvent) {
	if (event.key === 'Enter') login();
}
</script>
