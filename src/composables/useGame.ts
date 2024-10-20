import gameData from '@/data/game.json'
import usePlayersStore from '@/store/usePlayersStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

type TGameType = 'game' | 'penalty' | 'virus' | 'ultimatePenalty'
const GameTypeMapper: { [key: string]: string } = {
  game: 'Jeu',
  penalty: 'Pénalité',
  virus: 'Virus',
  ultimatePenalty: 'Pénalité ultime',
}
interface IGame {
  type: TGameType
  text: string
  metadata: object
}
export interface IGameElement {
  title?: string
  description: string
  type: TGameType
}

interface IStorage {
  isGameStarted: boolean
  current: IGameElement | null
}

export default function useGame() {
  const ITEM_NAME = 'trinks_picolo_game'

  const { pickRnadomPlayers } = usePlayersStore()
  const { players } = storeToRefs(usePlayersStore())

  const game = gameData as IGame[]
  const current = ref<IGameElement | null>(null)

  const isGameStarted = ref<boolean>(false)

  function _parsePlayers(text: string): string {
    const reg = /\{player\}/g.exec(text)
    if (reg?.length) {
      const players = pickRnadomPlayers(reg.length)
      reg.forEach(
        _ => (text = text.replace('{player}', players.pop() as string)),
      )
    }
    return text
  }

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
    if (storage.current) current.value = storage.current
    if (storage.isGameStarted !== undefined)
      isGameStarted.value = storage.isGameStarted
  }

  function pickRandomChallenge(): IGame {
    const pickedNumber = Math.floor(Math.random() * game.length) % game.length
    return game[pickedNumber]
  }

  function next(): void {
    const { type, text } = pickRandomChallenge()
    current.value = {
      title: GameTypeMapper[type],
      description: _parsePlayers(text),
      type,
    }
    _store({
      current: current.value,
    })
  }

  function start(): void {
    if (players.value.length) {
      isGameStarted.value = true
      next()
      _store({ isGameStarted: isGameStarted.value })
    }
  }

  function stop(): void {
    current.value = null
    isGameStarted.value = false
    usePlayersStore().clear()
    _store({ current: current.value, isGameStarted: isGameStarted.value })
  }

  onMounted(() => _load())

  return { current, next, isGameStarted, start, stop }
}
