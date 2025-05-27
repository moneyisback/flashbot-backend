module.exports = {
  apps: [
    {
      name: 'flashbot-scanner',
      script: 'scripts/scanner-multitoken-v2.ts', // ✅ TON VRAI FICHIER
      interpreter: 'npx',
      args: 'tsx',
      env: {
        NODE_ENV: 'production',
        DRY_RUN: 'false'
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true
    }
  ]
}
