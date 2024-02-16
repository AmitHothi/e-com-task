import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge tailwind classes
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export default cn;
