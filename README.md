# Timekeepers Demo

A basic generative AI application demonstrating the potential of time-bound NFTs.

## Setup

Copy `.env` and create your `.env.local` file, replacing placeholder values with actual values.

## Running

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## MongoDB

Provide the credentials in `.env.local`.
You can use a hosted service such as **MongoDB Atlas**:

````
MONGODB_HOST="HOST_ADDRESS"
MONGODB_PORT="27017"
MONGODB_DB="DB_NAME"
MONGODB_USERNAME="DB_USER"
MONGODB_PASSWORD="DB_PASSWORD"
MONGODB_URI="mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}"
````

Or a local MongoDB instance.
In order to access services that are exposed only locally on the remote server, you will need to open a tunnel.
In Windows, you can do this via:

````
ssh -N -L 127.0.0.1:28300:127.0.0.1:28300 -p SSH_PORT SSH_USER@SERVER_IP -i "C:\Users\name\.ssh\id_rsa_openssh"
````

Where:

* `-N`: Tells SSH not to execute any commands, just to establish the tunnel.
* `-L`: Specifies the local and remote port forwarding.
* `-p`: The SSH port on the remote server.

This command will create an SSH tunnel from your local machine (`127.0.0.1:28300`) to the remote MongoDB instance (`127.0.0.1:28300` on the remote machine).
It won't log you into the remote server, but the tunnel will remain active as long as the terminal session is running.
You can also use the `-f` flag to run the SSH session in the background.

## Resources

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
