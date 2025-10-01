# MSP Command Center - Technical Architecture

## System Overview

MSP Command Center is a multi-agent AI orchestration platform designed to automate MSP ticket triage, classification, and resolution using a coordinated agent pipeline.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (HTML5 Dashboard + Controls)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Application Layer                       │
│                      (app.js)                            │
│  - Event handling                                        │
│  - User interactions                                     │
│  - Demo orchestration                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Orchestrator Layer                       │
│                 (orchestrator.js)                        │
│  - Queue management                                      │
│  - Agent coordination                                    │
│  - Pipeline execution                                    │
│  - Statistics tracking                                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐    ┌─────────────▼────────┐
│   Dashboard  │    │    Agent Pipeline     │
│ (dashboard.js)    │                       │
│                   │   ┌───────────────┐   │
│ - Activity log    │   │ Intake Agent  │   │
│ - UI updates  │    │   │ (intake-agent.js)│   │
│ - Stats display   │   └───────┬───────┘   │
└──────────────┘    │           │           │
                    │   ┌───────▼───────┐   │
                    │   │ Classifier    │   │
                    │   │ Agent         │   │
                    │   │(classifier-    │   │
                    │   │ agent.js)     │   │
                    │   └───────┬───────┘   │
                    │           │           │
                    │   ┌───────▼───────┐   │
                    │   │ Router Agent  │   │
                    │   │(router-       │   │
                    │   │ agent.js)     │   │
                    │   └───────────────┘   │
                    └───────────────────────┘
```

## Component Details

### 1. Application Layer (`app.js`)

**Responsibilities:**
- Initialize application
- Handle user interactions
- Coordinate demo mode
- Manage button states

**Key Methods:**
- `init()` - Initialize app
- `runDemo()` - Process sample tickets
- `clearActivity()` - Reset dashboard
- `showStats()` - Display statistics

### 2. Orchestrator (`orchestrator.js`)

**Responsibilities:**
- Queue management
- Agent pipeline coordination
- Result tracking
- Statistics calculation

**Key Methods:**
- `processTicket(ticket)` - Process single ticket through pipeline
- `processTickets(tickets)` - Batch processing
- `updateStats()` - Calculate and update metrics
- `reset()` - Clear queue and statistics

**Data Flow:**
```
Raw Ticket → Intake Agent → Structured Ticket
           → Classifier Agent → Classified Ticket
           → Router Agent → Routed Ticket
```

### 3. Agent Pipeline

#### A. Intake Agent (`intake-agent.js`)

**Purpose:** First stage - validates and structures ticket data

**Input:**
```javascript
{
    id: 'TKT-001',
    from: 'user@company.com',
    subject: 'Password reset',
    description: 'Forgot my password...',
    priority: 'high'
}
```

**Processing:**
1. Validate required fields
2. Extract metadata (domain, emails, urgency)
3. Add processing timestamps
4. Structure data for next agent

**Output:**
```javascript
{
    ...rawTicket,
    metadata: {
        userDomain: 'company.com',
        wordCount: 15,
        hasUrgentKeywords: true,
        extractedEmail: ['user@company.com']
    },
    processing: {
        intakeTimestamp: '2025-01-01T00:00:00Z',
        intakeAgent: 'Intake Agent',
        intakeVersion: '1.0.0'
    }
}
```

#### B. Classifier Agent (`classifier-agent.js`)

**Purpose:** AI-powered categorization using pattern matching

**Algorithm:**
1. Convert ticket text to lowercase
2. Score each category based on keyword matches
3. Apply category weights
4. Select highest scoring category
5. Calculate confidence score (0-100%)

**Categories:**
- `password_reset` (auto-resolvable)
- `disk_cleanup` (auto-resolvable)
- `license_request` (auto-resolvable)
- `network_issue` (requires tech)
- `printer_issue` (requires tech)
- `email_issue` (requires tech)
- `hardware_failure` (requires tech)
- `security_alert` (escalation)

**Pattern Matching:**
```javascript
'password_reset': {
    keywords: ['password', 'forgot', 'reset', 'login', 'locked out'],
    weight: 10,
    autoResolvable: true
}
```

**Output:**
```javascript
{
    ...structuredTicket,
    classification: {
        category: 'password_reset',
        confidence: 95,
        autoResolvable: true,
        matchedKeywords: ['password', 'forgot', 'reset'],
        classifierTimestamp: '2025-01-01T00:00:01Z'
    }
}
```

#### C. Router Agent (`router-agent.js`)

**Purpose:** Final stage - determines resolution path

**Routing Strategies:**

**Auto-Resolve:**
```javascript
'password_reset': {
    action: 'auto_resolve',
    techLevel: null,
    estimatedTime: '30 seconds',
    apiCalls: ['Microsoft Graph API - Password Reset']
}
```

**Assign to Tech:**
```javascript
'network_issue': {
    action: 'assign_tech',
    techLevel: 'Level 2',
    estimatedTime: '15 minutes',
    apiCalls: []
}
```

**Escalate:**
```javascript
'security_alert': {
    action: 'escalate',
    techLevel: 'Security Team',
    estimatedTime: '5 minutes',
    apiCalls: []
}
```

**Output:**
```javascript
{
    ...classifiedTicket,
    routing: {
        action: 'auto_resolve',
        status: 'resolved',
        resolution: 'Automatically resolved via Microsoft Graph API',
        resolvedBy: 'Automation',
        estimatedTime: '30 seconds'
    },
    status: 'resolved',
    completedAt: '2025-01-01T00:00:02Z'
}
```

### 4. Dashboard (`dashboard.js`)

**Responsibilities:**
- Activity feed management
- UI updates
- Statistics display

**Key Methods:**
- `addActivity(message, type)` - Log activity
- `clearActivity()` - Clear log
- `showStats()` - Display statistics modal
- `updateSystemStatus(status, message)` - Update status badge

### 5. Sample Data (`demo/sample-tickets.js`)

10 realistic MSP tickets covering:
- Password resets (2 tickets)
- Disk cleanup
- License requests (2 tickets)
- VPN issues
- Printer problems
- Email issues
- Hardware failures
- Security alerts

## Data Flow

### Complete Ticket Processing Flow

```
1. USER ACTION
   └─> Click "Run Demo" button

