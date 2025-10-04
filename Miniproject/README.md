# Next.js Project with Shadcn UI

A modern Next.js application built with TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

- **Next.js 15** - The React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful and accessible UI components
- **Dark Mode Support** - Built-in dark/light theme support
- **Responsive Design** - Mobile-first responsive design

## 📦 Components Included

This project includes all 49 Shadcn UI components:

- **Layout & Navigation**: Accordion, Breadcrumb, Navigation Menu, Pagination, Tabs, Sidebar
- **Forms**: Button, Input, Textarea, Checkbox, Radio Group, Select, Switch, Slider, Form, Input OTP
- **Feedback**: Alert, Alert Dialog, Dialog, Toast, Progress, Skeleton, Sonner
- **Data Display**: Table, Card, Avatar, Badge, Separator, Calendar, Chart, Carousel
- **Overlays**: Popover, Tooltip, Hover Card, Sheet, Drawer
- **Menus**: Dropdown Menu, Context Menu, Menubar
- **Media**: Aspect Ratio, Resizable
- **Interactive**: Toggle, Toggle Group, Collapsible, Command, Scroll Area

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd miniproject
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind and Shadcn variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/
│   └── ui/                # Shadcn UI components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── button.tsx
│       └── ... (all 49 components)
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
└── lib/
    └── utils.ts           # Utility functions
```

## 🎨 Customization

### Theme Customization

The project uses CSS variables for theming. You can customize colors in `src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Adding New Components

To add new Shadcn UI components, you can use the CLI:

```bash
npx shadcn@latest add <component-name>
```

Or manually add components to `src/components/ui/`.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Toasts**: Sonner
- **Carousel**: Embla Carousel
- **Calendar**: React Day Picker

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives



