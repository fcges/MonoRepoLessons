# Terminal Todo Manager - Implementation Plan

## Project Structure

```
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
│   ├── InputView.ts      # Input/search panel
│   ├── FilterView.ts     # Filter/search panel
│   ├── StatusView.ts     # Status bar view
│   ├── ToolbarView.ts    # Toolbar with action buttons
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
```

## Implementation Phases

### Phase 1: Project Foundation

**Setup Steps**
1. Initialize npm project with TypeScript
2. Install core dependencies: blessed, blessed-contrib, @types/blessed
3. Configure tsconfig.json for Node.js
4. Create the basic directory structure
5. Set up package.json scripts (dev, build, start)

**Dependencies to Install**
- blessed (terminal UI)
- blessed-contrib (additional widgets)
- typescript
- ts-node (development)
- nodemon (hot reload)
- uuid (unique IDs)
- date-fns (date handling)
- lodash (utilities)

### Phase 2: Core Architecture

**Step 1: Event System**
- Create EventBus.ts with publish/subscribe pattern
- Define event types (todo:created, todo:updated, todo:deleted, etc.)
- Implement type-safe event emitter

**Step 2: Base Models**
- Create Todo.ts model with properties (id, title, description, status, priority, dates)
- Create Project.ts model (id, name, color)
- Create Category.ts model (id, name, parentId)
- Add validation methods to each model

**Step 3: Storage Layer**
- Implement Store.ts with JSON file persistence
- Add CRUD methods (create, read, update, delete, list)
- Implement auto-save functionality
- Add data loading on startup

### Phase 3: UI Framework

**Step 1: Layout Foundation**
- Create Layout.ts to manage blessed screen
- Enable mouse support with `mouse: true` option
- Define panel regions (status, toolbar, filter, list, detail, input)
- Implement panel sizing and positioning
- Set up blessed screen with proper options

**Step 2: Base View**
- Create BaseView.ts abstract class
- Add common properties (box, screen, eventBus)
- Implement render, show, hide, focus methods
- Add mouse click event handling
- Add event subscription management

**Step 3: Status Bar**
- Implement StatusView.ts extending BaseView
- Display mode, stats, and current time
- Update on todo changes
- Position at top of screen

**Step 4: Toolbar**
- Implement ToolbarView.ts with clickable buttons
- Create button layout: [➕ Add] [✏️ Edit] [⭐ Priority] [📁 Project] [↕️ Sort] [📂 New Project] [🗑️ Delete] [✓ Complete]
- Style buttons with borders and hover effects
- Handle mouse clicks on each button
- Show tooltips on hover
- Update button states based on selection

### Phase 4: Main Todo List

**Step 1: Todo List View**
- Implement TodoListView.ts with blessed list widget
- Enable mouse support for clicking items
- Create todo item formatter (checkbox, title, priority, due date)
- Add scrolling with mouse wheel
- Implement item highlighting on hover
- Double-click to edit todo

**Step 2: Todo Controller**
- Create TodoController.ts
- Implement CRUD operations
- Add todo validation
- Connect to Store for persistence
- Emit events on changes

**Step 3: List Interactions**
- Mouse click to select todo
- Double-click to edit
- Right-click for context menu
- Add keyboard handlers (j/k for navigation)
- Implement space for toggle completion
- Add keyboard shortcuts matching toolbar actions
- Connect view to controller

### Phase 5: Interactive Input

**Step 1: Input View**
- Implement InputView.ts with blessed textbox
- Create modal input forms for adding/editing todos
- Add search mode (/ prefix for quick search)
- Implement input validation and feedback

**Step 2: Interactive Forms**
- Create popup form for new todos (triggered by 'a' key)
- Add fields: title, description, priority, due date, project
- Implement field navigation with Tab
- Add Save (Enter) and Cancel (Esc) actions

