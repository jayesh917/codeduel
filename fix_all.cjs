const fs = require('fs');

// 1. types
let backendTypes = fs.readFileSync('backend/src/types/index.ts', 'utf8');
backendTypes = backendTypes.replace('timerInterval?: NodeJS.Timeout;', 'timerInterval?: any;');
fs.writeFileSync('frontend/src/types/index.ts', backendTypes);

// 2. ui components
let avatar = fs.readFileSync('frontend/src/components/ui/Avatar.tsx', 'utf8');
if (!avatar.includes('src?: string;')) {
    avatar = avatar.replace('interface AvatarProps {', 'interface AvatarProps {\n  src?: string;\n  alt?: string;\n  className?: string;');
}
fs.writeFileSync('frontend/src/components/ui/Avatar.tsx', avatar);

let progress = fs.readFileSync('frontend/src/components/ui/ProgressBar.tsx', 'utf8');
if (!progress.includes('className?: string;')) {
    progress = progress.replace('interface ProgressBarProps {', 'interface ProgressBarProps {\n  className?: string;');
}
fs.writeFileSync('frontend/src/components/ui/ProgressBar.tsx', progress);

let toast = fs.readFileSync('frontend/src/components/ui/Toast.tsx', 'utf8');
if (!toast.includes('className?: string;')) {
    toast = toast.replace('interface ToastProps {', 'interface ToastProps {\n  className?: string;');
}
fs.writeFileSync('frontend/src/components/ui/Toast.tsx', toast);

// 3. React namespace
const replaceReactEvent = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/React\.FormEvent/g, 'React.FormEvent'); // wait, if React is missing...
    if (!content.includes("import React")) {
        content = "import React from 'react';\n" + content;
    }
    fs.writeFileSync(file, content);
}
replaceReactEvent('frontend/src/pages/CreateRoom.tsx');
replaceReactEvent('frontend/src/pages/JoinRoom.tsx');

// 4. ImportMeta env
let viteEnv = `/// <reference types="vite/client" />
`;
fs.writeFileSync('frontend/src/vite-env.d.ts', viteEnv);

console.log('Fixed');
