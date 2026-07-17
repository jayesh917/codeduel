const fs = require('fs');

let avatar = fs.readFileSync('frontend/src/components/ui/Avatar.tsx', 'utf8');
avatar = avatar.replace('export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {', 'export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {\n  src?: string;\n  alt?: string;\n  className?: string;');
fs.writeFileSync('frontend/src/components/ui/Avatar.tsx', avatar);

let progress = fs.readFileSync('frontend/src/components/ui/ProgressBar.tsx', 'utf8');
progress = progress.replace('export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {', 'export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {\n  className?: string;');
fs.writeFileSync('frontend/src/components/ui/ProgressBar.tsx', progress);

let toast = fs.readFileSync('frontend/src/components/ui/Toast.tsx', 'utf8');
toast = toast.replace('export interface ToastProps extends HTMLAttributes<HTMLDivElement> {', 'export interface ToastProps extends HTMLAttributes<HTMLDivElement> {\n  className?: string;');
fs.writeFileSync('frontend/src/components/ui/Toast.tsx', toast);