**Step 3: Quick Actions**
- Implement inline editing (press 'e' on selected todo)
- Add priority cycling (press 'p' to change priority)
- Add project assignment (press 'P' to assign project)
- Add tag management (press 't' to add/remove tags)

### Phase 6: Filtering System

**Step 1: Filter View**
- Implement FilterView.ts with interactive sections
- Add clickable category list with checkboxes
- Add tag cloud (click to toggle)
- Add project list with selection
- Add quick filter buttons (Today, This Week, Overdue)

**Step 2: Filter Controller**
- Create FilterController.ts
- Implement filter state management
- Add filter combination logic (multiple selections)
- Connect to todo list updates
- Store active filters

**Step 3: Interactive Filtering**
- Click/Space to toggle filters
- Show active filter badges
- Add filter clear button
- Update list in real-time
- Persist filter preferences

### Phase 7: Detail Panel

**Step 1: Detail View**
- Implement DetailView.ts with form layout
- Display todo information in editable fields
- Add inline field editing (click to edit)
- Show metadata and timestamps

**Step 2: Interactive Editing**
- Click on any field to edit
- Add dropdown for priority selection
- Add date picker for due dates
- Add tag input with autocomplete
- Save on Enter, cancel on Esc

**Step 3: Quick Actions Bar**
- Add action buttons at bottom of detail panel
- Complete/Uncomplete button
- Delete button with confirmation
- Duplicate todo button
- Move to project dropdown

### Phase 8: Navigation and Themes

**Step 1: Navigation Controller**
- Create NavigationController.ts
- Implement focus management between panels
- Add modal dialog management
- Handle form navigation
- Coordinate panel interactions

**Step 2: Keyboard Bindings**
- Implement KeyBindings.ts
- Define keyboard shortcuts for all actions
- Add vim-style navigation
- Implement keyboard help overlay
- No command mode needed

**Step 3: Theme System**
- Create Themes.ts
- Define color schemes
- Add theme switcher (Ctrl+T)
- Apply themes to all views
- Include form styling

### Phase 9: Advanced Features

**Step 1: Project Management**
- Add project creation form (press 'n' in filter panel)
- Implement project editor with name, color, icon
- Add project statistics display
- Enable drag-and-drop todos between projects
- Add project archiving

**Step 2: Hierarchical Todos**
- Add subtask creation (press 'A' for add subtask)
- Implement tree rendering with indentation
- Add expand/collapse with arrow keys
- Show parent progress based on subtasks
- Enable indent/outdent actions

**Step 3: Bulk Operations**
- Add multi-select mode (Ctrl+Space to select)
- Show selection count in status bar
- Implement bulk actions menu
- Add bulk complete, delete, move to project
- Enable bulk priority/date changes

### Phase 10: Polish and Final Integration

**Step 1: User Experience**
- Add confirmation dialogs for destructive actions
- Implement undo/redo (Ctrl+Z/Ctrl+Y)
- Add context menus for right-click actions
- Create help overlay with all shortcuts
- Add tooltips for buttons

**Step 2: App Integration**
- Create app.ts entry point
- Initialize all components
- Set up event flow between components
- Add error handling with user-friendly messages
- Implement graceful shutdown

**Step 3: Data and Performance**
- Add auto-save functionality
- Implement data backup
- Add export/import via menu (not commands)
- Optimize rendering for large lists
- Add loading states for async operations

## Key Implementation Details

### Data Flow
1. User keyboard input → View captures → Controller processes → Model updates → Store persists → Event emitted → Views update

### Event Types
- `todo:created` - New todo added
- `todo:updated` - Todo modified
- `todo:deleted` - Todo removed
- `todo:completed` - Todo marked done
- `filter:changed` - Filter applied
- `focus:changed` - Panel focus switched
- `project:selected` - Project changed
- `sort:changed` - Sort order modified

