<script lang="ts">
  import { Button } from 'carbon-components-svelte';
  import Fa from 'svelte-fa';
  import { faTshirt, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { playerStore } from '$lib/stores/playerStore';
</script>

<div class="background">
  <div class="triangle-top-left" />
  <div class="triangle-top-right" />
  <h2 class="title">Best XI</h2>
  <div class="parent">
    <div class="image-container">
      <img src="./static/pitch_3.jpg" class="pitch" alt="Football field" />
    </div>
    <div class="container">
      <div class="container--field container--section">
        {#each Array(11) as _, i}
          <div class="player player-{i}">
            {#if $playerStore[i]}
              <div style="text-align: center">
                <div on:click={() => playerStore.unVote($playerStore[i].id)}>
                  <Fa icon={faTimes} color="#333" />
                </div>
                <img
                  src={$playerStore[i].photo}
                  alt="{$playerStore[i].name}'s picture"
                  width="50"
                />
                <div>{$playerStore[i].name}</div>
              </div>
            {:else}
              <Fa icon={faTshirt} size="3x" />
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="actions">
    <Button href="/players">Search players</Button>
    <Button href="/vote">Submit your vote</Button>
  </div>
</div>

<style>
  .title {
    text-align: center;
    margin: 0;
    padding: 20px 0;
  }

  .triangle-top-left {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: 70px solid #103252;
    border-right: 140px solid transparent;
  }

  .triangle-top-right {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 70px solid #103252;
    border-left: 140px solid transparent;
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
    color: #fff;
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
