# NovaMeet

NovaMeet is a full-stack video conferencing web application inspired by the core
functionality of platforms like Zoom and Google Meet, built with an original
brand, UI, and component system. It supports real-time HD video/audio calls,
screen sharing, in-meeting chat, raise hand, host controls, and full meeting
lifecycle management (create, schedule, join, end, history).

---

## 1. Features

- **Authentication** — JWT-based register/login, hashed passwords (bcryptjs), protected routes, persisted sessions
- **Dashboard** — greeting header, quick actions, live stats (upcoming meetings, total meetings, meetings this week, minutes used)
- **Meetings** — instant meetings, scheduled meetings, unique meeting IDs (`NOVA-482-913`), optional password protection, optional waiting room flag
- **Meeting Room**
  - Real WebRTC peer-to-peer video/audio (mesh topology) signaled over Socket.IO
  - Camera on/off (shows initials avatar when off)
  - Microphone mute/unmute
  - Screen sharing (`getDisplayMedia`, automatic track replacement, reverts to camera when stopped)
  - Live participant grid with speaking/mic/camera indicators
  - In-meeting real-time chat
  - Raise hand (visible to all, tracked for host)
  - Host controls: mute participant, remove participant, end meeting for all, lock meeting
- **Meeting History** — past meetings with duration, host, and status
- **Profile & Settings** — edit name, change password, light/dark/system theme (persisted)
- **Responsive design** — desktop, tablet, and mobile, including a mobile meeting layout (drawer chat/participants, compact controls)
- **Accessibility** — ARIA labels, visible focus states, semantic HTML, keyboard-operable controls

---

## 2. Technology Stack

**Frontend:** React, Vite, JavaScript (no TypeScript), Tailwind CSS, React Router DOM, Axios, React Icons, Socket.IO Client, native WebRTC APIs

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Socket.IO, CORS, dotenv, Helmet, Morgan

**Real-time:** Socket.IO for signaling (offer/answer/ICE relay + chat + presence), native `RTCPeerConnection` for actual media transport

---

## 3. Folder Structure

```
novameet/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, ThemeContext, MeetingContext
│   │   ├── hooks/          # useAuth, useMeeting, useWebRTC, useSocket, useTheme
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # Axios API layer
│   │   ├── utils/          # Formatting & helper utilities
│   │   ├── App.jsx         # Route definitions
│   │   ├── main.jsx        # Single BrowserRouter + provider tree
│   │   └── index.css       # Design system (CSS variables, components)
│   ├── .env.example
│   └── package.json
│
├── server/                 # Express + MongoDB backend
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # auth (JWT), errorHandler, notFound
│   ├── models/             # User, Meeting, MeetingParticipant (Mongoose)
│   ├── routes/             # authRoutes, meetingRoutes, userRoutes
│   ├── socket/meetingSocket.js  # Socket.IO signaling server
│   ├── utils/               # generateToken, generateMeetingId
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 4. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - A local MongoDB instance (`mongodb://localhost:27017/novameet`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended)

---

## 5. Installation

Clone or copy the `novameet/` folder, then install both apps:

```bash
# Backend
cd novameet/server
npm install

# Frontend (in a new terminal)
cd novameet/client
npm install
```

---

## 6. Environment Setup

### 6.1 Backend — `server/.env`

Copy `server/.env.example` to `server/.env` and fill in real values:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

- `MONGO_URI` — your MongoDB connection string (Atlas or local)
- `JWT_SECRET` — a long, random string (never commit this or reuse a weak value)
- `CLIENT_URL` — must match the URL your frontend runs on, used for CORS

### 6.2 Frontend — `client/.env`

Copy `client/.env.example` to `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Never commit real credentials. Both `.env` files are already covered by `.gitignore`.

---

## 7. MongoDB Setup

**Option A — MongoDB Atlas (recommended):**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow your IP (or `0.0.0.0/0` for local dev)
3. Copy the connection string into `server/.env` as `MONGO_URI`

**Option B — Local MongoDB:**
1. Install MongoDB Community Server
2. Start it (`mongod`)
3. Use `MONGO_URI=mongodb://127.0.0.1:27017/novameet`

The app will automatically create the `novameet` database and its collections
(`users`, `meetings`, `meetingparticipants`) on first write.

---

## 8. Running Locally

Open two terminals.

**Terminal 1 — Backend:**
```bash
cd novameet/server
npm run dev
```
Runs on `http://localhost:5000` (Express API + Socket.IO signaling server).

