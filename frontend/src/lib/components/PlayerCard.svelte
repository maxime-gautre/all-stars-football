<script lang="ts">
  import { Button } from 'carbon-components-svelte';
  import type { PlayerInfo } from '../shared/types';
  import { playerStore } from '../stores/playerStore';

  export let player: PlayerInfo;
  $: disableVote = $playerStore.length > 10;
  $: hasVote = !!$playerStore.find((_) => _.id === player.id);

  function handleVote() {
    playerStore.vote({
      id: player.id,
      name: player.name,
      photo: player.photo,
    });
  }
</script>

<div class="player">
  <img src={player.photo} alt="{player.name}'s photo" />
  <h3>{player.name}</h3>
  <div>{player.nationality}</div>
  {#if hasVote}
    <Button kind="outline" on:click={() => playerStore.unVote(player.id)}>Unvote</Button>
  {:else}
    <Button kind="secondary" on:click={handleVote} disabled={disableVote}>Vote</Button>
  {/if}
</div>

<style>
  .player {
    padding: 5px;
    border: 1px solid #ddd;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    max-width: 120px;
  }

  img {
    border-radius: 5px;
    width: 100px;
  }

  h3 {
    font-size: 16px;
    margin: 0;
  }
</style>
