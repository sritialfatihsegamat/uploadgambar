# Photobooth SRITI Al-Fatih 2026

Guests open one link, pick a colour and a frame, take a photo, and the photo goes to your Google Drive folder.

## Part 1 – Connect Google Drive (about 5 minutes)
1. Open https://script.google.com and sign in with the Google account that owns the Drive folder.
2. Click **New project**. Delete everything in the editor.
3. Open the file `Code.gs` from this folder, copy all the text, and paste it into the editor. Click the save icon.
4. Click **Deploy** → **New deployment**. Click the gear icon and choose **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
6. Google asks for permission. Click **Authorize access**, choose your account. If you see "Google hasn't verified this app", click **Advanced** → **Go to project (unsafe)** → **Allow**. This is normal because you made the script yourself.
7. Copy the **Web app URL**. It ends with `/exec`.
8. Open `config.js` with Notepad. Replace `PASTE_LINK_EXEC_DI_SINI` with the URL. Keep the quote marks. Save.

If you ever change `Code.gs`, click **Deploy** → **Manage deployments** → pencil → **New version** → **Deploy**.

## Part 2 – Put it online with GitHub Pages (free)
1. Create a free account at https://github.com.
2. Click **+** → **New repository**. Name it `photobooth`, choose **Public**, click **Create repository**.
3. Click **uploading an existing file**. Open this folder on your computer, select everything inside (including the `frames` and `icons` folders) and drag it into the page. Click **Commit changes**.
4. Go to **Settings** → **Pages**. Under **Branch**, choose **main** and **/ (root)**. Click **Save**.
5. Wait 1–2 minutes. Your link is `https://YOUR-USERNAME.github.io/photobooth/`. Share this link (or make a QR code).

## Part 3 – Install on phones
- **Android / Windows (Chrome or Edge):** open the link, tap **Pasang Aplikasi**.
- **iPhone (Safari only):** open the link, tap the Share button, choose **Add to Home Screen**.
- Open the link once with internet first. After that the app works offline.

## Offline
Without internet, photos stay safely on the phone. They upload by themselves when the internet is back. The message on screen tells you: saving, saved, or waiting.

## Tips
- File names look like `SRITIALFATIH2026_hijau_potret_20261126_113555.jpg`.
- The Zoom slider starts in the middle = photo fills the window. Slide left to see the whole picture, slide right to zoom in.
- If you change any file later and phones still show the old version, change `sriti-v1` to `sriti-v2` in `sw.js` and upload again.
- To use your own frame art, replace the 4 PNG files in `frames` (same file names). The photo window must be fully transparent. Tell me if the window position changes.
