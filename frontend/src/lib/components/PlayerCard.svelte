<script lang="ts">
  import { TooltipDefinition } from 'carbon-components-svelte';
  import type { Player } from '../shared/types';
  import VoteButton from './VoteButton.svelte';
  import { playerStore } from '../stores/playerStore';

  export let player: Player;
  $: disableVote = $playerStore.length > 10;
  $: hasVote = !!$playerStore.find((_) => _.id === player.id);

  const stats = player.statistics[0];

  function handleVote() {
    playerStore.vote({
      id: player.id,
      name: player.name,
      photo: player.photo,
      teamLogo: stats.team.logo,
    });
  }
</script>

<div class="player">
  <div class="players-images">
    <img src={stats.team.logo} alt="Team's player logo" class="team-logo" />
    <img src={player.photo} alt="{player.name}'s photo" class="player-photo" />
  </div>
  <div>
    <h5>{player.name}</h5>
  </div>
  <div class="secondary-info">
    <span>{stats.games.position}</span>
    <span> • </span>
    <span>{player.age} y/o</span>
  </div>
  <div class="stats">
    <span>
      <TooltipDefinition tooltipText="Games played">
        {stats.games.appearences || 0} GP
      </TooltipDefinition>
    </span>
    <span>
      <TooltipDefinition tooltipText="Goals">
        {stats.goals.total || 0} GLS
      </TooltipDefinition>
    </span>
    <span>
      <TooltipDefinition tooltipText="Assists">
        {stats.passes.key || 0} AST
      </TooltipDefinition>
    </span>
  </div>
  {#if hasVote}
    <VoteButton kind="secondary" on:click={() => playerStore.unVote(player.id)}>Unvote</VoteButton>
  {:else}
    <VoteButton kind="primary" on:click={handleVote} disabled={disableVote}>Vote</VoteButton>
  {/if}
</div>

<style>
  .player {
    border: 1px solid #ccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    width: 170px;
    background-color: #eee;
  }

  .players-images {
    position: relative;
    margin-bottom: 5px;
    background: #fff;
  }

  .team-logo {
    position: absolute;
    right: 5px;
    width: 30px;
    top: 5px;
  }

  .player-photo {
    border-radius: 5px;
    height: 80px;
  }

  .secondary-info {
    font-size: 13px;
    margin: 5px 0;
  }

  .stats {
    margin: 15px 0;
    font-size: 9px;
    font-weight: bold;
  }

  .stats span {
    margin: 0 4px;
  }
</style>
