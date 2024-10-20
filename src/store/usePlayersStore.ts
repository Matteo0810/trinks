import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

interface IStorage {
  players: string[]
}

export default defineStore('players', () => {
  const ITEM_NAME = 'trinks_picolo_players'

  const players = ref<string[]>([])

  function _getStorage(): Partial<IStorage> | null {
    const item = localStorage.getItem(ITEM_NAME)
    if (!item) return null
    return JSON.parse(item)
  }

  function _store(data: Partial<IStorage>): void {
    let storage = _getStorage()
    if (!storage) storage = {}
    localStorage.setItem(ITEM_NAME, JSON.stringify({ ...storage, ...data }))
  }

  function _load(): void {
    const storage = _getStorage()
    if (!storage) return
    if (storage.players) players.value = storage.players
  }

  function updatePlayers(): void {
    _store({ players: players.value })
  }

  function removePlayer(player: string): void {
    players.value.splice(players.value.indexOf(player), 1)
    updatePlayers()
  }

  function addPlayer(player: string): void {
    players.value.push(player)
    updatePlayers()
  }

  function pickRandomPlayer(): string {
    const randomNumber =
      Math.floor(Math.random() * players.value.length) % players.value.length
    return players.value[randomNumber]
  }

  function pickRnadomPlayers(number: number): string[] {
    const playersCpy = [...players.value]
    const result = []

    while (result.length < number) {
      const randomNumber =
        Math.floor(Math.random() * playersCpy.length) % players.value.length
      result.push(playersCpy[randomNumber])
      playersCpy.splice(randomNumber, 1)
    }

    return result
  }

  function clear() {
    players.value = []
    _store({ players: players.value })
  }

  onMounted(() => _load())

  return {
    players,
    addPlayer,
    removePlayer,
    pickRandomPlayer,
    pickRnadomPlayers,
    clear,
  }
})
