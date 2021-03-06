<script lang="ts">
  import { TooltipDefinition, TooltipIcon } from 'carbon-components-svelte';
  import type { Player } from '../shared/types';
  import VoteButton from './VoteButton.svelte';
  import { playerStore } from '../stores/playerStore';
  import type { ThirdStatsToDisplay } from './playerHandler.ts';
  import { shouldDisableVote } from './playerHandler.ts';

  export let player: Player;
  export let highlightStats: ThirdStatsToDisplay;

  const stats = player.total;
  const [parentPath, key] = highlightStats.path;

  $: disableVote = shouldDisableVote($playerStore, player);
  $: hasVote = !!$playerStore.find((_) => _.id === player.id);

  function handleVote() {
    playerStore.vote({
      id: player.id,
      name: player.personalInfo.name,
      position: stats.games.position,
      photo: player.personalInfo.photo,
      teamLogo: stats.team.logo,
    });
  }
</script>

<div class="player">
  <div class="players-images">
    <div class="team-logo">
      <TooltipIcon tooltipText={stats.team.name}>
        <img src={stats.team.logo} alt="Team's player logo" />
      </TooltipIcon>
    </div>
    <img
      src={player.personalInfo.photo}
      alt="{player.personalInfo.name}'s photo"
      class="player-photo"
    />
  </div>
  <div>
    <h5>{player.personalInfo.name}</h5>
  </div>
  <div class="secondary-info">
    <span>{stats.games.position}</span>
    <span> • </span>
    <span>{player.personalInfo.age} y/o</span>
  </div>
  <div class="stats">
    <span>
      <TooltipDefinition tooltipText="Goals">
        {stats.goals.total || 0} GLS
      </TooltipDefinition>
    </span>
    <span>
      <TooltipDefinition tooltipText="Assists">
        {stats.goals.assists || 0} AST
      </TooltipDefinition>
    </span>
    <span>
      <TooltipDefinition tooltipText={highlightStats.tooltipText}>
        {stats[parentPath][key] || 0}
        {highlightStats.abbr}
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
    top: 5px;
  }

  .team-logo img {
    width: 30px;
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
