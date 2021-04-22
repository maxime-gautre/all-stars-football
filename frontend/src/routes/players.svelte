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
  import { debounce } from '$lib/utils/debounce.ts';
  import type { PlayerInfo } from '$lib/shared/types.ts';
  import PlayerCard from '$lib/components/PlayerCard.svelte';

  export let players: PlayerInfo[];

  async function onChange(event) {
    const response = await fetch(`http://localhost:8080/search/?search=${event.target.value}`);
    players = await response.json();
  }

  async function onClear() {
    const response = await fetch('http://localhost:8080/players');
    players = await response.json();
  }

  const debounceOnChange = debounce((e) => onChange(e), 500);
</script>

<div class="container">
  <Search on:input={debounceOnChange} on:clear={onClear} />
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
    padding: 2em 0;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
