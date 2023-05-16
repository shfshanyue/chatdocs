import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import solidJs from '@astrojs/solid-js'

import node from '@astrojs/node'
import { VitePWA } from 'vite-plugin-pwa'
import vercel from '@astrojs/vercel/edge'
import netlify from '@astrojs/netlify/edge-functions'
import disableBlocks from './plugins/disableBlocks'

const envAdapter = () => {
  if (process.env.OUTPUT === 'vercel') {
    return vercel()
  } else if (process.env.OUTPUT === 'netlify') {
    return netlify()
  } else {
    return node({
      mode: 'standalone',
    })
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    unocss(),
    solidJs(),
  ],
  output: 'static',
  adapter: envAdapter(),
  vite: {
    plugins: [
      process.env.OUTPUT === 'vercel' && disableBlocks(),
      process.env.OUTPUT === 'netlify' && disableBlocks('netlify'),
      process.env.OUTPUT !== 'netlify' && VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: '中国法律助手',
          short_name: '中国法律助手',
          description: '基于 PDF/Markdown/Docx/Txt 等任意文件格式的智能知识库 AI 机器人',
          theme_color: '#212129',
          background_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'icon.svg',
              sizes: '32x32',
              type: 'image/svg',
              purpose: 'any maskable',
            },
          ],
        },
        client: {
          installPrompt: true,
          periodicSyncForUpdates: 20,
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
  },
})