### Keyboard Shortcuts (No Commands)
**Global Navigation**
- `Tab` / `Shift+Tab` - Switch between panels
- `Esc` - Cancel current action/close dialog
- `?` - Show help overlay
- `/` - Quick search in current panel
- `Ctrl+S` - Save immediately
- `Ctrl+Q` - Quit application

**Todo List Panel**
- `j`/`↓` - Move down
- `k`/`↑` - Move up
- `Space` - Toggle todo completion
- `Enter` - View details/edit
- `a` - Open "Add Todo" form
- `e` - Edit selected todo
- `d` - Delete todo (with confirmation)
- `p` - Cycle priority (Low→Med→High→Critical)
- `P` - Assign to project (opens project selector)
- `t` - Tag manager (add/remove tags)
- `D` - Set due date (opens date picker)
- `s` - Open sort menu
- `g g` - Jump to top
- `G` - Jump to bottom

**Filter Panel**
- `j`/`k` - Navigate filter options
- `Space` - Toggle filter on/off
- `Enter` - Apply filter
- `c` - Clear all filters
- `n` - Create new project/category
- `e` - Edit selected project/category
- `d` - Delete project/category

**Detail Panel**
- `e` - Enter edit mode
- `Tab` - Next field (in edit mode)
- `Shift+Tab` - Previous field
- `Enter` - Save changes
- `Esc` - Cancel editing

### Interactive GUI Elements

**Toolbar (Always visible below status bar)**
```
┌──────────────────────────────────────────────────────────────────────┐
│ [➕ Add] [✏️ Edit] [⭐ Priority] [📁 Project] [↕️ Sort] [📂 New Project] │
│ [✓ Complete] [🗑️ Delete] [🏷️ Tags] [📅 Due Date] [🔍 Search]         │
└──────────────────────────────────────────────────────────────────────┘
```

**Add Todo Form (Modal)**
```
┌─ Add New Todo ─────────────────────────────┐
│ Title: [________________]                  │
│ Description: [_________]                    │
│ Priority: (•) Low ( ) Med ( ) High         │
│ Project: [Select... ▼]                     │
│ Due Date: [____-__-__] [📅]                │
│ Tags: [#tag1] [#tag2] [+Add]               │
│                                            │
│ [✓ Save] [✗ Cancel]                        │
└────────────────────────────────────────────┘
```

**Context Menu (Right-click on todo)**
```
┌────────────────┐
│ ✓ Complete     │
│ ✏️ Edit        │
│ ⭐ Set Priority │
│ 📁 Move to...  │
│ 🏷️ Add Tags    │
│ 📅 Set Due Date│
│ 📋 Duplicate   │
│ ────────────   │
│ 🗑️ Delete      │
└────────────────┘
```

**Sort Menu (Dropdown from toolbar)**
```
┌─ Sort By ──────┐
│ ⬆ Priority     │
│ ⬇ Due Date     │
│   Created      │
│   Title A-Z    │
│   Status       │
└────────────────┘
```

### Storage Format
JSON file structure storing:
- Todos array
- Projects array
- Categories array
- User preferences
- Last modified timestamp

