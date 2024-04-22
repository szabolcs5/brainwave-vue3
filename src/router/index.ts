import { useAuthStore } from '@/stores/auth-store';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		name: 'login',
		component: () => import('@/views/LoginPage.vue'),
	},
	{
		path: '/',
		name: 'dashboard',
		component: () => import('@/views/DashboardPage.vue'),
		auth: true,
	},
	{
		path: '/profile',
		name: 'profile',
		component: () => import('@/views/ProfilePage.vue'),
		auth: true,
	},
	{
		path: '/linguaninja',
		name: 'linguaninja',
		component: () => import('@/views/LinguaPage.vue'),
	},
	{
		path: '/channels/:id',
		name: 'channel',
		component: () => import('@/views/ChannelPage.vue'),
	},
	{
		path: '/classrooms/:id',
		name: 'classroom',
		component: () => import('@/views/ClassroomPage.vue'),
	},
	{
		path: '/classrooms/:id/quizzes',
		name: 'quizzes',
		component: () => import('@/views/QuizzesPage.vue'),
	},
	{
		path: '/classrooms/:id/quizzes/create',
		name: 'create-quiz',
		component: () => import('@/views/CreateQuiz.vue'),
	},
	{
		path: '/classrooms/:id/quizzes/:quizID',
		name: 'quiz',
		component: () => import('@/views/QuizPage.vue'),
	},
	{
		path: '/classrooms/:id/quizzes/:quizID/entries',
		name: 'entries',
		component: () => import('@/views/EntriesPage.vue'),
	},
	{
		path: '/sign-up',
		name: 'sign-up',
		component: () => import('@/views/SignUpPage.vue'),
	},
	{
		path: '/assign',
		name: 'assign',
		component: () => import('@/views/AssignPage.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, _from, next) => {
	const authStore = useAuthStore();
	authStore.user = JSON.parse(localStorage.getItem('user')!);
	authStore.isLoggedIn = !!localStorage.getItem('token');
	const isLoggedIn = authStore.isLoggedIn;

	if (isLoggedIn && to.name === 'login') {
		next({
			name: 'dashboard',
		});
		return;
	}

	if (to.matched.some((record) => record.meta.auth) && !isLoggedIn) {
		next('/');
		return;
	}
	next();
});

export default router;
