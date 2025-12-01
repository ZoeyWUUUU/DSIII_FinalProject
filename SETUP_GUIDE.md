# 🔥 Dead Internet Ritual - Local Network Setup Guide

## ✅ Current Status

Your server is **RUNNING** and properly configured!

- **Server IP**: `192.168.68.51`
- **Port**: `3000`
- **Status**: ✓ Active (PID: 40749)

---

## 📱 How to Connect Devices

### For Laptop (Host Computer)
Open in your browser:
```
http://localhost:3000/laptop-new.html
```

### For Mobile Devices (Participants)
All participants should open this URL in their mobile browsers:
```
http://192.168.68.51:3000/mobile-new.html
```

**IMPORTANT**: All devices MUST be connected to the **SAME WiFi network**!

---

## 🎯 Quick Test Steps

1. **On Laptop**: Open `http://localhost:3000/laptop-new.html`
   - You should see "RITUAL STARTING..." with Matrix rain effect
   - It should show "0 question(s) submitted"

2. **On Mobile Device**: Open `http://192.168.68.51:3000/mobile-new.html`
   - You should see a question input form
   - Submit a test question

3. **Check Laptop**: The count should update to "1 question(s) submitted"

4. **Submit another question** from a different mobile device (or use a private/incognito window)
   - Once 2+ questions are submitted, the "Summon the Ghost" button appears on laptop

---

## 🔧 Troubleshooting

### Issue: Mobile can't connect to laptop

**Solution 1: Check WiFi**
```bash
# On laptop, verify your IP:
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Make sure this IP matches the URL you're using on mobile devices.

**Solution 2: Check Firewall**
Your Mac's firewall might be blocking connections. To check:
1. Go to System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Make sure "Block all incoming connections" is OFF
4. Or add Node.js to allowed apps

**Solution 3: Restart Server**
```bash
# Kill the current server
kill 40749

# Start fresh
node server-local.js
```

### Issue: Server won't start (EADDRINUSE)

The server is already running! You don't need to start it again.

To restart:
```bash
# Find and kill the process
lsof -i :3000
kill <PID>

# Start again
node server-local.js
```

---

## 📲 Create QR Code for Easy Access

1. Go to: https://www.qr-code-generator.com/
2. Enter URL: `http://192.168.68.51:3000/mobile-new.html`
3. Generate and print the QR code
4. Participants can scan to join instantly!

---

## 🎭 Ritual Flow

1. **Waiting**: Participants submit questions (need 2-5 questions)
2. **Summon Ghost**: Host clicks button on laptop
3. **Message**: "YOU CAN ONLY ASK ME ONE QUESTION" appears
4. **Voting**: Participants vote for their favorite question (1-5 min)
5. **Winner Announced**: Winning question is displayed
6. **Sacrifice**: "PLACE YOUR SACRIFICE IN FRONT OF THE LAPTOP" (10 seconds)
7. **Payment**: "PAYMENT REQUIRED" (30 seconds)
8. **Ghost Gone**: "GHOST IS GONE" appears briefly
9. **Auto-Reset**: System automatically resets to start over

---

## 🎨 New Features

✅ Matrix rain background (green binary digits on black)
✅ No emojis - pure text aesthetic
✅ 10-second sacrifice placement countdown
✅ 30-second payment countdown
✅ Automatic restart after ritual ends
✅ Cyber-spiritual hacker vibe

---

## 💡 Tips

- Keep laptop visible to all participants during the ritual
- The Matrix rain effect works best on a large screen
- Make sure phone brightness is high enough to read QR codes
- Test with one phone first before gathering all participants

---

## 🆘 Need Help?

If devices still can't communicate:
1. Confirm all devices on same WiFi
2. Try accessing from phone browser: `http://192.168.68.51:3000/mobile-new.html`
3. Check laptop firewall settings
4. Restart the server with: `kill 40749 && node server-local.js`
