# CLAUDE.md - ReTracker AI Assistant Guide

## Project Overview

**ReTracker** is a personal expense tracking application designed to help users monitor and manage their financial transactions and spending patterns.

### Current State
- **Status**: Initial planning phase
- **Repository Created**: December 2025
- **Tech Stack**: To be determined
- **Implementation**: Not yet started

### Project Goals
- Track personal expenses with categorization
- Provide spending insights and analytics
- Simple, intuitive user interface
- Data persistence and export capabilities
- Privacy-focused (personal use application)

## Repository Structure

### Recommended Directory Layout
When implementing, follow this structure:

```
ReTracker/
├── .github/              # GitHub workflows, issue templates
├── docs/                 # Additional documentation
├── src/                  # Source code
│   ├── components/       # UI components (if web/mobile)
│   ├── services/         # Business logic, API clients
│   ├── models/           # Data models/schemas
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── tests/            # Test files
├── public/               # Static assets (if web app)
├── scripts/              # Build and deployment scripts
├── .gitignore            # Git ignore patterns
├── README.md             # User-facing documentation
├── CLAUDE.md             # This file - AI assistant guide
└── [config files]        # package.json, requirements.txt, etc.
```

## Technology Stack Recommendations

### Options to Consider

#### Option 1: Web Application (React + Node.js)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (local) or PostgreSQL
- **Testing**: Jest, React Testing Library
- **Build**: Vite or Create React App

#### Option 2: Desktop Application (Electron)
- **Framework**: Electron + React
- **Database**: SQLite (local storage)
- **UI**: React with component library
- **Packaging**: electron-builder

#### Option 3: Mobile Application
- **Framework**: React Native or Flutter
- **Local Storage**: AsyncStorage, SQLite
- **Navigation**: React Navigation

#### Option 4: Python CLI/GUI
- **Framework**: Flask (web) or Tkinter/PyQt (desktop)
- **Database**: SQLite
- **Testing**: pytest
- **Package Management**: pip, poetry

**Decision Point**: Consult with the user before selecting a technology stack.

## Development Workflow

### Initial Setup
1. Choose technology stack with user
2. Initialize project configuration (package.json, .gitignore, etc.)
3. Set up directory structure
4. Configure linting and formatting tools
5. Set up testing framework
6. Create initial documentation

### Feature Development Process
1. **Plan**: Break down features into tasks
2. **Design**: Document data models and API contracts
3. **Implement**: Write code following conventions
4. **Test**: Add unit and integration tests
5. **Document**: Update relevant documentation
6. **Commit**: Use conventional commit messages
7. **Review**: Verify changes before pushing

### Git Workflow
- **Main Branch**: `main` - stable, production-ready code
- **Feature Branches**: `claude/[session-id]` format for AI-assisted development
- **Commits**: Use conventional commits (feat:, fix:, docs:, refactor:, test:)
- **Push Strategy**: Always use `git push -u origin <branch-name>`
- **Never**: Force push or rewrite history on shared branches

## Code Conventions

### General Principles
- **KISS**: Keep It Simple, Stupid - avoid over-engineering
- **DRY**: Don't Repeat Yourself - extract common patterns
- **YAGNI**: You Aren't Gonna Need It - only build what's needed now
- **Single Responsibility**: Each module/function should do one thing well

### Code Style
- Use consistent indentation (2 or 4 spaces, configure in project)
- Meaningful variable and function names
- Keep functions small and focused (< 50 lines ideally)
- Add comments only for complex logic, not obvious code
- Prefer self-documenting code over excessive comments

