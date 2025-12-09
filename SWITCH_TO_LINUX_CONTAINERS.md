# How to Switch Docker to Linux Containers

## Step-by-Step Visual Guide

### Step 1: Find Docker Desktop Icon

Look in your **system tray** (bottom-right corner of Windows taskbar):

```
┌─────────────────────────────────────┐
│  🔊 🌐 🔋 ▲                         │  ← System Tray
│     [Docker Icon] 🐳                │
└─────────────────────────────────────┘
```

### Step 2: Right-Click Docker Icon

Right-click the Docker whale icon (🐳) to open the context menu.

### Step 3: Click "Switch to Linux containers..."

You'll see a menu like this:

```
┌─────────────────────────────────────┐
│  Dashboard                          │
│  Settings                           │
│  ──────────────────────────────     │
│  ✓ Switch to Linux containers...   │  ← Click this!
│  ──────────────────────────────     │
│  Restart                            │
│  Quit Docker Desktop                │
└─────────────────────────────────────┘
```

**Note**: If you see "Switch to Windows containers..." instead, you're already in Linux mode! Skip to verification.

### Step 4: Wait for Docker to Restart

Docker Desktop will restart automatically. This takes 30-60 seconds.

You'll see:
- Docker icon may disappear briefly
- A notification: "Docker Desktop is restarting..."
- Docker icon returns when ready

### Step 5: Verify the Switch

Open PowerShell and run:

```powershell
docker info | Select-String "OSType"
```

**Expected output**:
```
OSType: linux
```

If you see `OSType: windows`, the switch didn't work. Try again.

---

## What If I Don't See the Option?

### Option is Grayed Out
You're already in Linux container mode. Proceed to start PostgreSQL.

### Docker Icon Not in System Tray
1. Click the **up arrow** (^) in system tray to show hidden icons
2. Docker icon should be there
3. If not, Docker Desktop isn't running - start it from Start Menu

### "Switch to Linux containers" Not Available
Your Docker Desktop version might not support Windows containers. This is fine - you're already in Linux mode.

---

## After Switching

Run the fix script again:

```powershell
.\fix-docker-windows.bat
```

Or manually start PostgreSQL:

```powershell
docker-compose up -d postgres
```

---

## Why Do I Need Linux Containers?

- PostgreSQL is a Linux application
- Most development tools use Linux containers
- Linux containers are more common and better supported
- You can still develop Windows applications using Linux containers

---

## Can I Switch Back Later?

Yes! Use the same menu to switch back to Windows containers anytime. However, for this project, you need Linux containers.

---

## Next Steps

Once in Linux mode:

1. ✅ Run `.\fix-docker-windows.bat`
2. ✅ Start Strapi CMS
3. ✅ Start Next.js frontend
4. ✅ Begin development

See [README.md](./README.md) for complete setup instructions.
