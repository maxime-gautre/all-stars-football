<script lang="ts">
  import type { SelectedPlayer } from '../stores/playerStore.ts';
  import { Close16 } from 'carbon-icons-svelte';

  export let player: SelectedPlayer;
  export let onClose;
</script>

<div class="mini-player-card">
  <span class="close-button" on:click={onClose}>
    <Close16 />
  </span>
  <div class="player-images">
    <img src={player.teamLogo} alt="Team's player logo" class="team-logo" />
    <img src={player.photo} alt="{player.name}'s picture" class="player-photo" />
  </div>
  <div class="player-panel">
    <h6>{player.name}</h6>
  </div>
</div>

<style>
  .mini-player-card {
    position: relative;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    width: 100px;
    background-color: #eee;
  }

  .close-button {
    position: absolute;
    top: 2px;
    left: 2px;
    color: #333;
  }

  .player-images {
    background-color: #fff;
  }

  .team-logo {
    position: absolute;
    right: 5px;
    width: 20px;
    top: 5px;
  }

  .player-photo {
    border-radius: 5px;
    height: 45px;
  }

  .player-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
  }
</style>
