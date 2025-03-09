export const nextjsTemplates: { [key: string]: string } = {
	// Next.js App Templates
	"page.tsx": `import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Page Title</h1>
    </div>
  );
}`,
	"layout.tsx": `import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My Site',
    default: 'My Site',
  },
  description: 'Site description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          {/* Header content */}
        </header>
        <main>{children}</main>
        <footer>
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}`,
	"loading.tsx": `export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}`,
	"error.tsx": `'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}`,
	"not-found.tsx": `import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find the requested resource</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Return Home
      </Link>
    </div>
  );
}`,
	"route.ts": `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from API route' });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json({ received: data });
}`,
	"component.tsx": `'use client';

import React, { useState } from 'react';

interface ComponentProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Component({ title = 'Default Title', children }: ComponentProps) {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className={isActive ? 'bg-gray-100 p-2 rounded' : ''}>
        {children}
      </div>
      <button 
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
}`,
	"server-component.tsx": `import React from 'react';

interface ServerComponentProps {
  data?: any;
}

export default async function ServerComponent({ data }: ServerComponentProps) {
  const fetchedData = data || await fetchData();
  
  return (
    <div className="server-rendered">
      <h3 className="text-lg font-medium mb-2">Server Component</h3>
      <pre className="bg-gray-100 p-2 rounded text-sm">
        {JSON.stringify(fetchedData, null, 2)}
      </pre>
    </div>
  );
}

async function fetchData() {
  return { message: 'This data was fetched on the server' };
}`,
	"middleware.ts": `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-middleware-cache', 'no-cache');
  
  const basicAuth = request.headers.get('authorization');
  if (!basicAuth) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: {
          'content-type': 'application/json',
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      }
    );
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};`,
	"actions.ts": `'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function submitForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return {
      errors: { _form: ['Failed to submit the form. Please try again.'] },
      success: false,
    };
  }
}

export async function loginAction(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const success = await authenticateUser(email, password);
  
  if (!success) {
    return { error: 'Invalid credentials' };
  }
  
  redirect('/dashboard');
}

async function authenticateUser(email: string, password: string): Promise<boolean> {
  return true;
}`,
	"fetchers.ts": `import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  const res = await fetch(\`https://api.example.com/users/\${id}\`, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return res.json();
});

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  
  return response.json();
}

function getAuthToken() {
  return 'token';
}`,
	"providers.tsx": `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = { id: '1', name: 'User', email };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}`,
	// Project configuration and utility templates
	"package.json": `{
  "name": "nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.22.2",
    "next": "15.0.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@types/node": "^20.11.19",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "15.0.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}`,
	"postcss.config.js": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
	"tsconfig.json": `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
	"globals.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.5% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
	".env.local": `# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# API Keys
NEXT_PUBLIC_ANALYTICS_ID=

# Database
DATABASE_URL=

# External Services
API_BASE_URL=https://api.example.com`,
};

// Helper function to convert TypeScript to JavaScript (simplistic)
function convertTsxToJsx(tsCode: string): string {
	return tsCode
		.replace(/: [A-Za-z<>\[\]|]+/g, "")
		.replace(/<[A-Za-z]+>/g, "")
		.replace(/interface [^{]+{[^}]+}/g, "")
		.replace(/import {[^}]+} from ['"]next['"];/g, "import next from 'next';");
}

export function getNextJsTemplate(fileName: string): string | undefined {
	const baseName = fileName.split("/").pop() || fileName;

	if (nextjsTemplates[baseName]) {
		return nextjsTemplates[baseName];
	}

	if (baseName === "page.js" && nextjsTemplates["page.tsx"]) {
		return convertTsxToJsx(nextjsTemplates["page.tsx"]);
	}

	if (
		baseName.endsWith(".tsx") &&
		!baseName.includes(".") &&
		nextjsTemplates["component.tsx"]
	) {
		const componentTemplate = nextjsTemplates["component.tsx"];
		const componentName = baseName.replace(".tsx", "");
		return componentTemplate.replace(
			/function Component/g,
			`function ${componentName}`
		);
	}

	return undefined;
}

export function registerNextJsTemplates(settings: any) {
	// Add all Next.js templates to the defaultTemplates
	Object.keys(nextjsTemplates).forEach((key) => {
		settings.defaultTemplates[key] = nextjsTemplates[key];
	});

	const originalGetTemplateFunction = settings.getTemplateForFile;

	settings.getTemplateForFile = (fileName: string): string => {
		const nextjsTemplate = getNextJsTemplate(fileName);
		if (nextjsTemplate) {
			return nextjsTemplate;
		}
		return originalGetTemplateFunction
			? originalGetTemplateFunction(fileName)
			: "";
	};
}

// Next.js Project Structure Templates

export function getBasicNextJsStructure(): string {
	return `app/
├── page.tsx
├── layout.tsx
├── not-found.tsx
├── error.tsx
├── loading.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── hero.tsx
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── next.config.js
└── tailwind.config.js`;
}

export function getFullStackNextJsStructure(): string {
	return `app/
├── page.tsx
├── layout.tsx
├── not-found.tsx
├── error.tsx
├── loading.tsx
├── api/
│   ├── auth/
│   │   └── route.ts
│   ├── users/
│   │   └── route.ts
│   └── products/
│       └── route.ts
├── auth/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── layout.tsx
│   └── loading.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── dropdown.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   └── dashboard/
│       └── stats-card.tsx
├── lib/
│   ├── utils.ts
│   ├── api.ts
│   ├── db.ts
│   └── auth.ts
├── middleware.ts
├── providers.tsx
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── next.config.js
├── tailwind.config.js
└── .env.local`;
}

export function getNextJsDashboardStructure(): string {
	return `app/
├── page.tsx
├── layout.tsx
├── not-found.tsx
├── error.tsx
├── loading.tsx
├── api/
│   ├── auth/
│   │   └── route.ts
│   ├── stats/
│   │   └── route.ts
│   └── users/
│       └── route.ts
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── reports/
│       ├── page.tsx
│       ├── daily/
│       │   └── page.tsx
│       └── monthly/
│           └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   └── tabs.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── charts/
│   │   ├── bar-chart.tsx
│   │   ├── line-chart.tsx
│   │   └── pie-chart.tsx
│   └── dashboard/
│       ├── stats-card.tsx
│       ├── recent-activity.tsx
│       └── data-table.tsx
├── lib/
│   ├── utils.ts
│   ├── api.ts
│   ├── db.ts
│   └── auth.ts
├── actions/
│   ├── user-actions.ts
│   └── report-actions.ts
├── middleware.ts
├── providers.tsx
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── next.config.js
├── tailwind.config.js
└── .env.local`;
}

export function getNextJsBlogStructure(): string {
	return `app/
├── page.tsx
├── layout.tsx
├── not-found.tsx
├── error.tsx
├── loading.tsx
├── about/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── blog/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── [slug]/
│       ├── page.tsx
│       └── loading.tsx
├── api/
│   ├── posts/
│   │   └── route.ts
│   └── comments/
│       └── route.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   ├── post-content.tsx
│   │   ├── post-header.tsx
│   │   └── comment-section.tsx
│   └── common/
│       ├── social-share.tsx
│       └── newsletter-signup.tsx
├── lib/
│   ├── utils.ts
│   ├── mdx.ts
│   └── api.ts
├── content/
│   └── posts/
│       ├── hello-world.mdx
│       └── getting-started.mdx
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── next.config.js
├── tailwind.config.js
└── .env.local`;
}
