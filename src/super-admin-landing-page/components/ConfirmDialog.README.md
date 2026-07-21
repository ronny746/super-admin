# Modern Confirmation Dialog - Usage Guide

## Component Location
`/Users/abhishek/development/RFID-Admin-App/super-admin/src/components/ConfirmDialog.jsx`

## Features
- ✨ Modern gradient design with animations
- 🎨 4 types: danger, warning, success, info
- 🌈 Color-coded icons and buttons
- 💫 Smooth fade and scale animations
- 🎯 Backdrop blur effect
- 📱 Fully responsive

## Usage Example

### 1. Import the Component
```javascript
import ConfirmDialog from "../components/ConfirmDialog";
```

### 2. Add State
```javascript
const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning"
});
```

### 3. Trigger Dialog
```javascript
const handleDelete = (id) => {
    setConfirmDialog({
        isOpen: true,
        title: "Delete Item",
        message: "Are you sure you want to delete this item? This action cannot be undone.",
        type: "danger",
        onConfirm: async () => {
            // Your delete logic here
            await deleteItem(id);
            toast.success("Item deleted!");
        }
    });
};
```

### 4. Render Component
```javascript
<ConfirmDialog
    isOpen={confirmDialog.isOpen}
    onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
    onConfirm={confirmDialog.onConfirm}
    title={confirmDialog.title}
    message={confirmDialog.message}
    type={confirmDialog.type}
    confirmText="Delete"
    cancelText="Cancel"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Controls dialog visibility |
| `onClose` | function | required | Called when dialog should close |
| `onConfirm` | function | required | Called when user confirms |
| `title` | string | "Confirm Action" | Dialog title |
| `message` | string | "Are you sure...?" | Dialog message |
| `type` | string | "warning" | Dialog type (danger/warning/success/info) |
| `confirmText` | string | "Confirm" | Confirm button text |
| `cancelText` | string | "Cancel" | Cancel button text |

## Dialog Types

### Danger (Red)
For destructive actions like delete, remove
```javascript
type: "danger"
```

### Warning (Yellow)
For actions that need caution
```javascript
type: "warning"
```

### Success (Green)
For positive confirmations
```javascript
type: "success"
```

### Info (Blue)
For informational confirmations
```javascript
type: "info"
```

## Replace Browser `confirm()`

### Before:
```javascript
if (confirm("Delete this?")) {
    await deleteItem();
}
```

### After:
```javascript
setConfirmDialog({
    isOpen: true,
    title: "Delete Item",
    message: "Delete this?",
    type: "danger",
    onConfirm: async () => {
        await deleteItem();
    }
});
```
