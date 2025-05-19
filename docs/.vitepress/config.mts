import { defineConfig } from 'vitepress'
import withMagic from './with-magic';

// https://vitepress.dev/reference/site-config
export default withMagic(defineConfig({
  title: "example-deno-server",
  srcDir: "./src",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Sarina&display=swap', rel: 'stylesheet' }
    ]
  ]
}))
