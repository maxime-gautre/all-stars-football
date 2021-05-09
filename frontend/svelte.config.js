import preprocess from 'svelte-preprocess';
import nodeAdapter from '@sveltejs/adapter-node';
import * as carbonPreprocess from 'carbon-components-svelte/preprocess/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), carbonPreprocess.optimizeCarbonImports()],

  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: nodeAdapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    vite: {
      optimizeDeps: {
        include: ['carbon-components-svelte', 'clipboard-copy'],
      },
    },
  },
};

export default config;
