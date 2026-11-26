import React, { useEffect, useRef, useState } from 'react';
import { Highlight, type Language } from 'prism-react-renderer';
import { Copy } from 'react-feather';
import Card from '../../atoms/Card/Card';
import {
  codeBlockBar,
  codeBlockBarMeta,
  codeBlockBodyBase,
  codeBlockBodyMode,
  codeBlockCopy,
  codeBlockCopyCopied,
  codeBlockFilename,
  codeBlockPaneFill,
  codeBlockPre,
  codeBlockPrismThemeDark,
  codeBlockPrismThemeLight,
} from './CodeBlockStyles';

export interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: Language;
  className?: string;
  /** Syntax pane only. Independent of the app/Storybook theme. Default dark. */
  codeMode?: 'dark' | 'light';
}

const COPY_RESET_MS = 2200;

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  filename,
  language,
  className,
  codeMode = 'dark',
}) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prismTheme =
    codeMode === 'light' ? codeBlockPrismThemeLight : codeBlockPrismThemeDark;
  const paneStyle: React.CSSProperties = {
    backgroundColor: codeBlockPaneFill[codeMode],
  };
  const bodyClass = `${codeBlockBodyBase} ${codeBlockBodyMode[codeMode]} ${codeBlockPre}`;

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  const body = language ? (
    <Highlight theme={prismTheme} code={code.trimEnd()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => {
        return (
          <pre className={bodyClass} style={{ ...style, ...paneStyle }}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        );
      }}
    </Highlight>
  ) : (
    <pre className={bodyClass} style={paneStyle}>
      <code>{code.trimEnd()}</code>
    </pre>
  );

  return (
    <Card padded={false} surface="transparent" className={className}>
      <div className={codeBlockBar}>
        <div className={codeBlockBarMeta}>
          {filename ? <span className={codeBlockFilename}>{filename}</span> : null}
        </div>
        <button
          type="button"
          className={`${codeBlockCopy} ${copied ? codeBlockCopyCopied : ''}`.trim()}
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy snippet'}
        >
          <Copy size={14} aria-hidden="true" />
          <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
        </button>
      </div>
      {body}
    </Card>
  );
};

export default CodeBlock;
