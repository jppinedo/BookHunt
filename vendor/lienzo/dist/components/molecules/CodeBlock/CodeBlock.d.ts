import React from 'react';
import { type Language } from 'prism-react-renderer';
export interface CodeBlockProps {
    code: string;
    filename?: string;
    language?: Language;
    className?: string;
    /** Syntax pane only. Independent of the app/Storybook theme. Default dark. */
    codeMode?: 'dark' | 'light';
}
declare const CodeBlock: React.FC<CodeBlockProps>;
export default CodeBlock;
