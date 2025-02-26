# Deploying to Cloudflare Workers

This guide provides instructions for deploying the Marbles application to Cloudflare Workers, with a specific focus on ensuring WebSocket functionality works correctly.

## Prerequisites

1. A Cloudflare account
2. Cloudflare Workers subscription
3. Wrangler CLI installed (`npm install -g wrangler`)
4. Logged in to Wrangler (`wrangler login`)

## Configuration Files

The application includes several configuration files specifically for Cloudflare deployment:

1. `wrangler.toml` - Configuration for Cloudflare Workers deployment
2. Enhanced WebSocket utilities:
   - `app/utils/cloudflare-ws-adapter.ts` - WebSocket adapter optimized for Cloudflare
   - `app/composables/useCloudflareWebSocket.client.ts` - Vue composable using the adapter

## Deployment Steps

1. Build the application:

```bash
npm run build
```

2. Publish to Cloudflare Workers:

```bash
wrangler publish
```

## Troubleshooting WebSocket Connections

If you encounter WebSocket connection issues on Cloudflare:

1. **CORS Issues**: Check the CORS headers in the `nuxt.config.ts` file. Ensure they allow your domain.

2. **Connection Timeouts**: Cloudflare has a default timeout for idle WebSocket connections. The application is configured to send ping messages every 30 seconds to keep connections alive.

3. **Connection Errors**: Check browser console for specific error messages. Common issues include:
   - WebSocket connection attempts with incorrect protocol (ws vs wss)
   - Missing or misconfigured routes

4. **Worker Memory Limits**: If connections fail under load, you may need to increase the memory limit in your Cloudflare account settings.

5. **Debugging in Production**: The WebSocket adapter includes debug options. Set `debug: true` in the adapter options to see detailed logs.

## Worker Limits and Considerations

Cloudflare Workers have certain limitations to be aware of:

1. **Connection Duration**: WebSocket connections on the free plan are limited to a few minutes. Use the reconnection logic built into the adapter.

2. **CPU Time**: Workers have limits on CPU time. Minimize processing in WebSocket handlers.

3. **Memory**: Workers have memory limits (default is 128MB). Complex operations may fail if they exceed memory limits.

4. **Rate Limits**: There are limits on how many requests/connections you can make.

## Notes on WebSocket Implementation

The application uses a custom WebSocket implementation with:

1. **Auto-reconnection**: Automatically attempts to reconnect if the connection drops.

2. **Connection health monitoring**: Sends regular ping messages to keep connections alive.

3. **Error handling**: Properly handles connection errors and provides detailed logging.

4. **Buffering**: Messages attempted to be sent while disconnected will be sent once reconnected.

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [WebSockets in Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/websockets/)
