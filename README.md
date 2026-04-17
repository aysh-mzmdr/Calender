Calendar application for seamless daily tracking, custom color highlighting, and personal note-taking.

## Requirements
- [Node.js](https://nodejs.org/)

## First-time setup
A `.env` file is required at the repo root. `run.bat` creates it automatically from `.env.example` on first run.

If ports `3000` (server) or `5173` (client) are already in use on your system, edit `.env` before starting:

```
SERVER_PORT = 3000
CLIENT_PORT = 5173

VITE_SERVER_PORT = 3000   <- must match SERVER_PORT
```

## How to start
1. Run `setup.bat` for the initial setup.
2. Run `run.bat`
3. Open the URL printed in the terminal (default: http://localhost:5173/) 

## How to use
- Click on a date to open the editor
- Choose a highlight color
- Add a note
- Click **Save Changes**

To delete a date's data, click the date and click **Delete**
