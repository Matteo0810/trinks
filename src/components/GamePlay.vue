<template>
  <select-players v-if="!game.isGameStarted.value" @start-game="game.start" />
  <game-challenge
    v-else
    :challenge="game.current.value"
    @stop-game="game.stop"
  />
</template>

<script setup lang="ts">
import useGame from '@/composables/useGame'
import { onBeforeUnmount, onMounted } from 'vue'

import SelectPlayers from '@/components/SelectPlayers.vue'
import GameChallenge from './GameChallenge.vue'

const game = useGame()

function handleNext(event: KeyboardEvent) {
  if (event.code === 'Space') game.next()
}

onBeforeUnmount(() => window.removeEventListener('keypress', handleNext))
onMounted(() => {
  window.addEventListener('keypress', handleNext)
})
</script>