### Panel Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                            Status Bar                               │
├─────────────────────────────────────────────────────────────────────┤
│ [➕Add] [✏️Edit] [⭐Priority] [📁Project] [↕️Sort] [📂New] [🗑️Delete] │
├─────────┬──────────────────────────────┬────────────────────────────┤
│ Filter  │      Todo List               │      Detail                │
│ Panel   │                              │      Panel                 │
│         │ ☐ Task 1 (High) Due: Today   │                           │
│[Projects]│ ☑ Task 2 (Med)              │  Title: [Task 1]          │
│ > Work   │ ☐ Task 3 (Low)              │  Priority: [High ▼]       │
│   Personal│ > ☐ Task 4                 │  Project: [Work ▼]        │
│           │   ☐ Subtask 4.1            │  Due: [2024-01-15] [📅]   │
│[Categories]│   ☐ Subtask 4.2           │  Tags: [#urgent] [+]      │
│ > Important│                           │                           │
│   Later    │ (Click to select)         │  Description:             │
│            │ (Double-click to edit)    │  [___________________]    │
│[Tags]      │ (Right-click for menu)    │                           │
│ #urgent    │                           │  [✓Save] [✗Cancel]        │
│ #review    │                           │                           │
├─────────┴──────────────────────────────┴────────────────────────────┤
│ Search: [/________________________] 🔍   Type / to search            │
└──────────────────────────────────────────────────────────────────────┘
```

## GUI Interaction Examples

### Mouse-Driven Workflow

**Adding a Todo (Mouse)**
1. Click [➕ Add] button in toolbar
2. Fill form fields by clicking each field
3. Click dropdown arrows for project/priority
4. Click calendar icon for date picker
5. Click [✓ Save] to create todo

**Editing a Todo (Mouse)**
1. Double-click todo in list OR
2. Select todo and click [✏️ Edit] button
3. Detail panel becomes editable
4. Click any field to modify
5. Click [✓ Save] to apply changes

**Managing with Right-Click**
1. Right-click any todo for context menu
2. Select action from menu
3. Forms/dialogs open as needed

**Filtering (Mouse)**
1. Click checkboxes in filter panel
2. Click project/category names to filter
3. Click tags to toggle
4. List updates immediately

**Toolbar Actions**
- **[➕ Add]** - Opens new todo form
- **[✏️ Edit]** - Edits selected todo
- **[⭐ Priority]** - Opens priority selector
- **[📁 Project]** - Opens project assignment
- **[↕️ Sort]** - Shows sort dropdown
- **[📂 New Project]** - Creates new project
- **[✓ Complete]** - Toggles completion
- **[🗑️ Delete]** - Deletes with confirmation
- **[🏷️ Tags]** - Opens tag manager
- **[📅 Due Date]** - Opens date picker

### Keyboard Workflow (Alternative)

**Quick Add (Keyboard)**
1. Press `a` or `Ctrl+N` → Opens form
2. Type title, Tab to next field
3. Use arrow keys for selections
4. Press Enter to save

**Quick Edit (Keyboard)**
1. Select with j/k navigation
2. Press `e` to edit
3. Tab through fields
4. Enter to save

**Quick Actions**
- `Space` - Toggle completion
- `r` - Change priority
- `m` - Move to project
- `t` - Manage tags
- `d` - Set due date
- `s` - Sort options
- `x` - Delete todo
- `c` - Mark complete/incomplete
- `n` - New todo (when in list)
- `e` - Edit selected
- `f` - Jump to filter panel
- `v` - Jump to detail view
- `l` - Jump to list panel

## Quick Start Guide

### Initial Setup
```bash
# Create project
mkdir todo-manager && cd todo-manager
npm init -y

# Install dependencies
npm install blessed blessed-contrib uuid date-fns lodash
npm install -D typescript @types/node @types/blessed ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

### First Working Version Goals
1. Display a basic blessed screen
2. Show a simple todo list
3. Add new todos via command
4. Save/load from JSON file
5. Navigate with keyboard

### Incremental Milestones
- **Milestone 1**: Display static todo list
- **Milestone 2**: Add keyboard navigation
- **Milestone 3**: Implement add/delete commands
- **Milestone 4**: Add persistence
- **Milestone 5**: Add filtering
- **Milestone 6**: Add detail view
- **Milestone 7**: Full command system
- **Milestone 8**: Polish and optimize

## Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

## Summary

This implementation plan provides a clear path to building a functional terminal todo manager. Start with Phase 1 and work through each phase sequentially. Each phase builds on the previous one, gradually adding complexity while maintaining a working application.

The key is to:
1. Keep the initial implementation simple
2. Get a working version early
3. Add features incrementally
4. Maintain clean separation between MVC components
5. Use the event system for all communication

Focus on getting the core functionality working first, then enhance with advanced features. This approach ensures you always have a usable application while continuously improving it.