<template>
	<div class="flex flex-col p-32 lg:flex-row space-y-16 lg:space-x-16">
		<div class="w-full lg:w-1/2 flex flex-col items-center space-y-12">
			<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Choose your path</h1>
			<div class="flex flex-col space-y-4">
				<div class="cursor-pointer" @click="() => selectRole(ROLES.Student)">
					<Card class="w-[280px] ease-in duration-300" :class="!isTeacher ? 'bg-primary text-white' : ''">
						<template #title><AcademicCapIcon class="w-6 h-6" /> Student </template>
						<template #content>Join into classrooms and learn languages!</template>
					</Card>
				</div>
				<div class="cursor-pointer" @click="() => selectRole(ROLES.Teacher)">
					<Card class="w-[280px] ease-in duration-300" :class="isTeacher ? 'bg-primary text-white' : ''">
						<template #title><AcademicCapIcon class="w-6 h-6" /> Teacher </template>
						<template #content>Teach languages and manage your students!</template>
					</Card>
				</div>
			</div>
		</div>
		<div class="pt-3 w-full">
			<Dropdown v-model="userLanguageLevel" :options="languagesWithLevel" option-label="name" placeholder="Select your language" />
			<FileUpload
				v-if="isTeacher"
				mode="basic"
				name="upload"
				custom-upload
				class="mt-2 ml-3"
				accept="application/pdf"
				:max-file-size="1000000"
				auto
				choose-label="Upload your proof"
				@uploader="onUpload"
			/>
		</div>
		<div>
			<BaseButton label="Register" :disabled="isSubmitDisabled || isLoading" @click="onSubmit">Assign User</BaseButton>
		</div>
	</div>
</template>
<script setup lang="ts">
import Card from 'primevue/card';
import { AcademicCapIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { IApiAssignUser } from '@/types/ApiUser';
import { LEVELS, ROLES } from '@/modules/Constants';
import { useLanguageStore } from '@/stores/language-store';
import Dropdown from 'primevue/dropdown';
import { FileUploadUploaderEvent } from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import BaseButton from '@/components/BaseButton.vue';
import { useUserStore } from '@/stores/user-store';
import { useFirebaseStorage, useStorageFile } from 'vuefire';
import { ref as storageRef } from 'firebase/storage';
import { useRouter } from 'vue-router';
import { storage } from '@/firebase';

const router = useRouter();
const languageStore = useLanguageStore();
const userStore = useUserStore();

const user = ref<IApiAssignUser>({
	role: ROLES.Student,
	languages: [
		{
			language: 'English',
			level: 0,
		},
	],
});
const proof = ref<File>();
const isLoading = ref(false);

const isTeacher = computed(() => user.value.role === ROLES.Teacher);
const isSubmitDisabled = computed(() => {
	if (isTeacher.value) {
		return !user.value.languages[0].language || !proof.value;
	}

	return !user.value.languages[0].language;
});
const languages = computed(() => languageStore.languages);
const languagesWithLevel = computed(() =>
	languages.value
		.map((language) => {
			return Object.values(LEVELS)
				.filter((level) => typeof level === 'number')
				.map((level) => {
					return {
						name: `${language.name} - ${LEVELS[level as keyof typeof LEVELS]}`,
						value: `${language.name}-${level}`,
					};
				});
		})
		.flat(),
);

const userLanguageLevel = computed({
	get: () => {
		return {
			name: `${user.value.languages[0].language} - ${LEVELS[user.value.languages[0].level]}`,
			value: `${user.value.languages[0].language}-${user.value.languages[0].level}`,
		};
	},
	set: (value: { name: string; value: string }) => {
		const [language, level] = value.name.split(' - ');
		user.value.languages[0].language = language;
		user.value.languages[0].level = LEVELS[level as keyof typeof LEVELS] as number;
	},
});

function selectRole(role: ROLES) {
	user.value.role = role;
}

function onUpload(event: FileUploadUploaderEvent) {
	const files = event.files as File[];
	proof.value = files[0];
}

async function onSubmit() {
	isLoading.value = true;
	try {
		await userStore.assignUser(user.value);
		if (!isTeacher.value) {
			router.push({ name: 'login' });
			return;
		}
		console.debug(storage.app.name);

		const fbStorage = useFirebaseStorage();
		const avatarRef = storageRef(fbStorage, `${import.meta.env.VITE_FIREBASE_PROOFS_URL}/${Math.random().toString(36).slice(2)}.pdf`);
		const { url, upload } = useStorageFile(avatarRef);

		const interval = setInterval(async () => {
			if (url.value) {
				clearInterval(interval);
				await userStore.uploadProofs([url.value]);
				router.push({ name: 'login' });
			}
		}, 1000);

		await upload(proof.value as File);
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => {
	languageStore.getLanguages();
});
</script>
