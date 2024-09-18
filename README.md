# files
A simple web server that serves files from a directory.

## Set up
Run `npm install`

Add Greenlock sites to the `greenlock.d` directory.
`npx greenlock add --subject example.com --altnames example.com`

## Run locally
1. Make sure `NODE_ENV` is set to `development` in the .env file.
2. Run `npm start`
3. Access it at `http://localhost:8100/`

## Run in production
1. Make sure `NODE_ENV` is set to `production` in the .env file.
2. Run `npm start`
3. Access it at the domain you've set up with Greenlock.

## Usage
Add files to the public directory and they'll be served at the root of the server.
