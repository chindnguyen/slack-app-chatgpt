module.exports = {
  apps: [
    {
      name: 'slack-bot',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};