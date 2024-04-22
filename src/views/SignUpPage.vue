<template>
	<GuestLayout>
		<div class="w-full lg:w-1/2">
			<form class="flex flex-col space-y-8" @submit.prevent="register" @keypress="register">
				<FormInput v-model="account.firstname" name="first" text="First Name" required :error-message="errorMessages.firstname" />
				<FormInput v-model="account.lastname" name="last" text="Last Name" required :error-message="errorMessages.lastname" />
				<FormInput v-model="account.nickname" name="nickname" text="Nickname" required :error-message="errorMessages.nickname" />
				<FormInput v-model="account.email" name="email" text="Email" required :error-message="errorMessages.email" />
				<FormInput v-model="account.password" name="password" text="Password" required :error-message="errorMessages.password" />
				<div class="flex space-x-4 items-center justify-center">
					<FileUpload mode="basic" name="upload" custom-upload accept="image/*" :max-file-size="1000000" auto choose-label="Upload your avatar" @uploader="onUpload" />
					<p class="text-red-500 text-center">{{ errorMessages.avatar }}</p>
				</div>

				<p class="text-red-500 text-center">{{ requestMessage }}</p>
				<div class="w-full flex flex-col items-center space-y-4">
					<BaseButton label="Register" @click="register" />
					<div class="flex flex-row items-center justify-center space-x-4 cursor-pointer" @click="pushToLogin">
						<ArrowLeftIcon class="w-6 h-6 text-blue-500" />
						<p>Back to login</p>
					</div>
				</div>
			</form>
		</div>
	</GuestLayout>
</template>
<script setup lang="ts">
import GuestLayout from '@/components/Layout/GuestLayout.vue';
import { IApiRegisterUser } from '@/types/ApiUser';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import FileUpload, { FileUploadUploaderEvent } from 'primevue/fileupload';
import { ref as storageRef } from 'firebase/storage';
import { useFirebaseStorage, useStorageFile } from 'vuefire';
import { storage } from '@/firebase';
import { rules, validate } from '@/modules/FormValidator';
import { useAuthStore } from '@/stores/auth-store';

const router = useRouter();
const authStore = useAuthStore();

const requestMessage = ref('');
const avatarFile = ref<File | null>(null);
const account = ref<IApiRegisterUser>({
	firstname: '',
	lastname: '',
	nickname: '',
	email: '',
	password: '',
	avatar: '',
});

const errorMessages = ref<Record<keyof IApiRegisterUser, string>>({
	firstname: '',
	lastname: '',
	nickname: '',
	email: '',
	password: '',
	avatar: '',
});

function pushToLogin() {
	router.push({ name: 'login' });
}

function onUpload(event: FileUploadUploaderEvent) {
	const files = event.files as File[];
	avatarFile.value = files[0];
	account.value.avatar = files[0].name;
}

const formRules: Record<keyof IApiRegisterUser, keyof typeof rules> = {
	email: 'email',
	password: 'required',
	firstname: 'required',
	lastname: 'required',
	nickname: 'required',
	avatar: 'required',
};

async function register() {
	try {
		errorMessages.value = validate(account.value, formRules);
		if (Object.values(errorMessages.value).some((error) => error !== '')) return;

		console.debug(storage.app.name);
		const fbStorage = useFirebaseStorage();
		const avatarRef = storageRef(fbStorage, `${import.meta.env.VITE_FIREBASE_AVATAR_URL}/${Math.random().toString(36).slice(2)}.jpg`);
		const { url, upload } = useStorageFile(avatarRef);

		const interval = setInterval(async () => {
			if (url.value) {
				clearInterval(interval);
				account.value.avatar = String(url.value);
				await authStore.register(account.value);
				router.push({ name: 'assign' });
			}
		}, 1000);
		await upload(avatarFile.value as File);
		return;
	} catch (error) {
		const err = error as Error;
		requestMessage.value = String(err);
	}
}
</script>
