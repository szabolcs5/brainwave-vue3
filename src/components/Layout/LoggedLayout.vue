<template>
	<div>
		<TransitionRoot as="template" :show="sidebarOpen">
			<Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
				<TransitionChild
					as="template"
					enter="transition-opacity ease-linear duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-gray-900/80" />
				</TransitionChild>

				<div class="fixed inset-0 flex">
					<TransitionChild
						as="template"
						enter="transition ease-in-out duration-300 transform"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
					>
						<DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
							<TransitionChild
								as="template"
								enter="ease-in-out duration-300"
								enter-from="opacity-0"
								enter-to="opacity-100"
								leave="ease-in-out duration-300"
								leave-from="opacity-100"
								leave-to="opacity-0"
							>
								<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
									<button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
										<span class="sr-only">Close sidebar</span>
										<XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
									</button>
								</div>
							</TransitionChild>
							<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
								<div class="flex h-16 shrink-0 items-center"></div>
								<nav class="flex flex-1 flex-col">
									<ul role="list" class="flex flex-1 flex-col gap-y-7">
										<li>
											<ul role="list" class="-mx-2 space-y-1">
												<li v-for="item in navigation" :key="item.name">
													<div
														:class="[
															item.current ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50',
															'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
														]"
														@click="routeSidebar(item.href)"
													>
														<component
															:is="item.icon"
															v-if="item.icon"
															:class="[item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary', 'h-6 w-6 shrink-0']"
															aria-hidden="true"
														/>
														<img v-else class="h-6 w-6" :src="item.img" :alt="item.name" />
														{{ item.name }}
													</div>
												</li>
											</ul>
										</li>
										<PanelMenu :model="menuItems" class="w-full md:w-20rem">
											<template #itemicon="menuItem">
												<component
													:is="menuItem.item.icon || ChevronDownIcon"
													class="w-4 h-4 aria-hidden"
													@click="openMenuItem(menuItem.item.label)"
												/> </template
										></PanelMenu>
									</ul>
								</nav>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</TransitionRoot>

		<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
			<div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
				<div class="flex h-16 justify-center shrink-0 items-center">
					<img class="h-16 w-auto cursor-pointer" src="@/assets/logo-without-name.png" alt="brainwave-logo" @click="redirectToHome" />
				</div>
				<nav class="flex flex-1 flex-col">
					<ul role="list" class="flex flex-1 flex-col gap-y-7">
						<li>
							<ul role="list" class="-mx-2 space-y-1">
								<li v-for="item in navigation" :key="item.name">
									<div
										v-if="item.name"
										:class="[
											item.current ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50',
											'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
										]"
										@click="routeSidebar(item.href)"
									>
										<component
											:is="item.icon"
											v-if="item.icon"
											:class="[item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary', 'h-6 w-6 shrink-0']"
											aria-hidden="true"
										/>
										<img v-else class="h-6 w-6" :src="item.img" :alt="item.name" />
										{{ item.name }}
									</div>
								</li>
							</ul>
						</li>
						<PanelMenu :model="menuItems" class="w-full md:w-20rem">
							<template #item="{ item }">
								<div class="flex items-center cursor-pointer mb-2 w-full" @click="openMenuItem(item.label)">
									<component :is="ChevronUpDownIcon" v-if="isMainItem(item.label)" class="h-4 w-4 aria-hidden" />
									<component :is="item.icon" class="h-4 w-4 aria-hidden" />
									<p class="ml-2 text-color font-medium text-lg">{{ item.label }}</p>
								</div>
							</template>
						</PanelMenu>
					</ul>
				</nav>
			</div>
		</div>

		<div class="lg:pl-72">
			<div
				class="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between lg:justify-end gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
			>
				<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
					<span class="sr-only">Open sidebar</span>
					<Bars3Icon class="h-6 w-6" aria-hidden="true" />
				</button>

				<div class="flex gap-x-4 self-stretch lg:gap-x-6">
					<div class="flex items-center justify-end gap-x-4 lg:gap-x-6">
						<Menu as="div" class="relative">
							<MenuButton class="-m-1.5 flex items-center p-1.5">
								<span class="sr-only">Open user menu</span>
								<img class="h-8 w-8 rounded-full bg-gray-50" :src="user.avatar" alt="avatar" />
								<span class="hidden lg:flex lg:items-center">
									<span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{ name }}</span>
									<ChevronDownIcon class="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
								</span>
							</MenuButton>
							<transition
								enter-active-class="transition ease-out duration-100"
								enter-from-class="transform opacity-0 scale-95"
								enter-to-class="transform opacity-100 scale-100"
								leave-active-class="transition ease-in duration-75"
								leave-from-class="transform opacity-100 scale-100"
								leave-to-class="transform opacity-0 scale-95"
							>
								<MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
									<MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
										<button
											v-if="item.name"
											:class="[active ? 'bg-gray-50' : '', 'w-full block px-3 py-1 text-sm leading-6 text-gray-900']"
											@click="item.onClick"
										>
											{{ item.name }}
										</button>
									</MenuItem>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</div>
			</div>

			<main class="py-10">
				<div class="px-4 sm:px-6 lg:px-8">
					<slot />
				</div>
			</main>
		</div>
	</div>
	<FeedbackModal v-if="isFeedbackOpen" v-model="isFeedbackOpen" @close="isFeedbackOpen = false" />
	<ClassroomModal v-if="isClassroomOpen" v-model="isClassroomOpen" @close="isClassroomOpen = false" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Dialog, DialogPanel, Menu, MenuButton, MenuItems, MenuItem, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Bars3Icon, ChatBubbleLeftIcon, ChevronUpDownIcon, HomeIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';
