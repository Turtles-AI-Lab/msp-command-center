# MSP Command Center - Phase 2: Visual Workflow Designer

## Overview

Phase 2 introduces a powerful drag-and-drop visual workflow designer that allows you to create, configure, and test multi-agent workflows without writing code.

**File:** `designer.html`
**Access:** Click "🎨 Open Designer" from the main dashboard

---

## Features

### 1. **Drag-and-Drop Canvas**
- Grid-based canvas with infinite workspace
- Drag agents from palette onto canvas
- Reposition agents by dragging
- Zoom in/out and reset view
- Clear canvas with confirmation

### 2. **Agent Library (6 Pre-Built Agents)**

**Core Agents:**
- 📥 **Intake Agent** - Collects and structures ticket data
- 🎯 **Classifier Agent** - AI-powered ticket categorization
- 🚦 **Router Agent** - Smart routing and auto-resolution

**Utility Agents:**
- ✓ **Validator Agent** - Data validation
- 📊 **Enricher Agent** - Data enrichment
- 📝 **Logger Agent** - Activity logging

### 3. **Visual Connections**
- Click output point (→) and drag to input point (←)
- Bezier curve connections with arrowheads
- Automatic connection rendering
- Connection validation (prevents cycles)
- Visual feedback while connecting

### 4. **Properties Panel**
- Click any agent to view/edit properties
- Configure agent-specific settings
- Adjust position manually
- Real-time updates

### 5. **Custom Agent Creator**
- Create custom agents with JavaScript logic
- Custom icons (emoji support)
- Persistent storage across sessions
- Drag custom agents like built-in ones

### 6. **Workflow Management**
- Save workflows to browser storage
- Download workflows as JSON files
- Load latest workflow automatically
- Named workflows for organization

### 7. **Workflow Validation**
- Test workflow structure
- Detect circular dependencies
- Validate start/end points
- Calculate complexity metrics
- Estimate processing time

### 8. **Performance Profiling**
- Node count and connections
- Workflow complexity analysis
- Estimated processing time
- Maximum depth calculation

---

## User Interface Layout

```
┌──────────────────────────────────────────────────────────┐
│ 🎨 Workflow Designer        [Back][Test][Save]          │
├────────────┬──────────────────────────┬─────────────────┤
│            │                          │                 │
│ AGENT      │       CANVAS             │   PROPERTIES    │
│ PALETTE    │                          │                 │
│            │    [Drag agents here]    │   [Agent config]│
│            │                          │                 │
│ Core:      │    Grid background       │   Name:         │
│  📥 Intake │                          │   Description:  │
│  🎯 Class. │    Zoom: [100%]          │   Position:     │
│  🚦 Router │                          │   Settings:     │
│            │                          │                 │
│ Utility:   │                          │   [Apply]       │
│  ✓ Validator                          │                 │
│  📊 Enricher                          │                 │
│  📝 Logger  │                          │                 │
│            │                          │                 │
│ Custom:    │                          │                 │
│  + Create  │                          │                 │
│            │                          │                 │
└────────────┴──────────────────────────┴─────────────────┘
│ Workflow: My Workflow | Agents: 3 | Connections: 2     │
└──────────────────────────────────────────────────────────┘
```

---

## How to Use

### Creating Your First Workflow

**Step 1: Add Agents**
1. Drag "Intake Agent" from left palette onto canvas
2. Drag "Classifier Agent" onto canvas (to the right)
3. Drag "Router Agent" onto canvas (further right)

**Step 2: Connect Agents**
1. Click the output point (→) on Intake Agent
2. Drag to the input point (←) on Classifier Agent
3. Release to create connection
4. Repeat: Classifier → Router

**Step 3: Configure Agents**
1. Click on Classifier Agent
2. In Properties panel (right), adjust settings:
   - Accuracy: High
   - Categories: 8
3. Click "Apply Changes"

**Step 4: Test Workflow**
1. Click "▶️ Test Workflow" button
2. View validation results
3. See estimated processing time

**Step 5: Save Workflow**
1. Enter workflow name at bottom
2. Click "💾 Save Workflow"
3. Workflow saved to browser + downloaded as JSON

---

## Agent Configuration Options

### Intake Agent
```
✓ Validate Required Fields
✓ Extract Metadata
```

### Classifier Agent
```
Accuracy Level: High/Medium/Low
Number of Categories: 1-20
```

### Router Agent
```
✓ Enable Auto-Resolution
Escalation Threshold: 0-100%
```

### Validator Agent
```
✓ Strict Validation Mode
```

### Enricher Agent
```
Data Sources: [x] Internal DB
             [ ] External APIs
             [ ] Cache
```

### Logger Agent
```
Log Level: Debug/Info/Warning/Error
```

---

## Creating Custom Agents

**Step 1: Open Custom Agent Creator**
- Click "+ Create Custom Agent" in left palette

**Step 2: Fill Form**
```
Agent Name: Priority Sorter
Icon: 🔥
Description: Sorts tickets by priority
```

**Step 3: Write JavaScript Logic**
```javascript
async function process(data) {
  // Sort by priority
  if (data.priority === 'critical') {
    data.priorityScore = 100;
  } else if (data.priority === 'high') {
    data.priorityScore = 75;
  } else {
    data.priorityScore = 50;
  }

  return data;
}
```

**Step 4: Save Agent**
- Click "Save Agent"
- Agent appears in "Custom" section of palette
- Drag onto canvas like any other agent

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Delete** | Remove selected agent |
| **Ctrl/Cmd + S** | Save workflow |
| **Escape** | Deselect agent |

---

