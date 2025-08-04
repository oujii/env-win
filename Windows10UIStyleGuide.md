
# Windows 10 UI Style Guide

## Overview

This comprehensive guide provides the necessary code and guidelines to implement a Windows 10-inspired UI in your application.

## 1. CSS Base Setup

### Color Variables and Global Styles

```css
:root {
  /* Windows 10 colors */
  --win-bg-main: #f0f0f0;
  --win-bg-header: #dfdfdf;
  --win-bg-secondary: #e0e0e0;
  --win-bg-hover: #e5e5e5;
  --win-bg-white: #ffffff;
  --win-bg-active: #cce8ff;
  --win-bg-selected: #0078d7;
  
  /* Border colors */
  --win-border: #aaaaaa;
  --win-border-input: #7a7a7a;
  
  /* Text colors */
  --win-text: #000000;
  --win-text-secondary: #606060;
  --win-text-selected: #ffffff;
  --win-text-muted: #888888;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--win-bg-main);
  color: var(--win-text);
  font-size: 12px;
}
```

## 2. Tailwind Configuration

Add these colors to your `tailwind.config.ts`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'win-bg': {
          main: '#f0f0f0',
          header: '#dfdfdf',
          secondary: '#e0e0e0',
          hover: '#e5e5e5',
          white: '#ffffff',
          active: '#cce8ff',
          selected: '#0078d7'
        },
        'win-border': {
          DEFAULT: '#aaaaaa',
          input: '#7a7a7a'
        },
        'win-text': {
          DEFAULT: '#000000',
          secondary: '#606060',
          selected: '#ffffff',
          muted: '#888888'
        }
      }
    }
  }
}
```

## 3. Component Styles

### Window Container

```jsx
const WindowContainer = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0078d7]">
    <div className="flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa]">
        <span className="text-sm font-medium text-black">{title}</span>
      </div>
      
      {children}
    </div>
  </div>
);
```

### Buttons

```jsx
// Primary Button (Blue)
<button className="px-6 py-1 bg-[#0078d7] text-white hover:bg-[#106ebe] border border-[#0078d7] text-xs">
  Save
</button>

// Secondary Button (Gray)
<button className="px-4 py-1 border border-[#adadad] bg-[#e1e1e1] hover:bg-[#e5e5e5] text-xs">
  Cancel
</button>
```

### Form Inputs

```jsx
// Text Input
<input 
  type="text" 
  className="w-full p-1 text-xs border border-[#7a7a7a] outline-none" 
  placeholder="Enter text"
/>

// Select Dropdown
<select className="w-full p-1 text-xs border border-[#7a7a7a] outline-none">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## 4. Custom Scrollbar

```css
.windows-scrollbar::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.windows-scrollbar::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.windows-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cdcdcd;
  border: 2px solid #f0f0f0;
  border-radius: 0;
}
```

## 5. VS Code-Inspired Layout Template

```jsx
<div className="flex flex-col bg-[#f0f0f0] shadow-xl border border-[#aaaaaa]">
  {/* Title Bar */}
  <div className="flex items-center justify-between px-2 py-1 bg-[#dfdfdf] border-b border-[#aaaaaa]">
    <span>Application Title</span>
  </div>

  {/* Tabs Bar */}
  <div className="flex bg-[#f0f0f0] border-b border-[#aaaaaa]">
    {/* Tab buttons */}
  </div>

  {/* Main Content Area */}
  <div className="flex flex-1 overflow-hidden">
    {/* Left Sidebar */}
    <div className="w-[220px] border-r border-[#aaaaaa] bg-[#f8f8f8]">
      {/* Sidebar content */}
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-3 overflow-hidden">
        {/* Main content area */}
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#e0e0e0] border-t border-[#aaaaaa] text-xs">
        <div>Status info</div>
      </div>
    </div>
  </div>
</div>
```

## Additional Tips

1. Use the `windows-scrollbar` class for Windows-style scrollbars
2. Stick to the color palette defined in the variables
3. Use 'Segoe UI' font for authenticity
4. Keep font sizes small (around 12px)

## Compatibility

- Tested with React
- Works best with Tailwind CSS
- Requires modern browser support

## License

Feel free to use and adapt this style guide in your projects!
