<script lang="ts" context="module">
  import type { LoadOutput } from '@sveltejs/kit/types/page';

  const apiURL = 'http://localhost:8080/players';

  export async function load(): Promise<LoadOutput> {
    const response = await fetch(apiURL);
    return {
      props: {
        players: await response.json(),
      },
    };
  }
</script>

<script lang="ts">
  import { Search } from 'carbon-components-svelte';
  import PlayerCard from '$lib/components/PlayerCard.svelte';
  import type { PlayerInfo } from '$lib/shared/types.ts';

  export let players: PlayerInfo[];
</script>

<div class="container">
  <Search />
  <div class="players">
    {#each players as player}
      <div class="player">
        <PlayerCard {player} />
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    width: 60vw;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
  }

  .players {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
  }

  .player {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
