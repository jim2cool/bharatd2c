---
description: how to deploy to the live Hetzner server
---
// turbo-all

1. Commit and push to `main`:
```
git add .
git commit -m "your message"
git push origin main
```

2. SSH into server, pull, build, restart:
```
ssh root@46.225.117.86 "cd /root/bharatd2c && git pull origin main && NODE_OPTIONS='--max-old-space-size=3072' npx next build && pm2 restart all && echo 'DEPLOY_SUCCESS'"
```

**Notes:**
- Server IP: `46.225.117.86`
- App path: `/root/bharatd2c`
- Process manager: PM2
- Reverse proxy: Caddy (auto SSL)
- 2GB swap file at `/swapfile` (added to prevent OOM during builds)
- Use `build:skip-checks` instead of `build` if bundle size check is failing
