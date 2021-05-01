<script lang="ts" context="module">
  import type { LoadOutput } from '@sveltejs/kit/types/page';
  import { Button } from 'carbon-components-svelte';
  import { get } from '$lib/utils/api.ts';

  export async function load(): Promise<LoadOutput> {
    const response = await get('players');
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
  import { ChevronLeft20 } from 'carbon-icons-svelte';
  import type { Player } from '$lib/shared/types.ts';
  import PlayerCard from '$lib/components/PlayerCard.svelte';

  export let players: Player[];

  async function onChange(event) {
    const response = await get(`search?search=${event.target.value}`);
    players = await response.json();
  }

  async function onClear() {
    const response = await get('players');
    players = await response.json();
  }

  const debounceOnChange = debounce((e) => onChange(e), 400);
</script>

<div class="container">
  <div class="back">
    <Button kind="secondary" href="/">
      <div style="display: flex; align-items: center">
        <ChevronLeft20 />
        <span style="margin-left: 3px">See your choices</span>
      </div>
    </Button>
  </div>
  <Search on:input={debounceOnChange} on:clear={onClear} />
  <div class="players">
    {#each players as player (player.id)}
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

  .back {
    position: fixed;
    left: 4%;
  }

  .players {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px 15px;
  }

  .player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
