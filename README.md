# Yang's World

A scroll-driven 3D hallway built with React Three Fiber. You walk down a
cobalt-blue colored-pencil corridor, and every door opens into a photo room you
can fill with your own pictures and name them.

- **Live site:** https://aprilwangbiz-jpg.github.io/yangsworld/
- **Repo:** https://github.com/aprilwangbiz-jpg/yangsworld

Not affiliated with itomdev.com or Tomasz Szmajda.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`), or double-click
`run_dev.bat` on Windows to start the server and open the browser.
`npm run build` makes a static production build; `npm run preview` serves it.

Photos are stored in Supabase, so the same albums show up locally and on the
shared site. Without `.env.local` the hallway still works but the rooms can't
load photos. First-time setup is in [Sharing it online](#sharing-it-online).

## The hallway (home page)

Scroll to walk forward; move the mouse for a little side-to-side parallax.

- **Look** — flat cobalt-blue walls, floor and ceiling with blue pencil strokes,
  about 210 twinkling four-point stars in cream, yellow and pale green, and big
  glowing cream skylights in thin navy frames.
- **Entrance** — a "YANG'S WORLD" title above a transparent cutout of a lady in
  a sun hat, with a few floating doodles (yellow mug, red pencil, stars).
- **Six room doors** along the side walls. Each is a pointed-arch leaf door
  (rebuilt in 3D from `leaf-door.html`): the stained-glass leaf painting, a gold
  frame, a center seam and two gold knobs. The room name floats above in
  bright yellow letters. Hovering opens the door a crack; clicking swings it
  open onto a warm golden glow and enters the room.
- **Five gates across the hallway** (I–V) past the room doors. Each is a blue
  wall with a big leaf door that swings open as you walk up and closes again if
  you scroll back.

| Door | Side | Album id |
|---|---|---|
| **GARDEN** | left | `garden` |
| **ABOUT** | right | `about` |
| **FAMILY** | left | `family` |
| **PORTFOLIO** | right | `portfolio` |
| **TRAVEL** | left | `travel` |
| **FRIENDS** | right | `friends` |

## Photo rooms

Every door opens the same balcony-and-clothesline room, each with its own album.
Anyone with the link can look; adding and naming photos needs the shared
password.

- **🔒 Unlock uploads** (top right) asks for the password once; the browser
  stays unlocked after that.
- **+ Add photos** uploads up to 10 pictures at a time (JPG, PNG, WebP or GIF).
  Photos are shrunk to 2000px on the long side before upload to save space.
  They hang on the clothesline.
- **Click a photo** to see it full-size. When unlocked, type in the **Name**
  box and press **Save**; the name shows under the photo on the line. New
  uploads start out named after their original filename.
- **‹** (top left) goes back to the hallway.

### Who can do what

| | Anyone with the link | With the shared password |
|---|---|---|
| Walk the hallway, open every room | ✓ | ✓ |
| See photos and their names | ✓ | ✓ |
| Add photos (any of the six rooms) | — | ✓ |
| Rename photos (any room) | — | ✓ |
| Delete photos | — | — (Supabase dashboard only) |

The password isn't tied to a room: whoever has it can add to and rename in all
six. Limiting someone to certain rooms would need separate logins.

### Devices

Works in current Safari, Chrome, Edge and Firefox on Mac, Windows, iPhone, iPad
and Android — nothing to install. Notes:

- **iPhone / iPad:** picking from the photo library works (iOS hands the site a
  JPEG copy).
- **Mac:** `.HEIC` files chosen straight from Finder aren't accepted; pick from
  the Photos app or export as JPEG first.
- The layout has been tested on desktop screens; check it on a phone before
  relying on it there.

## Where to change things

| To change… | Edit |
|---|---|
| Room names, or add/remove a room | `src/data/rooms.js` (and its spot in `DOOR_PLACEMENTS` in `src/scenes/Corridor.jsx`) |
| Hallway colors, including the door-name yellow (`signYellow`, from `yellow.webp`) | `src/three/homePalette.js` |
| Title text | `src/scenes/EntryLogo.jsx` |
| Entrance picture | replace `public/images/lady.webp` (transparent background); size/height via `PICTURE_HEIGHT` / `PICTURE_LIFT` in `src/scenes/EntryPicture.jsx` |
| Door painting | replace `public/images/leaf-door.webp` (600 : 1100 proportions) |
| Door shape, frame, knobs, glow | `src/scenes/LeafDoor.jsx` |
| Room-door size and hover/open angles | `src/scenes/Door.jsx` |
| Gate door size, positions, opening distance | `src/scenes/WallGate.jsx`, `GATE_POSITIONS` in `src/scenes/Corridor.jsx` |
| Number of stars | `count` in `src/scenes/Twinkles.jsx` |
| Skylight size and frame thickness | `SKYLIGHT_WIDTH` / `SKYLIGHT_DEPTH` / `MULLION` in `src/scenes/CorridorEnvironment.jsx` |

## How photos are stored

There's no server of our own: the browser talks straight to
[Supabase](https://supabase.com) (free tier: 1 GB of files).

- Image files go in the public storage bucket `photos`, under `<album>/<random id>.webp`.
- The table `photos` holds one row per picture: album, file path, name.
- Rules in `supabase/setup.sql`: anyone can view; only the signed-in shared
  uploader account can add photos or change names. The password is checked by
  Supabase, not by the site, so it never appears in the code.
- Deleting a photo isn't in the site yet; do it in Supabase (Table Editor →
  `photos` → delete the row, and Storage → `photos` → delete the file).

`src/lib/supabase.js` (connection), `src/hooks/useFamilyPhotos.js` (list /
upload / rename), `src/hooks/useUploader.js` (password unlock).

Photos uploaded before Supabase are in `local-photos-backup/` (not uploaded to
GitHub); re-add them through the site if you want them online.

## Upkeep

- **Publishing changes:** commit and push to `main`; GitHub Actions rebuilds and
  republishes in 1–2 minutes (Actions tab shows progress).
- **Supabase pauses after ~1 week without visits** on the free plan. Photos are
  kept; open the project in the Supabase dashboard and click **Restore**.
- **Changing the shared password:** Supabase → Authentication → Users → delete
  the uploader user, then *Add user* again with the **same email** and the new
  password (*Auto Confirm User* on). Browsers that were unlocked get signed out
  when their session expires; tell people the new password.
- **Deleting a photo:** Supabase → Table Editor → `photos` → delete the row, and
  Storage → `photos` → delete its file.
- **Storage use:** Supabase → Storage shows how much of the free 1 GB is used.
- **Running from a copy of the folder** (instead of the link) needs Node.js,
  `npm install`, and a `.env.local` with the Supabase values — the link is
  simpler for anyone else.

## Sharing it online

The site is hosted free on **GitHub Pages**; photos live in **Supabase**. One-time setup:

1. **Supabase** — create a free account and a project at supabase.com.
   - SQL Editor → New query → paste all of `supabase/setup.sql` → Run.
   - Authentication → Users → Add user → *Create new user*: an email (any
     address you control) and the **shared password**, with *Auto Confirm User* on.
   - Project Settings → copy the **Project URL** and the **anon / publishable key**.
2. **Local** — put those values and the uploader email in `.env.local`
   (see `.env.example`) and check uploads work with `npm run dev`.
3. **GitHub** — create a new **public** repository (free Pages needs public),
   then push this folder to it. (Done: `aprilwangbiz-jpg/yangsworld`.)
   - Settings → Secrets and variables → Actions → **Variables**: add
     `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_UPLOADER_EMAIL`.
   - Settings → Pages → Source: **GitHub Actions**.
   - Every push to `main` rebuilds and publishes via
     `.github/workflows/deploy.yml`. The site appears at
     `https://<your-username>.github.io/<repo-name>/` — here
     https://aprilwangbiz-jpg.github.io/yangsworld/.
