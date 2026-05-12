# Deploying Laravel Backend to Hostinger

## Prerequisites
- Hostinger Business or Cloud plan (PHP 8.2+, MySQL)
- SSH access enabled on your Hostinger account
- A domain or subdomain pointed to your hosting (e.g. `api.yourdomain.com`)

---

## Step 1 — Upload Files

Upload **all backend files** (everything EXCEPT the `frontend/` folder) to Hostinger.

You can use:
- **Hostinger File Manager** (hPanel > File Manager)
- **FTP** (FileZilla or similar)
- **Git** via SSH:  `git clone https://github.com/your-repo.git`

> The root `.htaccess` already redirects all traffic to the `public/` folder — this is required for shared hosting.

---

## Step 2 — Create MySQL Database

1. In hPanel → go to **Databases > MySQL Databases**
2. Create a new database, user, and password
3. Note down: `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

---

## Step 3 — Configure Environment

1. Copy `.env.example` to `.env`
2. Fill in your values:

```env
APP_NAME="Homzen Real Estate"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

CMS_ENABLE_INSTALLER=false
FORCE_SCHEMA=https
FORCE_ROOT_URL=https://api.yourdomain.com
```

---

## Step 4 — Install Dependencies via SSH

```bash
cd ~/domains/api.yourdomain.com/public_html
composer install --no-dev --optimize-autoloader
```

---

## Step 5 — Generate App Key

```bash
php artisan key:generate
```

---

## Step 6 — Run Migrations & Seed Data

```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## Step 7 — Storage & Cache

```bash
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Step 8 — Enable API

In hPanel or via artisan tinker, make sure the API is enabled:

```bash
php artisan tinker
>>> DB::table('settings')->updateOrInsert(['key' => 'api_enabled'], ['value' => '1']);
```

---

## Step 9 — Point Your Frontend to the Backend

In your **frontend** project, set the environment variable:

```env
VITE_API_URL=https://api.yourdomain.com
```

Then build the frontend:

```bash
cd frontend
npm install
npm run build
```

---

## API Base URL

Once deployed, your API will be available at:

```
https://api.yourdomain.com/api/v1/
```

Refer to `API_DOCS.md` for the full list of endpoints.

---

## CORS

The API already has `Access-Control-Allow-Origin: *` configured.  
If you want to restrict it to your frontend domain only, add to `.env`:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

Then update `config/cors.php` → `allowed_origins` to use `env('FRONTEND_URL')`.
