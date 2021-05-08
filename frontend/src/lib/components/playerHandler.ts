import type { SortCriteria, Player, PlayerPosition } from '$lib/shared/types';
import type { SelectedPlayer } from '$lib/stores/playerStore';
import { get } from '$lib/utils/api';

export type ThirdStatsToDisplay = {
  path: [string, string];
  tooltipText: string;
  abbr: string;
};

export function thirdStatsToDisplay(sortBy: SortCriteria): ThirdStatsToDisplay {
  switch (sortBy) {
    case 'goals':
    case 'assists':
    case 'appearences':
      return {
        path: ['games', 'appearences'],
        tooltipText: 'Games played',
        abbr: 'GP',
      };
    case 'saves':
      return {
        path: ['goals', 'saves'],
        tooltipText: 'Goals saves',
        abbr: 'GS',
      };
    case 'tackles':
      return {
        path: ['tackles', 'total'],
        tooltipText: 'Tackles',
        abbr: 'TKL',
      };
    case 'dribbles':
      return {
        path: ['dribbles', 'success'],
        tooltipText: 'Dribbles succeeded',
        abbr: 'DRB',
      };
    default:
      return {
        path: ['games', 'appearences'],
        tooltipText: 'Games played',
        abbr: 'GP',
      };
  }
}

export function shouldDisableVote(
  selectedPlayers: SelectedPlayer[],
  currentPlayer: Player
): boolean {
  const allPlayersSelected = selectedPlayers.length > 10;
  const hasAlreadyOneGoalkeeperSelected =
    currentPlayer.total.games.position === 'Goalkeeper' &&
    selectedPlayers.some((_) => _.position === 'Goalkeeper');
  const noGoalkeeperSelected =
    currentPlayer.total.games.position !== 'Goalkeeper' &&
    selectedPlayers.length === 10 &&
    selectedPlayers.every((_) => _.position !== 'Goalkeeper');

  return allPlayersSelected || hasAlreadyOneGoalkeeperSelected || noGoalkeeperSelected;
}

export async function searchPlayers(
  positionCheckboxes: { position: PlayerPosition; checked: boolean }[],
  currentSearchQuery: string | undefined,
  sortBy: string | undefined
): Promise<Player[]> {
  const positionFilters: PlayerPosition[] = positionCheckboxes
    .filter((_) => _.checked)
    .map(({ position }) => position);

  const searchParams = currentSearchQuery !== undefined ? { search: currentSearchQuery } : {};
  const sortByParams = sortBy ? { sortBy: sortBy } : {};
  const positionParams = positionFilters.length > 0 ? { positions: positionFilters } : {};
  // @ts-ignore
  const urlParams = new URLSearchParams({ ...searchParams, ...sortByParams, ...positionParams });
  const response = await get(`search?${urlParams}`);
  const results = await response.json();
  return results;
}