import PanelMenu from 'primevue/panelmenu';
import FeedbackModal from '../Modals/FeedbackModal.vue';
import { ROLES } from '@/modules/Constants';
import ClassroomModal from '../Modals/ClassroomModal.vue';

const authStore = useAuthStore();
const router = useRouter();

const sidebarOpen = ref(false);
const isFeedbackOpen = ref(false);
const isClassroomOpen = ref(false);

const isTeacher = computed(() => authStore.user.role === ROLES.Teacher);
const currentPage = computed(() => router.currentRoute.value.name);
const user = computed(() => authStore.user);
const classrooms = computed(() => authStore.user.classrooms?.map((classroom) => ({ label: classroom.name, icon: ChatBubbleLeftIcon })) ?? []);
const channels = computed(() => authStore.user.channels?.map((channel) => ({ label: channel.name, icon: ChatBubbleLeftIcon })) ?? []);
const name = computed(() => `${user.value.firstname} ${user.value.lastname}`);

const navigation = ref([
	{ name: 'Dashboard', icon: HomeIcon, current: currentPage.value === 'dashboard', href: 'dashboard' },
	!isTeacher.value
		? { name: 'LinguaNinja', icon: '', img: '/src/assets/linguaninja.jpg', current: currentPage.value === 'linguaninja', href: 'linguaninja' }
		: { name: '', current: false, href: '' },
]);

const userNavigation = [
	{ name: 'Your profile', onClick: openProfile },
	{ name: 'Give feedback', onClick: openFeedback },
	{ name: 'Sign out', onClick: logout },
];

const menuItems = ref<PanelItem[]>([
	{
		label: 'Public Channels',
		items: [...channels.value],
	},
	{
		label: 'Classrooms',
		items: [...classrooms.value, { icon: PlusIcon, label: user.value.role === ROLES.Student ? 'Join Classroom' : 'Create Classroom' }],
	},
]);

type PanelItem = {
	label: string;
	items: { label: string }[];
};

function isMainItem(label: unknown) {
	return label === 'Public Channels' || label === 'Classrooms';
}

async function logout() {
	try {
		await authStore.logout();
		router.push({ name: 'login' });
	} catch (error) {
		console.log(error);
	}
}

function openProfile() {
	router.push({ name: 'profile' });
}

function redirectToHome() {
	router.push({ name: 'dashboard' });
}

function openFeedback() {
	isFeedbackOpen.value = true;
}

function openClassroom() {
	isClassroomOpen.value = true;
}

function reloadSidebar() {
	navigation.value = navigation.value.map((item) => ({ ...item, current: item.href === currentPage.value }));
}

function routeSidebar(href: string) {
	router.push({ name: href });
}

function openMenuItem(label: unknown) {
	if (label === 'Join Classroom') {
		openClassroom();
		return;
	}

	authStore.user.classrooms.find((classroom) => {
		if (classroom.name === label) {
			router.push({ name: 'classroom', params: { id: classroom._id } });
		}
	});

	authStore.user.channels.find((channel) => {
		if (channel.name === label) {
			router.push({ name: 'channel', params: { id: channel._id } });
		}
	});
}

watch(() => currentPage.value, reloadSidebar);
</script>
<style scoped>
:deep(.p-menuitem-link) {
	gap: 0.5rem;
}
:deep(.p-panelmenu-header-content) {
	background-color: transparent;
}
:deep(.p-panelmenu-header-action) {
	padding-left: 0;
}
</style>
