<template>
	<form>
		<div class="space-y-12">
			<div class="border-b border-gray-900/10 pb-12">
				<h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
				<p class="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

				<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="sm:col-span-3">
						<label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
						<div class="mt-2">
							<FormInput v-model="profile.firstname" :required="false" name="first-name" text="" />
						</div>
					</div>

					<div class="sm:col-span-3">
						<label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
						<div class="mt-2">
							<FormInput v-model="profile.lastname" :required="false" name="last-name" text="" />
						</div>
					</div>

					<div class="sm:col-span-4">
						<label for="username" class="block text-sm font-medium leading-6 text-gray-900">Nickname</label>
						<div class="mt-2">
							<FormInput v-model="profile.nickname" :required="false" name="nickname" text="" />
						</div>
					</div>

					<div class="col-span-full">
						<label for="description" class="block text-sm font-medium leading-6 text-gray-900">About</label>
						<div class="mt-2">
							<FormTextArea v-model="profile.description" />
						</div>
						<p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
					</div>

					<div class="col-span-full">
						<label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Photo</label>
						<div class="mt-2 flex items-center gap-x-3">
							<UserCircleIcon v-if="!profile.avatar" class="h-12 w-12 text-gray-300" aria-hidden="true" />
							<img v-else :src="profile.avatar" alt="Profile photo" class="h-12 w-12 rounded-full" />
							<BaseButton
								label="Change"
								class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							/>
						</div>
					</div>

					<div class="flex flex-col">
						<h3 class="text-sm font-medium leading-6 text-gray-900">Languages</h3>
						<div v-for="languageLevel in profile.languages" :key="languageLevel.createdAt">
							<div class="sm:col-span-3">
								<div class="mt-2">
									<div>{{ languageLevel.language }} - {{ languageLevel.level }}</div>
								</div>
							</div>
						</div>
					</div>

					<div ref="iframeContainer" class="col-span-full flex flex-col space-y-4">
						<div class="flex flex-col justify-end items-center space-y-2">
							<PencilSquareIcon class="h-5 w-5 text-gray-400 cursor-pointer" aria-hidden="true" @click="editIframe" />
							<FormTextArea v-if="isEditingIframe" v-model="profile.spotify_embedded_iframe" />
						</div>
						<iframe v-if="!isEditingIframe" :src="spotifyURL" width="100%" height="200" />
					</div>

					<div class="flex flex-col space-y-4 col-span-full">
						<ProfileCard v-if="profile.current_book" is-book title="Current Book" :description="bookTitle" :percentage="profile.current_book?.percentage" />
						<ProfileCard v-if="profile.current_tv_show" title="Current TV Show" :description="tvTitle" :percentage="profile.current_tv_show?.percentage" />
					</div>
				</div>
			</div>
		</div>

		<div v-if="errorMessage" class="mt-6 p-4 bg-red-100 text-red-600 rounded-md">{{ errorMessage }}</div>

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<BaseButton label="Cancel" @click="cancelEdit" />
			<BaseButton label="Save" @click="onSave" />
		</div>
	</form>
</template>
<script setup lang="ts">
import { useProfileStore } from '@/stores/profile-store';
import { computed, onMounted, ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import ProfileCard from '@/components/Profile/ProfileCard.vue';
import FormTextArea from '@/components/Form/FormTextArea.vue';

const profileStore = useProfileStore();

const iframeContainer = ref<HTMLDivElement | null>(null);
const isEditingIframe = ref(false);

const errorMessage = ref('');
const profile = computed(() => profileStore.userProfile);
const spotifyURL = computed(() => (profile.value.spotify_embedded_iframe ? profile.value.spotify_embedded_iframe.split('src="')[1].split('"')[0] : ''));
const bookTitle = computed(() => (profile.value.current_book ? profile.value.current_book.title : 'No book'));
const tvTitle = computed(() => (profile.value.current_tv_show ? profile.value.current_tv_show.title : 'No TV show'));

function cancelEdit() {
	profileStore.userProfile = { ...profileStore.savedProfile };
}

function editIframe() {
	isEditingIframe.value = !isEditingIframe.value;
}

function onSave() {
	try {
		profileStore.updateProfile();
	} catch (error) {
		errorMessage.value = 'Please check your inputs and try again.';
	}
}

onMounted(profileStore.getProfile);
</script>
