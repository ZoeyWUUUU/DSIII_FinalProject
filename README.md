# 👻 Dead Internet Ritual - LOCAL NETWORK VERSION

## 🎯 What is This?

This is the **LOCAL NETWORK** version of the Dead Internet Ritual. It's designed to work on your local WiFi network **without any deployment**.

Perfect for:
- Live installations
- In-person performances
- Workshops/classes
- Events where everyone is in the same room

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd local-network
npm install
```

### 2. Start the Server

```bash
node server-local.js
```

The server will display:
- Your local IP address
- URLs for mobile and laptop
- Instructions for creating QR code

### 3. Open & Share

**On your computer:**
Open: `http://localhost:3000/laptop-new.html`

**For participants:**
Share this URL (or create QR code):
`http://YOUR-IP:3000/mobile-new.html`

## 📱 Create QR Code

1. Go to: https://www.qr-code-generator.com/
2. Paste your mobile URL (shown when server starts)
3. Download QR code
4. Print and display for participants to scan

## ⚙️ How It Works

1. **Start Server** - Runs on your computer
2. **Same WiFi** - All devices must be on same network
3. **Join** - Participants scan QR code or visit URL
4. **Ritual** - Follow the complete flow:
   - Submit questions (2-5 people)
   - Laptop shows "Summon the Ghost" button
   - Click to start voting
   - Everyone votes
   - Winning question displayed
   - 60-second countdown
   - Ghost is gone → Auto-reset

## 📋 Complete Flow

```
1. Participants submit questions
   ↓
2. Laptop shows: "Summon the Ghost" button (when 2+ questions)
   ↓
3. Click "Summon" → "YOU CAN ONLY ASK ME ONE QUESTION"
   ↓
4. Voting starts automatically
   ↓
5. All participants vote on mobile devices
   ↓
6. Laptop waits for ALL votes
   ↓
7. Winning question displayed (3 seconds)
   ↓
8. 60-second countdown with question visible
   ↓
9. "Ghost is Gone" → Auto-reset (5 seconds)
   ↓
10. Back to step 1
```

## 🎭 For Live Installations

**Setup Checklist:**
- ☐ WiFi available and working
- ☐ WiFi password ready for participants
- ☐ Server running on laptop
- ☐ Laptop display in fullscreen (F11)
- ☐ QR code printed and visible
- ☐ Backup: mobile URL written down
- ☐ Test with your phone first

**During Event:**
- Keep server terminal running
- Monitor for errors in console
- Red "Reset" button available if needed
- Server auto-resets after each ritual

## 🔍 Troubleshooting

### Can't Connect from Mobile?

**Check WiFi:**
- Same network as computer?
- WiFi password correct?

**Check Firewall:**
- Mac: System Preferences → Security & Privacy → Firewall
- Allow Node/Terminal through firewall

**Test Connection:**
- On mobile, open: `http://YOUR-IP:3000`
- Should see file listing or basic page

### Server Won't Start?

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process if needed
kill -9 [PID]

# Restart server
node server-local.js
```

### Need to Reset?

- Click red "Reset Ritual" button on laptop
- Or restart server (Ctrl+C, then `node server-local.js`)

## 📊 Technical Details

**Architecture:**
- Node.js/Express server
- Local file storage (ritual-data.json)
- Polling every 2 seconds for state updates
- No external dependencies or cloud services

**Requirements:**
- Node.js installed
- WiFi network
- Modern web browsers
- 2-5 participants

**Data Storage:**
- ritual-data.json (created automatically)
- Resets on server start
- Deleted after ritual ends

## 🆚 Local vs Cloud Version

### Local Network (This Version)
- ✅ Free
- ✅ Fast
- ✅ Private
- ✅ No deployment needed
- ❌ Same WiFi required
- ❌ Computer must stay on

### Cloud Deployed (Main Version)
- ✅ Access from anywhere
- ✅ No WiFi restriction
- ✅ 24/7 availability
- ❌ Requires deployment
- ❌ Costs ~$5/month
- ❌ Setup time needed

## 💡 Tips

**WiFi:**
- Test range before event
- Have password visible
- Consider WiFi extender for large spaces

**Display:**
- Use projector or large screen
- Fullscreen mode (F11)
- High brightness setting

**Participants:**
- Brief participants before starting
- Show QR code prominently
- Have backup: write URL on board

**Testing:**
- Test full flow before event
- Use multiple browser tabs
- Verify all states work

## 🔄 Updating

If you need to update the code:

1. Make changes to files
2. Stop server (Ctrl+C)
3. Restart: `node server-local.js`

No rebuild or reinstall needed!

## 📞 Support

**Common Issues:**

**"Network error"** on mobile
→ Check WiFi connection

**Laptop shows nothing**
→ Refresh page (Cmd/Ctrl + R)

**Stuck on voting**
→ Click Reset button

**Server crashed**
→ Check terminal for errors
→ Restart server

## 🎉 You're Ready!

Your local network version is complete and ready to use.

**Start now:**
```bash
node server-local.js
```

Then open the URLs displayed in the terminal!

---

**The dead internet is not empty. It is full of us.** 👻
