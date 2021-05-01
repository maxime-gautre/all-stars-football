<script lang="ts">
  import { Button, InlineNotification, Form, FormGroup, TextInput } from 'carbon-components-svelte';
  import { SendFilled20 } from 'carbon-icons-svelte';

  import { playerStore } from '$lib/stores/playerStore';
  import { post } from '$lib/utils/api.ts';

  let formError = {
    message: '',
    errors: [],
  };

  async function submitForm(event) {
    const formData = new FormData(event.target);
    const payload = {
      ...Object.fromEntries(formData),
      playersSelection: $playerStore.map((_) => _.id),
    };
    const response = await post('vote', payload);
    if (response.status >= 400 && response.status < 500) {
      const responseError = await response.json();
      formError = responseError;
    }
  }
</script>

<div class="container">
  <div class="recap">
    <h4>Your choices</h4>
    <div class="images">
      {#each $playerStore as player}
        <img src={player.photo} alt="{player.name}'s photo recap" width="60" />
      {/each}
    </div>
    <InlineNotification
      kind="info"
      title="Vote system:"
      subtitle="You can only fill out one full team per day (per day is defined as once every 24 hours)."
    />
  </div>
  {#if formError.errors.length > 0}
    <div class="errors">
      <InlineNotification
        kind="error"
        title={formError.message}
        subtitle={formError.errors.join(' ')}
      />
    </div>
  {/if}
  <Form on:submit={submitForm}>
    <FormGroup>
      <TextInput
        labelText="Email:"
        type="email"
        name="email"
        required
        placeholder="Enter your email"
      />
    </FormGroup>
    <FormGroup>
      <TextInput labelText="Name:" type="text" name="name" required placeholder="Enter you name" />
    </FormGroup>
    <div class="actions">
      <Button type="submit" icon={SendFilled20}>Submit</Button>
      <Button kind="ghost" href="/">Cancel</Button>
    </div>
  </Form>
</div>

<style>
  .container {
    min-height: 100vh;
    height: 100%;
    padding: 2em;
    width: 50vw;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
  }

  .images {
    margin-top: 10px;
  }

  .recap {
    margin-bottom: 30px;
  }

  .actions {
    text-align: center;
  }
</style>
