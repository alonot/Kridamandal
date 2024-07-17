/** @type {import('@sveltejs/kit').Config}*/

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import node from '@sveltejs/adapter-node'

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: node()
  }
}

export default config
