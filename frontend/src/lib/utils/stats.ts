import type { SortCriteria } from '$lib/shared/types';

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
