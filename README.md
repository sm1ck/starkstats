# starkstats

Collects StarkNet stats and presents them in graphs, there is also an option to check your addresses.

## Deployed service

There is a working version at https://starkstats.xyz.

Check your addresses: https://starkstats.xyz/batchcheck

## Structure

### client

The client is made in React + TypeScript, typing is not done everywhere. The react-router-dom is used for routing.

### server

Server is made on Express + TypeScript, server stores data in MongoDB, also stores data in cache for quick access and gives it via api.

### parser

Aggregates data from localhost GraphQL (https://github.com/dipdup-io/starknet-indexer) into mongodb.

### shared

Package with reused functions, classes.

### docker-compose

Deployment is done via docker-compose, containers for server and database are used. It is also possible to proxy the server to the network via nginx and use SSL certificates.

### Author

Telegram: @JanSergeev · Maintainer contact: [t.me/haruto_j](https://t.me/haruto_j)

---

## Other Projects by Maintainer

Maintained by [@sm1ck](https://github.com/sm1ck):

- **[HoneyChat](https://honeychat.bot)** — AI companion platform ([GitHub](https://github.com/sm1ck/honeychat) · [@HoneyChatAIBot](https://t.me/HoneyChatAIBot))
- [layerzero-aptos](https://github.com/sm1ck/layerzero-aptos) · [snapshotvoter](https://github.com/sm1ck/snapshotvoter) · [TestnetBridge](https://github.com/sm1ck/TestnetBridge)