2. APP LAYER
   └─> Load SAMPLE_TICKETS
   └─> Call orchestrator.processTickets(tickets)

3. ORCHESTRATOR
   └─> For each ticket:
       ├─> Add to queue
       ├─> Call processTicket(ticket)
       │
       ├─> INTAKE AGENT
       │   ├─> Validate fields
       │   ├─> Extract metadata
       │   └─> Return structured ticket
       │
       ├─> CLASSIFIER AGENT
       │   ├─> Analyze text
       │   ├─> Match patterns
       │   ├─> Calculate confidence
       │   └─> Return classified ticket
       │
       └─> ROUTER AGENT
           ├─> Select strategy
           ├─> Execute action (auto/assign/escalate)
           └─> Return routed ticket

4. ORCHESTRATOR
   └─> Collect results
   └─> Update statistics
   └─> Update UI

5. DASHBOARD
   └─> Display activity feed
   └─> Show metrics
   └─> Update agent status
```

## Performance Characteristics

### Processing Time (Phase 1)
- **Intake Agent:** ~800ms
- **Classifier Agent:** ~1000ms
- **Router Agent:** ~800ms
- **Total per ticket:** ~2.6 seconds
- **Overhead:** ~400ms (orchestration + UI updates)
- **Average:** ~3 seconds per ticket

### Memory Usage
- **Initial load:** ~10MB
- **During processing:** ~15MB
- **Peak:** ~20MB
- **Activity log (100 items):** ~5MB

### Browser Performance
- **DOM updates:** Throttled to prevent jank
- **Animations:** CSS-based (GPU accelerated)
- **Scroll:** Virtual scrolling for large logs

## Security Model

### Phase 1 (Current - Demo Mode)
- ✅ No external API calls
- ✅ No data persistence
- ✅ No user authentication
- ✅ Client-side only
- ✅ No sensitive data

### Phase 2+ (Production)
- Authentication required
- API key management
- Encrypted data transmission
- Audit logging
- Role-based access control

## Extensibility

### Adding New Agent

```javascript
class CustomAgent {
    constructor() {
        this.name = 'Custom Agent';
        this.status = 'idle';
    }

    async process(ticket) {
        // Your logic here
        return modifiedTicket;
    }
}
```

### Adding New Category

In `classifier-agent.js`:
```javascript
'your_category': {
    keywords: ['keyword1', 'keyword2'],
    weight: 8,
    autoResolvable: true
}
```

### Adding New Routing Strategy

In `router-agent.js`:
```javascript
'your_category': {
    action: 'auto_resolve',
    techLevel: null,
    estimatedTime: '10 seconds',
    apiCalls: ['Your API Call']
}
```

## Phase 2 Enhancements (Planned)

### Visual Workflow Designer
- Drag-and-drop agent configuration
- Custom pipeline creation
- Conditional routing
- Agent parameter tuning

### LLM Integration
- OpenAI GPT-4 classification
- Claude for complex reasoning
- Local LLM support (LM Studio)
- Confidence boosting

### API Integrations
- Atera RMM API
- Zoho Desk API
- ServiceNow API
- Microsoft Graph API
- Zoho Assist API

### Advanced Features
- Multi-tenant support
- SLA monitoring
- Predictive analytics
- Custom agent marketplace
- Performance profiling

## Technology Stack

**Frontend:**
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)

**Architecture:**
- Event-driven
- Promise-based async
- Class-based OOP
- Observer pattern (UI updates)

**No Dependencies:**
- Zero npm packages
- No build process
- No bundler required
- Pure browser JavaScript

## Browser Compatibility

**Minimum Requirements:**
- ES6+ support (async/await, classes, arrow functions)
- CSS Grid and Flexbox
- Promise API
- LocalStorage (Phase 2)

**Tested On:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Performance Optimization

**Current:**
- CSS animations (GPU accelerated)
- Debounced UI updates
- Virtual scrolling for logs
- Event delegation

**Future:**
- Web Workers for heavy processing
- IndexedDB for large datasets
- Service Workers for offline support
- Code splitting for lazy loading

---

**Version:** 1.0.0 (Phase 1)
**Last Updated:** 2025
**Maintained by:** Turtles AI Lab
