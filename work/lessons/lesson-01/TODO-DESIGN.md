# Terminal Todo Manager - Design Document

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [UI Layout](#ui-layout)
4. [Data Model](#data-model)
5. [Navigation & Commands](#navigation--commands)
6. [Technical Stack](#technical-stack)
7. [Implementation Strategy](#implementation-strategy)

## Overview

A sophisticated terminal-based todo management application built with TypeScript and Blessed, following the Model-View-Controller (MVC) architectural pattern. The application provides a multi-panel interface for comprehensive task management with keyboard-driven navigation.

### Core Features
- Multi-panel terminal UI with real-time updates
- Hierarchical task organization (projects, categories, tags)
- Priority levels and due date management
- Task filtering and searching capabilities
- Persistent storage with JSON/SQLite support
- Vim-style keyboard navigation
- Status tracking and progress visualization

## Architecture

### MVC Component Structure

src/
├── models/
│   ├── Todo.ts           # Todo item model
│   ├── Project.ts        # Project model
│   ├── Category.ts       # Category model
│   └── Store.ts          # Data persistence layer
├── views/
│   ├── BaseView.ts       # Abstract view class
│   ├── TodoListView.ts   # Main todo list panel
│   ├── DetailView.ts     # Todo detail panel
│   ├── InputView.ts      # Input/command panel
│   ├── FilterView.ts     # Filter/search panel
│   ├── StatusView.ts     # Status bar view
│   └── Layout.ts         # Layout manager
├── controllers/
│   ├── TodoController.ts # Todo CRUD operations
│   ├── NavigationController.ts # Panel navigation
│   ├── CommandController.ts # Command processing
│   └── FilterController.ts # Filter/search logic
├── utils/
│   ├── EventBus.ts       # Event management
│   ├── KeyBindings.ts    # Keyboard shortcuts
│   └── Themes.ts         # UI themes
└── app.ts                # Application entry point

### Component Interaction Flow

The components interact through a unidirectional data flow pattern:

1. User input is captured by the active View
2. View delegates input to appropriate Controller
3. Controller processes the input and updates Model
4. Model emits change events through EventBus
5. All relevant Views listen to events and update their display
6. Views re-render using Blessed framework

#### Model Layer Responsibilities
- Data validation and integrity
- Business rule enforcement
- State persistence coordination
- Change event emission
- Data transformation and serialization

#### View Layer Responsibilities
- UI component rendering
- User input capture
- Display formatting and styling
- Panel layout management
- Visual feedback and animations

#### Controller Layer Responsibilities
- Input validation and parsing
- Command execution orchestration
- Business logic coordination
- Model-View mediation
- Navigation state management

### Event System

The application uses a centralized event bus for loose coupling between components. Key events include:

**Todo Events**
- todo:created
- todo:updated
- todo:deleted
- todo:completed
- todo:moved

**Navigation Events**
- panel:focused
- panel:blurred
- mode:changed

**System Events**
- app:ready
- data:loaded
- data:saved
- error:occurred

## UI Layout

### Panel Configuration

The interface consists of five main panels arranged in a traditional terminal application layout:

```
┌─────────────────────────────────────────────────────────────────┐
│                          Status Bar                             │
├──────────────────┬───────────────────────┬──────────────────────┤
│                  │                       │                      │
│   Filter Panel   │   Todo List Panel     │   Detail Panel       │
│                  │                       │                      │
│  [Categories]    │  □ Task 1 (High) Due  │  Title: Task 1       │
│  > Work          │  ☑ Task 2 (Med)      │  Priority: High      │
│    Personal      │  □ Task 3 (Low)       │  Due: 2024-01-15     │
│    Shopping      │  > □ Task 4           │  Status: In Progress │
│                  │    □ Subtask 4.1      │                      │
│  [Tags]          │    □ Subtask 4.2      │  Description:        │
│  #urgent         │                       │  Complete the design │
│  #review         │                       │  document for...     │
│  #blocked        │                       │                      │
│                  │                       │  [Tags]              │
│  [Projects]      │                       │  #urgent #review     │
│  > Project Alpha │                       │                      │
│    Project Beta  │                       │  [Attachments]       │
│                  │                       │  design.pdf          │
├──────────────────┴───────────────────────┴──────────────────────┤
│                      Command/Input Panel                        │
│ > add task "New todo item" --priority high --due tomorrow       │
└─────────────────────────────────────────────────────────────────┘
```

### Panel Specifications

#### Status Bar (Top)
- **Dimensions**: Full width, single line height
- **Purpose**: System information and notifications
- **Content Elements**:
  - Current mode indicator (Normal/Command/Search/Edit)
  - Todo statistics (total, completed, pending)
  - Active filters indicator
  - System notifications and alerts
  - Current date and time
- **Update Frequency**: Real-time for mode changes, periodic for statistics

#### Filter Panel (Left)
- **Dimensions**: 20-25% width, full height minus status and command bars
- **Purpose**: Organization and filtering interface
- **Content Sections**:
  - Category tree view with expand/collapse
  - Tag cloud with usage frequency
  - Project list with active indicators
  - Quick filter presets (Today, This Week, Overdue, High Priority)
  - Custom saved filters
- **Interaction**: Single selection for categories/projects, multiple for tags

#### Todo List Panel (Center)
- **Dimensions**: 40-50% width, full height minus status and command bars
- **Purpose**: Primary task list display and management
- **Display Features**:
  - Hierarchical task structure with indentation
  - Visual completion indicators (checkbox states)
  - Priority badges with color coding
  - Due date display with urgency highlighting
  - Subtask count indicators
  - Progress bars for parent tasks
- **Sorting Options**: Priority, due date, creation date, alphabetical, manual

#### Detail Panel (Right)
- **Dimensions**: 30-35% width, full height minus status and command bars
- **Purpose**: Comprehensive task information and editing
- **Content Areas**:
  - Task title and description (with markdown rendering)
  - Metadata section (dates, priority, status)
  - Tags and categories display
  - Subtask listing
  - Attachment management
  - Notes and comments
  - Activity history log
- **Modes**: Read-only view mode, inline edit mode

#### Command Panel (Bottom)
- **Dimensions**: Full width, 1-3 lines height (expandable)
- **Purpose**: Command input and search interface
- **Operating Modes**:
  - Command mode (colon prefix)
  - Search mode (slash prefix)
  - Quick add mode (direct text input)
  - Filter expression mode
- **Features**: Command history, auto-completion, syntax highlighting

## Data Model

### Todo Item Properties

**Core Properties**
- Unique identifier (UUID)
- Title (required, character limit: 200)
- Description (optional, markdown support)

**Status and Priority**
- Status states: pending, in_progress, completed, cancelled
- Priority levels: low, medium, high, critical
- Completion boolean flag
- Completion timestamp

**Temporal Properties**
- Creation timestamp
- Last update timestamp
- Due date and time
- Start date (for scheduled tasks)
- Reminder date and time

**Organization Properties**
- Project assignment
- Category assignment
- Parent task reference (for subtasks)
- Tag list (unlimited)

**Advanced Properties**
- Time estimation (in minutes)
- Actual time tracking
- Recurrence rules (daily, weekly, monthly, custom)
- File attachments list
- Notes collection
- Version number for conflict resolution

### Project Structure

**Properties**
- Unique identifier
- Project name
- Description
- Color coding for UI
- Terminal icon or emoji
- Active/archived status
- Sort order index
- Timestamps (created, updated)

### Category Structure

**Properties**
- Unique identifier
- Category name
- Color assignment
- Parent category (for hierarchy)
- Sort order index

### Attachment Structure

**Properties**
- Unique identifier
- Filename
- File path (absolute or relative)
- File size
- MIME type
- Addition timestamp

### Data Persistence Strategy

**Storage Options**
- JSON file storage for simplicity
- SQLite database for advanced features
- Export formats: JSON, CSV, Markdown

**Persistence Operations**
- Auto-save on changes (configurable interval)
- Manual save command
- Backup rotation system
- Import/export functionality
- Data migration support

## Navigation & Commands

### Keyboard Navigation Schema

#### Global Navigation Keys
- Tab / Shift+Tab: Cycle through panels forward/backward
- Ctrl+1 through Ctrl+5: Direct panel focus
- Escape: Cancel operation or exit mode
- Question mark: Display help overlay
- Colon: Enter command mode
- Forward slash: Enter search mode
- Ctrl+S: Force save
- Ctrl+Q: Quit application

#### List Panel Navigation
- j/k or Arrow keys: Navigate up/down
- h/l or Arrow keys: Collapse/expand subtasks
- Space: Toggle completion status
- Enter: Open in detail panel
- d: Delete selected task
- e: Edit inline
- a: Add new task at current level
- A: Add subtask to selected
- p: Cycle priority
- t: Tag management mode

#### Filter Panel Navigation
- j/k: Navigate filter options
- Space or Enter: Toggle filter selection
- c: Clear all active filters
- s: Save current filter as preset
- /: Search within filters

### Command System

#### Basic Command Categories

**Task Management Commands**
- add: Create new task with options
- edit: Modify existing task
- delete: Remove task(s)
- complete: Mark as complete
- move: Relocate to different project
- tag: Add or remove tags

**Organization Commands**
- project: Create/manage projects
- category: Create/manage categories
- filter: Apply filter expressions
- sort: Change sort order
- group: Group by property

**System Commands**
- save: Force save to disk
- export: Export data
- import: Import data
- theme: Change UI theme
- config: Modify settings
- help: Display help
- quit: Exit application

#### Advanced Command Features

**Bulk Operations**
- Bulk selection mode
- Mass update properties
- Batch completion
- Group deletion

**Recurring Tasks**
- Daily, weekly, monthly patterns
- Custom recurrence rules
- Exception dates
- Completion behavior

**Templates and Macros**
- Task templates
- Command macros
- Keyboard macro recording
- Playback functionality

### Filter Expression Language

**Basic Operators**
- AND, OR, NOT logical operators
- Parentheses for grouping
- Comparison operators (=, !=, <, >, <=, >=)

**Filter Fields**
- status: Task status
- priority: Priority level
- due: Due date comparisons
- created: Creation date
- updated: Last update
- tag: Tag presence
- project: Project assignment
- category: Category assignment
- title: Title text search
- description: Description search

**Special Filters**
- today: Due today
- tomorrow: Due tomorrow
- this-week: Due this week
- overdue: Past due date
- no-date: No due date set
- has-subtasks: Parent tasks only
- is-subtask: Child tasks only

## Technical Stack

### Core Framework Dependencies
- **blessed**: Terminal UI framework foundation
- **blessed-contrib**: Extended UI components
- **TypeScript**: Type safety and developer experience
- **Node.js**: Runtime environment

### Data Management
- **lowdb**: Lightweight JSON database
- **sqlite3**: Optional SQL database support
- **joi**: Schema validation
- **uuid**: Unique identifier generation

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **chalk**: Terminal color support
- **commander**: CLI argument parsing
- **rxjs**: Reactive programming patterns
- **lodash**: Utility function collection

### Development Tools
- **jest**: Testing framework
- **eslint**: Code quality linting
- **prettier**: Code formatting
- **nodemon**: Development hot-reload
- **ts-node**: TypeScript execution

## Implementation Strategy

### Phase 1: Foundation
- Set up TypeScript project structure
- Implement basic MVC architecture
- Create event bus system
- Build core data models
- Develop storage layer

### Phase 2: UI Framework
- Implement blessed layout system
- Create base view classes
- Build panel components
- Add keyboard navigation
- Implement theme system

### Phase 3: Core Features
- Todo CRUD operations
- Project and category management
- Basic filtering and sorting
- Command system implementation
- Data persistence

### Phase 4: Advanced Features
- Subtask hierarchy
- Recurring tasks
- Time tracking
- Advanced filtering
- Bulk operations

### Phase 5: Polish and Optimization
- Performance optimization
- Error handling
- Help system
- Configuration management
- Testing suite

### Performance Considerations

**Rendering Optimization**
- Virtual scrolling for large lists
- Differential rendering updates
- Debounced search and filter
- Cached computed values

**Data Management**
- Indexed data structures
- Lazy loading for details
- Batch update operations
- Memory management for large datasets

**User Experience**
- Responsive keyboard input
- Smooth animations (where supported)
- Progress indicators for long operations
- Graceful error recovery

### Testing Strategy

**Unit Testing**
- Model validation logic
- Controller operations
- Utility functions
- Filter expression parsing

**Integration Testing**
- MVC component interaction
- Event bus communication
- Storage operations
- Command execution flow

**UI Testing**
- Panel navigation
- Keyboard shortcut handling
- Display rendering
- Focus management

### Error Handling Strategy

**Error Categories**
- Validation errors
- Storage errors
- Parse errors
- System errors

**Recovery Mechanisms**
- Automatic retry for transient failures
- Graceful degradation
- User notification system
- Error logging

### Configuration System

**User Preferences**
- UI theme selection
- Panel size preferences
- Default values
- Keyboard customization

**Application Settings**
- Storage location
- Backup configuration
- Auto-save interval
- Date format preferences

**Feature Toggles**
- Experimental features
- Performance options
- Debug mode

## Future Enhancement Roadmap

### Collaboration Features
- Multi-user support
- Conflict resolution
- Real-time synchronization
- Commenting system

### Integration Options
- Calendar integration
- Email integration
- Third-party task managers
- Version control systems

### Extended Features
- Natural language processing
- Smart suggestions
- Advanced analytics
- Reporting system

### Accessibility Improvements
- Screen reader support
- High contrast themes
- Keyboard navigation enhancement
- Alternative input methods