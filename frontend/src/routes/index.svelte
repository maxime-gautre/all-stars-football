<script lang="ts">
  import { Button, ButtonSet } from 'carbon-components-svelte';
  import { Search20, SendFilled20 } from 'carbon-icons-svelte';
  import Fa from 'svelte-fa';
  import { faTshirt } from '@fortawesome/free-solid-svg-icons';
  import { playerStore } from '$lib/stores/playerStore';
  import SelectedPlayerCard from '../lib/components/SelectedPlayerCard.svelte';

  const NumberOfPlayers = 11;
</script>

<div>
  <h2 class="title">Best XI</h2>
  <div class="parent">
    <div class="image-container">
      <img src="./static/pitch.jpg" class="pitch" alt="Football field" />
    </div>
    <div class="container">
      <div class="container--field">
        {#each Array(NumberOfPlayers) as _, i}
          <div class="player player-{i}">
            {#if $playerStore[i]}
              <SelectedPlayerCard
                player={$playerStore[i]}
                onClose={() => playerStore.unVote($playerStore[i].id)}
              />
            {:else}
              <Fa color="#FFF" icon={faTshirt} size="3x" />
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="actions">
    <ButtonSet>
      <Button href="/players" kind="secondary" icon={Search20}>Search players</Button>
      <Button href="/vote" icon={SendFilled20} disabled={$playerStore.length !== NumberOfPlayers}
        >Submit your vote</Button
      >
    </ButtonSet>
  </div>
</div>

<style>
  .title {
    text-align: center;
    margin: 0;
    padding: 20px 0;
  }

  .parent {
    position: relative;
  }

  .image-container {
    perspective: 1000px;
    margin-top: -100px;
    position: relative;
  }

  .pitch {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 65vw;
    transform: rotateX(45deg);
  }

  .actions {
    display: flex;
    justify-content: center;
  }

  .container {
    position: absolute;
    top: 120px;
    left: 240px;
    width: 53vw;
  }

  .container--field {
    background-color: transparent;
    border-radius: 10px;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 30px;
    grid-template-rows: repeat(12, 1fr);
    grid-template-columns: repeat(4, 1fr);
    padding: 1em;
    z-index: 1000;
  }

  .player {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .player-0 {
    grid-row: span 12;
  }

  .player-1,
  .player-2,
  .player-3,
  .player-4 {
    grid-row: span 3;
  }

  .player-5,
  .player-6,
  .player-7,
  .player-8,
  .player-9,
  .player-10 {
    grid-row: span 4;
  }
</style>
