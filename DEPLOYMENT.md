
# Deployment Guide for RCGC Application

This guide will help you build the application and deploy it to an Apache server.

## Prerequisites

- Node.js (v14.x or higher)
- NPM (v6.x or higher)
- Apache HTTP Server (v2.4 or higher)
- Git (optional, for cloning the repository)

## Step 1: Build the Application

1. Clone or download the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the production version:
   ```bash
   npm run build
   ```

   This will create a `dist` directory with the optimized production build.

## Step 2: Configure Apache Server

1. Install Apache HTTP Server (if not already installed):
   
   For Ubuntu/Debian:
   ```bash
   sudo apt update
   sudo apt install apache2
   ```

   For CentOS/RHEL:
   ```bash
   sudo yum install httpd
   ```

2. Enable required Apache modules:
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo systemctl restart apache2
   ```

3. Create a virtual host configuration:
   
   Create a file in `/etc/apache2/sites-available/` (e.g., `rcgcapp.conf`):
   
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       ServerAlias www.yourdomain.com
       DocumentRoot /var/www/html/rcgcapp

       <Directory /var/www/html/rcgcapp>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       ErrorLog ${APACHE_LOG_DIR}/rcgcapp-error.log
       CustomLog ${APACHE_LOG_DIR}/rcgcapp-access.log combined
   </VirtualHost>
   ```

4. Enable the site:
   ```bash
   sudo a2ensite rcgcapp.conf
   sudo systemctl reload apache2
   ```

## Step 3: Deploy the Application

1. Create the deployment directory:
   ```bash
   sudo mkdir -p /var/www/html/rcgcapp
   ```

2. Copy the build files to the deployment directory:
   ```bash
   sudo cp -r ./dist/* /var/www/html/rcgcapp/
   ```

3. Create a `.htaccess` file in the deployment directory:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   
   # Set correct MIME types
   AddType application/javascript .js
   AddType text/css .css

   # Set caching headers
   <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
     Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>
   ```

4. Set proper permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/html/rcgcapp
   sudo chmod -R 755 /var/www/html/rcgcapp
   ```

## Step 4: Final Configuration

1. If your application uses environment variables, you need to set them in the Apache configuration:

   Create a file `/etc/apache2/conf-available/env-vars.conf`:
   ```apache
   SetEnv VITE_API_URL "https://api.example.com"
   # Add other environment variables as needed
   ```

   Enable the configuration:
   ```bash
   sudo a2enconf env-vars.conf
   sudo systemctl reload apache2
   ```

2. Configure SSL (recommended):
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
   ```

## Step 5: Verify the Deployment

1. Open a web browser and navigate to your domain or server IP address.

2. Test all the features of the application to ensure everything works correctly.

3. Check the Apache error logs if you encounter any issues:
   ```bash
   sudo tail -f /var/log/apache2/rcgcapp-error.log
   ```

## Troubleshooting

### Common Issues:

1. **404 Not Found for routes**: Ensure the `.htaccess` file is properly configured and `mod_rewrite` is enabled.

2. **API calls not working**: Check CORS configuration on your API server and verify environment variables.

3. **Permission issues**: Make sure the Apache user has proper permissions to read the files.

4. **White screen with no errors**: Check the browser console for JavaScript errors and Apache error logs.

## Maintenance

1. **Updates**: To update the application:
   ```bash
   # Build the new version
   npm run build
   
   # Deploy the new build
   sudo cp -r ./dist/* /var/www/html/rcgcapp/
   ```

2. **Backups**: Regularly backup your data:
   ```bash
   sudo cp -r /var/www/html/rcgcapp /backup/rcgcapp-$(date +%Y%m%d)
   ```

3. **Monitoring**: Set up monitoring tools like New Relic or use built-in Apache tools to monitor server health.

## Additional Resources

- [Apache HTTP Server Documentation](https://httpd.apache.org/docs/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)
