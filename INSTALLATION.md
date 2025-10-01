# MSP Command Center - Installation Guide

## Quick Start (30 Seconds)

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- **No installation required!**
- **No dependencies!**
- **No backend server!**

### Run the Dashboard

**Option 1: Double-click**
```
Simply double-click index.html
```

**Option 2: Local Server (optional)**
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# Then open: http://localhost:8000
```

**Option 3: Live Server (VS Code)**
```
1. Install "Live Server" extension
2. Right-click index.html
3. Select "Open with Live Server"
```

## Running the Demo

1. **Open** `index.html` in your browser
2. **Click** the "▶️ Run Demo" button
3. **Watch** the agents process 10 sample MSP tickets in real-time

## What You'll See

### Agent Pipeline
Watch three AI agents work together:
- **Intake Agent** (📥) - Collects and structures ticket data
- **Classifier Agent** (🎯) - Categorizes tickets with AI pattern matching
- **Router Agent** (🚦) - Routes to auto-resolution or assigns to tech

### Live Activity Feed
Real-time log of all agent actions:
- Ticket intake and validation
- AI classification with confidence scores
- Routing decisions (auto-resolve vs assign)
- Final resolution status

### Performance Metrics
- Total tickets processed
- Auto-resolution count
- Average processing time
- Classification accuracy

## Demo Tickets

The demo includes 10 realistic MSP tickets:
1. Password reset requests
2. Disk cleanup issues
3. License assignment requests
4. VPN connection problems
5. Printer issues
6. Email problems
7. Hardware failures
8. Security alerts
9. And more...

## Expected Results

**Processing Speed:**
- Each ticket: ~2 seconds
- Full demo (10 tickets): ~25 seconds

**Auto-Resolution:**
- 60-70% of tickets auto-resolved
- 30-40% assigned to technicians

**Categories:**
- Password Reset (auto-resolve)
- Disk Cleanup (auto-resolve)
- License Request (auto-resolve)
- Network Issue (assign to tech)
- Printer Problem (assign to tech)
- Email Issue (assign to tech)
- Hardware Failure (assign to tech)
- Security Alert (escalate)

## File Structure

```
msp-command-center/
├── index.html              # Main dashboard
├── README.md               # Project overview
├── INSTALLATION.md         # This file
│
├── css/
│   ├── main.css           # Main styles
│   └── agents.css         # Agent card styles
│
├── js/
│   ├── app.js             # Main application
│   ├── dashboard.js       # UI management
│   ├── orchestrator.js    # Agent coordination
│   └── agents/
│       ├── intake-agent.js       # Intake Agent
│       ├── classifier-agent.js   # Classifier Agent
│       └── router-agent.js       # Router Agent
│
├── demo/
│   └── sample-tickets.js  # Sample data
│
└── docs/
    └── ARCHITECTURE.md    # Technical docs
```

## Browser Requirements

**Supported:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**Features Used:**
- ES6+ JavaScript (async/await, classes, arrow functions)
- CSS Grid and Flexbox
- CSS Animations

## Controls

### Run Demo
Processes 10 sample tickets through the multi-agent pipeline

### Clear Activity
Clears activity log and resets all statistics

### View Stats
Shows detailed statistics in popup:
- Total processed
- Auto-resolved count and percentage
- Assigned to tech count
- Escalated count
- Average processing time
- Classification accuracy

## Troubleshooting

### Issue: "Sample tickets not loaded"
**Solution:** Make sure all JavaScript files are loaded:
- Check browser console for errors (F12)
- Ensure `demo/sample-tickets.js` exists
- Try refreshing the page

### Issue: Agents not processing
**Solution:**
- Check browser console (F12) for JavaScript errors
- Make sure all agent files are loaded
- Try clearing browser cache

### Issue: Styling looks broken
**Solution:**
- Ensure CSS files are loaded
- Check browser compatibility
- Try hard refresh (Ctrl+Shift+R)

### Issue: Demo button not working
**Solution:**
- Check if JavaScript is enabled
- Look for console errors
- Make sure all scripts loaded successfully

## Development Mode

### Modify Sample Tickets
Edit `demo/sample-tickets.js`:
```javascript
const SAMPLE_TICKETS = [
    {
        id: 'TKT-XXX',
        from: 'user@company.com',
        subject: 'Your subject',
        description: 'Your description',
        priority: 'high'
    }
];
```

### Adjust Agent Behavior

**Intake Agent** (`js/agents/intake-agent.js`):
- Change validation rules
- Add metadata extraction
- Modify processing time

**Classifier Agent** (`js/agents/classifier-agent.js`):
- Add new categories
- Adjust keyword patterns
- Change confidence scoring

**Router Agent** (`js/agents/router-agent.js`):
- Modify routing strategies
- Add new resolution paths
- Change API call simulations

### Change Processing Speed
In each agent file, adjust `await this.delay(ms)`:
```javascript
// Slower (more realistic)
await this.delay(2000);

// Faster (for demos)
await this.delay(500);
```

## Next Steps

### Phase 2 Features (Planned)
- Visual workflow designer
- LLM integration for advanced classification
- Real API integrations (Atera, Zoho, ServiceNow)
- Custom agent creation
- Performance analytics dashboard

### Production Deployment
For production use:
1. Add authentication
2. Implement backend API
3. Connect to real ticketing systems
4. Add LLM provider integration
5. Implement logging and monitoring
6. Add database for ticket storage

## Security

**Current (Demo) Mode:**
- ✅ Runs entirely in browser
- ✅ No external API calls
- ✅ No data collection
- ✅ Privacy-first

**Production Considerations:**
- Add user authentication
- Implement API security
- Encrypt sensitive data
- Add rate limiting
- Implement audit logging

## Support

**Issues or Questions?**
- GitHub: https://github.com/Turtles-AI-Lab/msp-command-center
- Email: jgreenia@jandraisolutions.com

## License

MIT License - Free for personal and commercial use

---

**Built with AI-assisted development** by Turtles AI Lab
**Version:** 1.0.0 (Phase 1)
**Last Updated:** 2025
