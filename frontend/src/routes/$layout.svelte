<script>
  import 'carbon-components-svelte/css/g10.css';
</script>

<div class="background">
  <slot />
</div>

<style>
  .background {
    min-height: 100vh;
    background-image: url('static/soccer-pattern.png');
    background-position: center center;
    background-repeat: repeat;
    background-size: 400px;
  }
</style>