**Terminal 2 — Frontend:**
```bash
cd novameet/client
npm run dev
```
Runs on `http://localhost:5173`.

Visit `http://localhost:5173` in your browser.

---

## 9. Production Build

```bash
cd novameet/client
npm run build      # outputs static assets to client/dist
npm run preview    # preview the production build locally
```

Serve `client/dist` with any static host (Vercel, Netlify, Nginx, etc.), and run
the `server/` as a Node process (Render, Railway, a VM, etc.). Update
`VITE_API_URL` / `VITE_SOCKET_URL` (frontend) and `CLIENT_URL` (backend) to your
deployed URLs.

---

## 10. Testing Video Conferencing Locally (Two Participants)

1. Start both servers as described above.
2. In **Browser Window 1**, register/login as User A, go to Dashboard → *New Meeting*, create an instant meeting. Note the generated ID (e.g. `NOVA-482-913`) and click **Join Now**.
3. Allow camera/microphone permissions when prompted.
4. Open a **second browser window** (use an actual second browser, or an Incognito/Private window — using the same browser without incognito will share your login session) and register/login as User B.
5. On User B's Dashboard, go to *Join Meeting*, enter the same meeting ID, and join.
6. Allow camera/microphone permissions for User B as well.
7. You should now see both video tiles, be able to mute/unmute, toggle camera, share your screen, raise your hand, and chat in real time between the two windows.
8. As the host (User A), open the participants panel to mute/remove User B, or use the "..." menu to end the meeting for everyone.

> Tip: Using two different browsers (e.g. Chrome for Host, Firefox for Guest) avoids any shared-session/localStorage conflicts entirely.

---

## 11. WebRTC Notes

- NovaMeet uses a **mesh topology**: every participant opens a direct
  `RTCPeerConnection` with every other participant. This is simple and works
  well for small meetings, but does not scale efficiently to very large calls
  (each participant uploads N-1 video streams). For large-scale production use,
  an SFU (e.g. mediasoup, LiveKit, Janus) would be the next step.
- **STUN only**: the app uses public Google STUN servers
  (`stun:stun.l.google.com:19302`) for NAT traversal. This works for most
  home/office networks but may fail behind restrictive corporate firewalls or
  symmetric NATs — in production you would add a **TURN server** as a relay
  fallback.
- **Signaling** is handled entirely over Socket.IO (`offer`, `answer`,
  `ice-candidate` events), authenticated via the same JWT used for the REST
  API.
- **Screen sharing** replaces the outgoing video track on every active peer
  connection via `RTCRtpSender.replaceTrack()`, so viewers don't see a
  renegotiation glitch, and automatically reverts to the camera track when the
  user stops sharing (or closes the browser's native "stop sharing" bar).
- All peer connections and local media tracks are explicitly stopped/closed
  when a user leaves, is removed, or the meeting ends.

---

## 12. Browser/WebRTC Limitations

- Camera/microphone access requires a **secure context** — `localhost` is
  exempt, but any non-localhost deployment **must** be served over HTTPS or
  `getUserMedia`/`getDisplayMedia` will be blocked by the browser.
- Screen sharing (`getDisplayMedia`) is not available on most mobile browsers
  (iOS Safari, most mobile Chrome) — it's a desktop-browser feature.
- Safari has historically been stricter about WebRTC autoplay and permissions
  prompts; if video doesn't appear, check that the browser tab has been
  interacted with and permissions were granted.
- Corporate networks with symmetric NAT or strict firewalls may block direct
  peer connections entirely without a TURN relay (see WebRTC Notes above).

---

## 13. Troubleshooting

| Issue | Fix |
|---|---|
| `MONGO_URI is not defined` on server start | Create `server/.env` from `server/.env.example` and set a real connection string |
| CORS errors in the browser console | Ensure `CLIENT_URL` in `server/.env` exactly matches the URL the frontend is served from |
| "Camera/microphone access was denied" | Check the browser's site permissions (padlock icon) and allow camera/mic, then reload |
| Socket connects but no remote video appears | Confirm both browser windows are logged in as **different users** — the same user can't be two participants at once; check that both allowed camera/mic |
| 401 errors right after login | Confirm `JWT_SECRET` is set and identical across server restarts (changing it invalidates existing tokens) |
| `npm run dev` fails to find modules | Run `npm install` inside the specific `client/` or `server/` folder you're starting |
| Meeting ID says "not found" | Meeting IDs are case-insensitive but must match exactly, e.g. `NOVA-482-913`; double check for typos |

---

Built with React, Express, MongoDB, Socket.IO, and native WebRTC.
