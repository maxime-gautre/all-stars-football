import { writable } from 'svelte/store';

export type SelectedPlayer = {
  id: number;
  name: string;
  photo: string;
  teamLogo: string;
};

function store() {
  const selectedPlayers = [] as SelectedPlayer[];
  const { subscribe, update } = writable<SelectedPlayer[]>(selectedPlayers);

  return {
    subscribe,
    vote: (selectedPlayer: SelectedPlayer) => update((elements) => [...elements, selectedPlayer]),
    unVote: (playerId: number) => update((elements) => elements.filter((_) => _.id !== playerId)),
  };
}

export const playerStore = store();
