# Design System

Design System for the Home Renovation Project Tracker, integrated with **Material UI**.

## Structure

```
design-system/
├── tokens.ts      # Design tokens (colors, typography, spacing, etc.)
├── index.ts       # Main exports
└── README.md      # This documentation

lib/
└── theme.ts       # Material UI theme configuration
```

## Usage

### Material UI Theme

The design system is integrated with Material UI through `lib/theme.ts`. The theme is automatically applied via the `ThemeProvider` in `components/providers.tsx`.

```tsx
import { Button, Card, TextField, Typography } from '@mui/material';

// Primary button (green)
<Button variant="contained" color="primary">
  Create Job
</Button>

// Secondary button (blue)
<Button variant="contained" color="secondary">
  View Details
</Button>

// Outlined button
<Button variant="outlined">
  Cancel
</Button>

// Card component
<Card sx={{ p: 3 }}>
  <Typography variant="h5">Job Title</Typography>
  <Typography variant="body1">Job description...</Typography>
</Card>

// Text field
<TextField label="Email" variant="outlined" fullWidth />
```

### Import tokens directly

You can also import tokens directly for custom styling:

```typescript
import { designTokens } from "@/design-system";

// Use colors
const primaryColor = designTokens.colors.primary[500]; // #00a862

// Use spacing
const padding = designTokens.spacing.lg; // 1.5rem
```

## Color Palette

### Primary (Green)

| Token           | Value   | Usage                      |
| --------------- | ------- | -------------------------- |
| `primary.main`  | #00a862 | Main brand color           |
| `primary.light` | #4dc493 | Light variant              |
| `primary.dark`  | #00663e | Dark variant, hover states |

### Secondary (Blue)

| Token             | Value   | Usage             |
| ----------------- | ------- | ----------------- |
| `secondary.main`  | #0075ff | Secondary actions |
| `secondary.light` | #4da7ff | Light variant     |
| `secondary.dark`  | #0045b3 | Dark variant      |

### Semantic Colors

| Color     | Value   | Usage          |
| --------- | ------- | -------------- |
| `success` | #22c55e | Success states |
| `warning` | #f59e0b | Warning states |
| `error`   | #ef4444 | Error states   |
| `info`    | #3b82f6 | Info states    |

### Neutral (Grays)

- `grey.50` (#fafafa) to `grey.900` (#171717)

## Components

### Buttons

```tsx
// Contained (filled)
<Button variant="contained" color="primary">Primary</Button>
<Button variant="contained" color="secondary">Secondary</Button>
<Button variant="contained" color="error">Delete</Button>

// Outlined
<Button variant="outlined">Cancel</Button>

// Text
<Button variant="text">Learn More</Button>
```

### Cards

```tsx
<Card>
  <CardContent>
    <Typography variant="h6">Card Title</Typography>
    <Typography variant="body2" color="text.secondary">
      Card content goes here
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Action</Button>
  </CardActions>
</Card>
```

### Form Fields

```tsx
<TextField
  label="Email"
  variant="outlined"
  fullWidth
  error={hasError}
  helperText={errorMessage}
/>

<TextField
  label="Description"
  variant="outlined"
  multiline
  rows={4}
  fullWidth
/>
```

### Status Chips

```tsx
import { Chip } from '@mui/material';

<Chip label="Planning" color="info" size="small" />
<Chip label="In Progress" color="warning" size="small" />
<Chip label="Completed" color="success" size="small" />
<Chip label="Canceled" color="error" size="small" />
```

### Alerts

```tsx
import { Alert } from '@mui/material';

<Alert severity="success">Job created successfully!</Alert>
<Alert severity="error">Failed to save changes.</Alert>
<Alert severity="warning">This action cannot be undone.</Alert>
<Alert severity="info">New updates available.</Alert>
```

## Typography

| Variant | Size     | Weight | Usage            |
| ------- | -------- | ------ | ---------------- |
| `h1`    | 3rem     | 700    | Page titles      |
| `h2`    | 2.25rem  | 700    | Section titles   |
| `h3`    | 1.875rem | 600    | Subsections      |
| `h4`    | 1.5rem   | 600    | Card titles      |
| `h5`    | 1.25rem  | 600    | Smaller headings |
| `h6`    | 1.125rem | 600    | Labels           |
| `body1` | 1rem     | 400    | Body text        |
| `body2` | 0.875rem | 400    | Secondary text   |

```tsx
<Typography variant="h4" gutterBottom>
  Welcome Back
</Typography>
<Typography variant="body1" color="text.secondary">
  Here's what's happening with your projects.
</Typography>
```

## Spacing

Material UI uses an 8px spacing scale. Use the `sx` prop or theme spacing:

```tsx
// Using sx prop
<Box sx={{ p: 2, m: 1, gap: 2 }}>
  {/* p: 2 = 16px, m: 1 = 8px */}
</Box>

// Using theme.spacing
<Box sx={{ padding: theme => theme.spacing(2) }}>
  Content
</Box>
```

| Value | Pixels |
| ----- | ------ |
| 1     | 8px    |
| 2     | 16px   |
| 3     | 24px   |
| 4     | 32px   |
| 5     | 40px   |

## Dark Mode

A dark theme variant is available in `lib/theme.ts`:

```tsx
import { darkTheme } from "@/lib/theme";

<ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
```