## Workflow Validation Rules

### Valid Workflow Requirements:
✅ Must have at least one agent
✅ Multi-agent workflows must have connections
✅ Must have at least one starting point (no inputs)
✅ Must have at least one end point (no outputs)
✅ No circular dependencies allowed

### Validation Messages:
```
⚠️ Workflow must have at least one agent
⚠️ Agents must be connected
⚠️ Workflow contains circular dependencies
⚠️ Workflow must have at least one starting point
⚠️ Workflow must have at least one end point
```

---

## File Storage

### Browser LocalStorage
- Latest workflow: `latest-workflow`
- Custom agents: `custom-agents`
- Individual workflows: `workflow-{timestamp}`
- Welcome message flag: `designer-welcome-seen`

### Downloaded Files
- Format: JSON
- Filename: `{workflow-name}.json`
- Contains: nodes, connections, metadata

---

## Example Workflows

### Example 1: Basic Password Reset Workflow
```
Intake Agent → Classifier Agent → Router Agent
```

### Example 2: Advanced Validation Workflow
```
Intake Agent → Validator Agent → Classifier Agent → Router Agent → Logger Agent
```

### Example 3: Enriched Classification
```
Intake Agent → Enricher Agent → Classifier Agent → Router Agent
```

### Example 4: Multi-Path Routing
```
                    ┌→ Router Agent (High Priority)
Intake → Classifier │
                    └→ Router Agent (Low Priority)
```

---

## Performance Metrics

### Workflow Complexity
- **Low:** < 3 points (nodes + 0.5×connections)
- **Medium:** 3-6 points
- **High:** > 6 points

### Estimated Processing Time
- Intake Agent: 0.8s
- Classifier Agent: 1.0s
- Router Agent: 0.8s
- Validator Agent: 0.5s
- Enricher Agent: 1.2s
- Logger Agent: 0.3s
- Custom Agents: 0.7s (default)

### Test Report Example
```
✅ Workflow Test Passed!

📊 Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Agents: 3
Connections: 2
Est. Processing Time: 2.6s
Complexity: Medium
━━━━━━━━━━━━━━━━━━━━━━━━━━

The workflow is valid and ready to execute!
```

---

## Console Commands

Type these in browser console for advanced features:

```javascript
// View workflow statistics
showStatistics()

// Load example workflow
loadExample()

// Clear entire workspace
clearAll()

// Show keyboard shortcuts
showShortcuts()
```

---

## Technical Implementation

### Architecture
```
designer-app.js (Main)
├── canvas.js (Canvas rendering)
├── agent-node.js (Node management)
├── connections.js (Connection utilities)
├── properties.js (Properties panel)
├── workflow-manager.js (Save/load/test)
└── custom-agents.js (Custom agent creator)
```

### Technologies
- Pure JavaScript (ES6+)
- HTML5 Canvas for connections
- CSS Grid for layout
- LocalStorage for persistence
- Drag & Drop API
- JSON for workflow export

### Browser Requirements
- ES6+ support (classes, async/await, arrow functions)
- HTML5 Canvas
- Drag & Drop API
- LocalStorage
- Supports Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

## Workflow JSON Format

```json
{
  "name": "My Workflow",
  "version": "2.0.0",
  "created": "2025-01-01T00:00:00.000Z",
  "nodes": [
    {
      "id": "node-123",
      "type": "intake",
      "name": "Intake Agent",
      "icon": "📥",
      "description": "Collects data",
      "x": 100,
      "y": 200,
      "config": {
        "validateFields": true,
        "extractMetadata": true
      }
    }
  ],
  "connections": [
    {
      "from": "node-123",
      "to": "node-456",
      "id": "conn-1"
    }
  ]
}
```

---

## Limitations & Future Enhancements

### Current Limitations
- Maximum workflow size limited by browser memory
- No real-time collaboration
- No version history/undo yet
- Canvas export as image not yet implemented

### Phase 3 Planned Features
- [ ] LLM integration for smart classification
- [ ] Real API connections (Atera, Zoho, etc.)
- [ ] Live workflow execution
- [ ] Workflow templates library
- [ ] Version history with undo/redo
- [ ] Export as image/PDF
- [ ] Dark mode
- [ ] Collaborative editing
- [ ] Workflow marketplace

---

## Troubleshooting

### Issue: Agents won't connect
**Solution:** Make sure you're dragging from output (→) to input (←), not vice versa

### Issue: Custom agent not appearing
**Solution:** Check browser console for JavaScript errors in your agent logic

### Issue: Workflow won't save
**Solution:** Check browser localStorage quota (should have space available)

### Issue: Connections not rendering
**Solution:** Try zooming to reset view, or refresh the page

### Issue: Properties panel blank
**Solution:** Click on an agent to view its properties

---

## Best Practices

### Workflow Design
1. Start with simple 3-agent workflows
2. Test frequently as you build
3. Use descriptive agent names
4. Add validation at the start
5. Add logging at the end
6. Keep complexity manageable

### Performance
1. Avoid overly complex workflows (>10 agents)
2. Limit connections per agent (3-4 max)
3. Test before deploying
4. Monitor estimated processing time

### Organization
1. Name workflows clearly
2. Save frequently
3. Keep backup JSON files
4. Document custom agent logic
5. Use consistent naming conventions

---

## Support

**Issues?** Check browser console (F12) for errors

**Questions?** See main README or INSTALLATION.md

**Feature Requests?** Open GitHub issue

---

**Built with AI-assisted development** by Turtles AI Lab
**Version:** 2.0.0 (Phase 2 Complete)
**Last Updated:** 2025