4. **Share** the link, and give the password only to people who should upload.

What's public: the code and artwork (the repo is public) and every photo (anyone
with the link can view). What's protected: adding and renaming photos.

## How to contribute

Want to change the site (colors, doors, text, rooms)? Changes go through a
pull request, and April reviews and merges them. Merging to `main` publishes
the live site automatically.

### 1. Get a copy

- **Collaborator** (April added you under Settings → Collaborators): clone this
  repo directly.
- **Anyone else:** click **Fork** at the top of the repo page, then clone your fork.

```bash
git clone https://github.com/aprilwangbiz-jpg/yangsworld.git   # or your fork's URL
cd yangsworld
```

### 2. Set up (one time)

1. Install **Node.js 20 LTS** or newer from https://nodejs.org.
2. Install packages: `npm install`
3. Create a file called `.env.local` in the project folder (copy `.env.example`)
   with these values:

   ```
   VITE_SUPABASE_URL=https://sjlwhwtpfaspaaegnzvb.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_rWYxZ3wQeIylfOBHnNQtlA_HhGK__MA
   VITE_UPLOADER_EMAIL=<ask April>
   ```

   The URL and key are public (they're in the live site too); the email is
   only needed to test uploads. Never commit `.env.local` — it's gitignored.

### 3. Make a change and preview it

```bash
git checkout -b my-change        # a branch for your change
npm run dev                      # open the printed http://localhost:5173
```

(On Windows you can double-click `run_dev.bat` instead.) The page reloads as
you save files. See [Where to change things](#where-to-change-things) for which
file controls what. Run `npm run build` once before sending to make sure it
still builds.

> **Heads-up:** your local copy uses the **real** photo albums. Anything you
> upload or rename while testing shows up on the live site for everyone. Only
> test uploads you're happy to keep, or ask April to delete them afterwards.

### 4. Send it for review

```bash
git add -A
git commit -m "feat: short description of the change"
git push -u origin my-change
```

Then open the repo on GitHub and click **Compare & pull request**. Describe what
you changed (a screenshot helps for visual changes). Once April merges it, the
live site updates within a couple of minutes.

Commit messages use the form `type: description`, where type is `feat`, `fix`,
`docs`, `refactor`, `style` or `chore`.

## Project structure

```
src/
├── App.jsx            # hallway, or the photo room for the chosen door
├── pages/             # HomePage (hallway) + FamilyPage (photo room)
├── scenes/            # 3D pieces: Corridor, CorridorEnvironment, LeafDoor, Door,
│                      #   WallGate, Twinkles, EntryLogo/EntryPicture, Doodles,
│                      #   and the photo-room gallery pieces
├── three/             # homePalette, canvas-texture generators, clothesline math
├── hooks/             # useFamilyPhotos (list / upload / rename), useUploader (password)
├── data/              # rooms.js — door labels + album ids
├── lib/               # supabase.js (connection), resizeImage.js
└── styles/            # design tokens + global CSS
public/images/         # lady.webp (entrance), leaf-door.webp (door painting)
supabase/setup.sql     # one-time database + storage + access rules
.github/workflows/     # deploy.yml — build and publish to GitHub Pages
```

Source files kept in the project root for reference: `leaf-door.html` (door
design), `lady-no-bg.png` (entrance picture), `yellow.webp` (name color).

## Artwork

The leaf painting and the lady illustration come from saved images (watermarks
cropped). The shared site and its public repo make them publicly visible —
check you have the rights, credit the artists, or swap in your own art.

## Stack

React 18, Vite, Three.js via `@react-three/fiber` + `@react-three/drei`,
Supabase (`@supabase/supabase-js`) for photo storage, GitHub Pages for hosting.