### File Naming
- **Components**: PascalCase (e.g., `ExpenseList.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Tests**: Match source file with `.test` or `.spec` suffix
- **Constants**: UPPER_SNAKE_CASE in dedicated files

### Error Handling
- Always validate user input at system boundaries
- Use try-catch for expected errors
- Log errors with context
- Provide user-friendly error messages
- Don't catch errors you can't handle

### Security Considerations
- Sanitize all user inputs
- Use parameterized queries (prevent SQL injection)
- Validate data types and ranges
- Store sensitive data securely (never commit credentials)
- Follow OWASP Top 10 guidelines

## Data Model Guidelines

### Core Entities (Recommended)

#### Expense
```
- id: unique identifier
- amount: decimal/float
- category: string or foreign key
- date: timestamp
- description: string
- payment_method: string (cash, card, etc.)
- tags: array/list (optional)
- receipt: file path or URL (optional)
```

#### Category
```
- id: unique identifier
- name: string
- color: string (hex code)
- icon: string or icon reference
- parent_id: foreign key (for subcategories)
```

#### Budget
```
- id: unique identifier
- category_id: foreign key
- amount: decimal
- period: string (monthly, weekly, etc.)
- start_date: date
- end_date: date (optional)
```

## Testing Standards

### Test Coverage Goals
- **Unit Tests**: 70%+ coverage for business logic
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main application workflows

### Test Organization
- Colocate tests with source files or in `__tests__` directories
- Name tests clearly: `describe('feature')` and `it('should do something')`
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Keep tests independent and idempotent

### What to Test
- Business logic functions
- Data validation
- Edge cases and error conditions
- User interactions (if UI)
- API endpoints (if backend)

## Documentation Standards

### Code Documentation
- JSDoc/docstrings for public APIs
- README for each major module
- Inline comments for complex algorithms
- Type definitions (TypeScript, type hints, etc.)

### User Documentation
- README.md: Project overview, setup, usage
- CONTRIBUTING.md: How to contribute (if open source)
- CHANGELOG.md: Version history and changes
- API.md: API documentation (if applicable)

### AI Assistant Documentation
- CLAUDE.md: This file - keep updated as project evolves
- Document architectural decisions
- Maintain list of known issues and TODOs
- Track technology choices and rationales

## AI Assistant Guidelines

### When Working on This Project

#### DO:
- ✓ Read existing code before modifying
- ✓ Follow established patterns and conventions
- ✓ Use TodoWrite to track multi-step tasks
- ✓ Write tests for new features
- ✓ Update documentation when making changes
- ✓ Ask clarifying questions when requirements are unclear
- ✓ Use semantic commit messages
- ✓ Validate changes before committing
- ✓ Keep solutions simple and focused

#### DON'T:
- ✗ Add features not explicitly requested
- ✗ Over-engineer solutions
- ✗ Commit without testing
- ✗ Make breaking changes without discussion
- ✗ Add unnecessary dependencies
- ✗ Skip error handling
- ✗ Leave TODO comments without tracking them
- ✗ Modify code you haven't read

### Decision Making
- **Architectural Decisions**: Always consult user
- **Technology Choices**: Present options, get approval
- **Breaking Changes**: Discuss impact first
- **New Dependencies**: Justify necessity
- **Refactoring**: Only when requested or clearly beneficial

### Communication
- Be concise and clear
- Explain technical decisions
- Highlight potential issues early
- Provide file paths with line numbers (e.g., `src/utils/format.ts:42`)
- Use markdown formatting for readability

## Development Phases

### Phase 1: Foundation (Current)
- [ ] Choose technology stack
- [ ] Initialize project structure
- [ ] Set up development environment
- [ ] Configure linting and formatting
- [ ] Set up testing framework
- [ ] Create basic documentation

### Phase 2: Core Features
- [ ] Implement data models
- [ ] Create database schema
- [ ] Build expense CRUD operations
- [ ] Add category management
- [ ] Implement data persistence

### Phase 3: User Interface
- [ ] Design UI/UX
- [ ] Build main dashboard
- [ ] Create expense entry forms
- [ ] Implement expense list view
- [ ] Add filtering and search

### Phase 4: Analytics
- [ ] Generate spending reports
- [ ] Create visualizations (charts/graphs)
- [ ] Implement budget tracking
- [ ] Add spending insights

### Phase 5: Enhancements
- [ ] Data export functionality
- [ ] Receipt attachments
- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Mobile responsiveness

## Common Tasks

### Adding a New Feature
1. Create task list with TodoWrite
2. Read relevant existing code
3. Design data model if needed
4. Implement core logic with tests
5. Add UI components if applicable
6. Update documentation
7. Commit with descriptive message
8. Push to feature branch

### Fixing a Bug
1. Reproduce the issue
2. Identify root cause
3. Write test that fails
4. Fix the bug
5. Verify test passes
6. Check for similar issues
7. Commit fix

### Refactoring
1. Ensure existing tests pass
2. Make incremental changes
3. Run tests after each change
4. Update documentation if needed
5. Commit refactoring separately from features

## Configuration Files Reference

### Essential Files to Create

**.gitignore**
- Node modules, build artifacts
- Environment files (.env)
- IDE settings
- OS-specific files
- Database files (for local dev)

**package.json** (if Node.js)
- Dependencies and devDependencies
- Scripts (start, build, test, lint)
- Project metadata

**tsconfig.json** (if TypeScript)
- Strict mode enabled
- Target ES2020+
- Module resolution settings

**eslint/prettier** (recommended)
- Enforce code style
- Catch common errors
- Consistent formatting

## Resources

### Learning Resources
- Expense tracking best practices
- Financial data modeling
- Privacy and security for financial apps
- UI/UX for financial applications

### Similar Projects (for inspiration)
- Mint
- YNAB (You Need A Budget)
- Splitwise
- GnuCash

## Change Log

### 2025-12-23
- Initial CLAUDE.md created
- Project structure and guidelines defined
- Development phases outlined
- Ready for technology stack selection

---

**Last Updated**: 2025-12-23
**Project Status**: Planning Phase
**Next Step**: Choose technology stack and initialize project structure
