# Timekeepers Client

A basic generative AI application demonstrating the potential of time-bound NFTs.
The TK client is responsible for rendering the UX, displaying the NFTs and enabling web3 functionality.

## Architecture

* [**TK Server**](https://github.com/Agent009/timekeepers-server) - back-end functionality, crons, CRUD API, AI.
* [**TK Client**](https://github.com/Agent009/timekeepers-client) (this) - front-end UX, web3 DApp, countdown timers.
* **TK Agents** - in development. Complicated multi-step and multi-tool workflows such as agnent orchestration (e.g. generating videos).

### Data Structure

* **Layers** organise **epochs** into context-specific domains, such as world news or user-controlled applications such as a board game stream.
* **Epochs** represent units of time such as a *minute*, *hour*, *day*, *month* and *year*.
* **News** records store world news for the default system-defined **World News** layer. The news articles are categorised, and then summarised to generate epoch-specific NFTs.

## Setup

Copy `.env` and create your `.env.local` file, replacing placeholder values with actual values.

### TK Server

The client app relies on the server app for carrying out various CRUD operations.
Ensure that you have the server up and running, and that you have set the `TKS_SERVER_HOST`, `TKS_SERVER_PORT` and `NEXT_PUBLIC_TKS_SERVER_URL` environment variables properly.

### NextAuth

The app uses [NextAuth](https://next-auth.js.org/), so you must correctly set the `NEXTAUTH_URL` environment variable.

## MongoDB

Provide the credentials in `.env.local`.
You can use a hosted service such as **MongoDB Atlas**:

```bash
MONGODB_HOST="HOST_ADDRESS"
MONGODB_PORT="27017"
MONGODB_DB="DB_NAME"
MONGODB_USERNAME="DB_USER"
MONGODB_PASSWORD="DB_PASSWORD"
MONGODB_URI="mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}"
```

Or a local MongoDB instance.
In order to access services that are exposed only locally on the remote server, you will need to open a tunnel.
In Windows, you can do this via:

```bash
ssh -N -L 127.0.0.1:28300:127.0.0.1:28300 -p SSH_PORT SSH_USER@SERVER_IP -i "C:\Users\name\.ssh\id_rsa_openssh"
```

Where:

* `-N`: Tells SSH not to execute any commands, just to establish the tunnel.
* `-L`: Specifies the local and remote port forwarding.
* `-p`: The SSH port on the remote server.

This command will create an SSH tunnel from your local machine (`127.0.0.1:28300`) to the remote MongoDB instance (`127.0.0.1:28300` on the remote machine).
It won't log you into the remote server, but the tunnel will remain active as long as the terminal session is running.
You can also use the `-f` flag to run the SSH session in the background.

## Running

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Roadmap

* Refactor CRUD logic from client to server
* Remove all MongoDB interaction from the client. This should solely happen in the server.
* Reduce timer-based `useEffect`s from client, and convert these into crons on the server.
* Add web socket functionality for a more robust PubSub instead of relying on refreshing data every x seconds.
* Relocate **Livepeer** functionality from client to server.
* Add **Story Protocol** integration.
* Add **Zora Protocol** integration.