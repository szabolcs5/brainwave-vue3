<template>
	<div class="flex flex-col p-32 lg:flex-row space-y-16 lg:space-x-16">
		<div class="w-full lg:w-1/2 flex flex-col items-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl italic">BrainWave</h1>
			<img src="@/assets/logo-without-name.png" alt="logo" class="w-64 h-64" />
			<p class="font-bold text-pretty text-center">
				Embark on a Linguistic Journey and Connect with Language Enthusiasts on BrainWave! Immerse yourself in a vibrant community tailored for language learning and
				communication. Whether you are mastering a new language or seeking language exchange partners. BrainWave is your gateway to meaningful connections and accelerated
				language acquisition. Engage in real-time conversations, share cultural insights, and collaborate with fellow language enthusiasts who share your passion. Expand
				your linguistic horizons and forge global connections with BrainWave, your ultimate language learning companion. Join us today and unleash your multilingual
				potential!
			</p>
		</div>
		<slot />
	</div>
</template>
<script setup lang="ts"></script>
