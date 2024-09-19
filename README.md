# files
A simple web server that serves files from a directory.

## Set up
Run `npm install`

### SSL Certificate Setup (for production)

To serve the application over HTTPS in production, follow these steps to generate and auto-renew a Let's Encrypt SSL certificate using Certbot on macOS:

1. Install Homebrew if you haven't already:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Certbot using Homebrew:
   ```
   brew install certbot
   ```

3. Generate the SSL certificate:
   ```
   sudo certbot certonly --standalone -d yourdomain.com
   ```
   Replace `yourdomain.com` with your actual domain name. You may need to temporarily stop any web servers running on port 80.

4. Set up auto-renewal:
   ```
   echo "0 0,12 * * * root /usr/local/bin/certbot renew --quiet" | sudo tee -a /etc/crontab > /dev/null
   ```
   This sets up a cron job to attempt renewal twice a day.

5. Update your `.env` file with the paths to your new SSL certificate:
   ```
   SSL_PRIVATE_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
   SSL_CERTIFICATE_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
   HTTPS_PORT=443
   HTTP_PORT=80
   ```
   Replace `yourdomain.com` with your actual domain name.

6. Ensure your Node.js application has permission to read these files. You may need to adjust file permissions:
   ```
   sudo chmod -R 755 /etc/letsencrypt/live/yourdomain.com
   sudo chmod -R 755 /etc/letsencrypt/archive/yourdomain.com
   ```

Note: macOS may reset permissions on system directories after updates. If you encounter permission issues after a system update, you may need to reapply the permissions.

With these steps completed, your application will serve HTTPS traffic on port 443 and redirect HTTP traffic from port 80 to HTTPS when in production mode.

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
