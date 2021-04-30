<script lang="ts">
  import { Button } from 'carbon-components-svelte';
  export let kind;
  export let disabled;
</script>

<Button
  style="width: 100%; border-radius: 5px; text-transform: uppercase; display: block; text-align: center; padding: 0;"
  {kind}
  {disabled}
  on:click
>
  <slot />
</Button>
