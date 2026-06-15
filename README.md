# Shipping Amazia - DuckDB Backup Service

Automated DuckDB database backup system with Google Drive integration.

## Features

* Automatic discovery of all `.duckdb` files
* Google Drive backup using OAuth2 authentication
* Multiple database support
* Automatic retention cleanup
* Scheduled backups using `node-cron`
* Retry mechanism for upload failures
---

# Architecture

```text
DuckDB Files
     │
     ▼
Backup Service
     │
     ▼
Google Drive Upload
     │
     ▼
Cleanup Service
     │
     ▼
Retention Policy
```

Example source databases:

```text
shipping-webapp/data
├── shipping_ops.duckdb
└── zoho_service.duckdb
```

Generated backups:

```text
shipping_ops_2026-06-15_13-11-01.duckdb
zoho_service_2026-06-15_13-11-04.duckdb
```

Stored inside the configured Google Drive folder.

# Project Structure

```text
shipping-amazia-sync/
│
├── credentials/
│   ├── oauth-client.json
│   └── token.json
│
├── src/
│   ├── auth/
│   │   └── generateToken.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   ├── jobs/
│   │   └── backupJob.js
│   │
│   ├── scheduler/
│   │   └── cron.js
│   │
│   ├── services/
│   │   ├── backupService.js
│   │   ├── cleanupService.js
│   │   └── googleDrive.js
│   │
│   ├── utils/
│   │   ├── date.js
│   │   └── retry.js
│   │
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd shipping-amazia-sync
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# Google Cloud Setup

## Step 1 - Create Google Cloud Project

Open:

```text
https://console.cloud.google.com
```

Create a new project.

---

## Step 2 - Enable Google Drive API

Navigate to:

```text
APIs & Services
    └── Library
          └── Google Drive API
                 └── Enable
```

---

## Step 3 - Configure OAuth Consent Screen

Navigate to:

```text
Google Auth Platform
    └── Branding
```

Configure:

* Application Name
* Support Email
* Developer Email

Save changes.

---

## Step 4 - Create OAuth Client

Navigate to:

```text
Google Auth Platform
    └── Clients
           └── Create Client
```

Choose:

```text
Desktop Application
```

Download the credentials file.

Save it as:

```text
credentials/oauth-client.json
```

---

# Generate OAuth Token

Run:

```bash
node src/auth/generateToken.js
```

A browser window will open.

1. Login with your Google account.
2. Grant requested permissions.
3. Copy the authorization code.
4. Paste the code into the terminal.

A token file will be created:

```text
credentials/token.json
```

---

# Google Drive Folder Setup

Create a folder in Google Drive:

```text
Shipping-Backups
```

Copy the folder ID.

Example URL:

```text
https://drive.google.com/drive/folders/1RWnUp8DrQVm1W0zQ_cAb1wuRWw2k4jKY
```

Folder ID:

```text
1RWnUp8DrQVm1W0zQ_cAb1wuRWw2k4jKY
```

---

# Environment Configuration

Create a `.env` file in the project root.

Example:

```env
DUCKDB_FOLDER=C:/Users/Magiprop/Desktop/shipping-webapp/data

GOOGLE_DRIVE_FOLDER_ID=1RWnUp8DrQVm1W0zQ_cAb1wuRWw2k4jKY

TIMEZONE=Asia/Kolkata

BACKUP_RETENTION_DAYS=7
```

---

# Running the Application

Start the backup service:

```bash
npm start
```

Expected output:

```text
Shipping Backup Service Started

Starting Backup Job

Uploading shipping_ops...
Uploading zoho_service...

Backup Completed

Scheduler Started
Timezone: Asia/Kolkata
```

---

# Backup Schedule

The application uses `node-cron`.

Current schedule:

```cron
0 */3 * * *
```

Meaning:

```text
00:00
03:00
06:00
09:00
12:00
15:00
18:00
21:00
```

Timezone:

```text
Asia/Kolkata
```

---

# Retention Policy

Retention is controlled through:

```env
BACKUP_RETENTION_DAYS=7
```

Backups older than the configured number of days are automatically deleted from Google Drive.

---

# Backup Workflow

```text
Application Starts
       │
       ▼
Immediate Backup
       │
       ▼
Upload All DuckDB Files
       │
       ▼
Cleanup Old Backups
       │
       ▼
Scheduler Starts
       │
       ▼
Runs Every 3 Hours
```

---
