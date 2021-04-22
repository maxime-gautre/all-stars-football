<script lang="ts">
  import type { PlayerInfo } from '../shared/types.ts';
  export let player: PlayerInfo;
</script>

<div class="player">
  <img src={player.photo} alt="{player.name}'s photo" />
  <h3>{player.name}</h3>
  <div>{player.nationality}</div>
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
