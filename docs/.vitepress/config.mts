import { defineConfig } from 'vitepress'
import withMagic from './with-magic';

// https://vitepress.dev/reference/site-config
export default withMagic(defineConfig({
  title: "example-deno-server",
  srcDir: "./src",
  base: "/example-deno-server/",
  cleanUrls: true,
  sitemap: {
    hostname: "https://socle-commun.github.io/example-deno-server"
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/logo-light.svg",
      dark: "/logo-dark.svg"
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/socle-commun/example-deno-server" }
    ]
  },
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
