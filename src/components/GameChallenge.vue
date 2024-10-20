<template>
  <div class="background" :class="challenge?.type">
    <button class="close" @click="emit('stopGame')">&times;</button>
    <div class="center">
      <h1>{{ challenge?.title }}</h1>
      <h2>{{ challenge?.description }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IGameElement } from '@/composables/useGame'

defineProps<{
  challenge: IGameElement | null
}>()

const emit = defineEmits(['stopGame'])
</script>

<style scoped>
@import '@/assets/components/game-challenge.css';
</style>
