import { writable } from 'svelte/store';
import type { PlayerPosition } from '$lib/shared/types';
import { sortedPlayerPositionOptions } from '$lib/shared/types';

export type SelectedPlayer = {
  id: number;
  name: string;
  position: PlayerPosition;
  photo: string;
  teamLogo: string;
};

function store() {
  const selectedPlayers = [] as SelectedPlayer[];
  const { subscribe, update } = writable<SelectedPlayer[]>(selectedPlayers);

  return {
    subscribe,
    vote: (selectedPlayer: SelectedPlayer) =>
      update((elements) => {
        return [...elements, selectedPlayer].sort(
          (a: SelectedPlayer, b: SelectedPlayer) =>
            sortedPlayerPositionOptions.indexOf(a.position) -
            sortedPlayerPositionOptions.indexOf(b.position)
        );
      }),
    unVote: (playerId: number) => update((elements) => elements.filter((_) => _.id !== playerId)),
  };
}

export const playerStore = store();
