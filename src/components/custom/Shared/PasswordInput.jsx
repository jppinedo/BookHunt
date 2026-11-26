import React, { useState } from 'react';
import { Input } from "@jppinedo/lienzo";
import { Eye, EyeOff } from 'react-feather';

/**
 * PasswordInput — U5: Lienzo Input with a show/hide password toggle.
 *
 * Lienzo Input (D1) takes htmlType, so the field itself is the DS
 * primitive at the standard 48px height; this wrapper adds the eye
 * toggle the audit asked for. The eye glyph rides in Input's own
 * right-icon slot (so the text never runs underneath it), and a real
 * 44×48px button is overlaid on that slot — the glyph alone is a div
 * in Lienzo and not clickable. The label is rendered here (with
 * htmlFor) rather than via Input's label prop so the overlay can be
 * positioned against the field box alone, not the label + field stack.
 */
const PasswordInput = ({ id, label, value, onChange, hint, placeholder, autoComplete }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-gray-700 font-jakarta text-sm font-medium"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <Input
                    id={id}
                    htmlType={visible ? "text" : "password"}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    hint={hint}
                    icon={visible ? <EyeOff /> : <Eye />}
                    iconPosition="right"
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="absolute top-0 right-0 flex h-12 w-11 cursor-pointer items-center justify-center border-0 bg-transparent"
                >
                    {/* The visible glyph is Input's icon above; this button
                        is the ≥44px click target over it. */}
                    <span className="sr-only">{visible ? "Hide password" : "Show password"}</span>
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
