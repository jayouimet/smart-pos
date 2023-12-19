# projet-dev-sys-info
 
## Prerequesites
Docker
Yarn
Hasura CLI
Node.JS

## Setup

Create a file named `.env.dev` at the root of the folder and copy and paste the content of `.env.exemple` in the same folder into it.
Replace `YOUR_NEXT_AUTH_SECRET` with a chain of characters that will be used for encoding your JWT.

Create a file named `.env.local` at the root of the folder and copy and paste the content of `.env.exemple` in the same folder into it.
Replace `YOUR_NEXT_AUTH_SECRET` with a chain of characters that will be used for encoding your JWT. 
This must be the same chain of characters as the one in the last file.

Run `yarn` in the `web` folder to install dependencies.

Run `docker-compose up --build` at the root of the repository to start the docker container.

Run the following commands in the hasura folder to initialize the db: 
`hasura metadata apply`
`hasura migrate apply`
`hasura metadata reload`
`hasura seed apply`
`hasura console`

Run `yarn dev` in the web folder.

The app should now run at `http://localhost:3000`.
