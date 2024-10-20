<template>
  <div class="center">
    <ul class="players">
      <li v-for="player in players" :key="player">
        {{ player }}
        <button @click="() => removePlayer(player)">-</button>
      </li>
    </ul>

    <footer>
      <input placeholder="Ajouter un joueur" v-model="playerInput" />
      <button class="add" @click="add">+</button>
      <button class="play" @click="emit('startGame')">-></button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import usePlayersStore from '@/store/usePlayersStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { addPlayer, removePlayer } = usePlayersStore()
const { players } = storeToRefs(usePlayersStore())

const emit = defineEmits(['startGame'])

const playerInput = ref<string>('')

function add(): void {
  if (!playerInput.value.trim()) return
  addPlayer(playerInput.value)
  playerInput.value = ''
}
</script>

<style scoped>
@import '@/assets/components/select-players.css';
</style>
