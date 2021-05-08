<script lang="ts" context="module">
  import type { LoadOutput } from '@sveltejs/kit/types/page';
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
  import { onMount } from 'svelte';
  import { Button, Checkbox, Search, Select, SelectItem } from 'carbon-components-svelte';
  import { ChevronLeft20 } from 'carbon-icons-svelte';
  import { debounce } from '$lib/utils/debounce.ts';
  import type { Player } from '$lib/shared/types.ts';
  import { SortByEnum, sortedPlayerPositionOptions } from '$lib/shared/types.ts';
  import { thirdStatsToDisplay, searchPlayers } from '$lib/components/playerHandler.ts';
  import PlayerCard from '$lib/components/PlayerCard.svelte';

  export let players: Player[];
  let init = false;
  let currentSearchQuery;
  let sortBy;
  let highlightStats = thirdStatsToDisplay('appearences');

  const positionCheckboxes = sortedPlayerPositionOptions.map((key) => ({
    position: key,
    checked: false,
  }));

  onMount(async () => {
    init = true; // todo find something better to avoid trigger multiple search at init
  });

  $: (async () => {
    if (!init) return
    players = await searchPlayers(positionCheckboxes, currentSearchQuery, sortBy);
    highlightStats = thirdStatsToDisplay(sortBy);
  })();

  async function onChange(event) {
    currentSearchQuery = event.target.value;
  }

  async function onClear() {
    currentSearchQuery = '';
  }

  const debounceOnChange = debounce((e) => onChange(e), 400);
</script>

<div class="container">
  <div class="back">
    <Button kind="secondary" href="/">
      <div class="back-button">
        <ChevronLeft20 />
        <span>See your choices</span>
      </div>
    </Button>
  </div>
  <div class="filters">
    <Select size="xl" labelText="Sort by :" bind:selected={sortBy} style="width: 200px">
      {#each Object.keys(SortByEnum) as sortCriteria}
        <SelectItem value={sortCriteria} text={SortByEnum[sortCriteria]} />
      {/each}
    </Select>
    <Search on:input={debounceOnChange} on:clear={onClear} style="border-left: 1px solid #ccc;" />
  </div>
  <div class="position-filter">
    <div class="checkboxes">
      <div class="checkboxes-label">Position:</div>
      {#each positionCheckboxes as { position, checked }}
        <Checkbox labelText={position} bind:checked style="margin-left: 10px;" />
      {/each}
    </div>
  </div>
  <!--    <InlineNotification-->
  <!--            kind="info"-->
  <!--            title="Players:"-->
  <!--            subtitle="Only players from teams playing the UEFA Champions League are displayed."-->
  <!--    />-->
  <div class="players">
    {#each players as player (player.id)}
      <div class="player">
        <PlayerCard {player} {highlightStats} />
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
    background-color: #f4f4f4;
  }

  .back {
    position: fixed;
    left: 4%;
    top: 53px;
  }

  .back-button {
    display: flex;
    align-items: center;
  }

  .back-button span {
    margin-left: 4px;
  }

  .filters {
    display: flex;
    align-items: flex-end;
    margin: 0 15px;
  }

  .position-filter {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .checkboxes {
    display: flex;
    align-items: baseline;
  }

  .checkboxes-label {
    font-weight: bold;
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
