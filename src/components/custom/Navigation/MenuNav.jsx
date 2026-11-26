import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Menu } from '@jppinedo/lienzo';
import { Menu as MenuIcon } from 'react-feather';
import { AuthContext } from "@state/AuthContext";

/**
 * MenuNav — was MUI AppBar + IconButton + Menu/MenuItem anchored to the
 * button, with Firebase signOut. The dropdown is still the Lienzo Menu
 * molecule (positioned with Tailwind — Lienzo Menu has no anchor/popover
 * positioning, noted as a gap), with the mock AuthContext signOut.
 *
 * Layout fix: the trigger used to be a Lienzo Button in its default
 * icon+label layout with no label — Button reserves a right margin for
 * the (missing) label, so the hamburger sat off-center in a wide,
 * short pill jammed 5px from the corner. Lienzo has no IconButton
 * (DS gap), so the trigger is now a plain square button: 44×44,
 * fully rounded, icon dead-center, 12px from the top-right corner,
 * with the dropdown spaced below it by the flex gap.
 */
const MenuNav = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);

    // Should print null once logged out (mock auth: clears the demo user).
    async function handleLogout() {
        try {
            await signOut();
        } catch (error) {
            console.log(error)
        }
        setOpen(false);
        navigate("/login");
    }

    return (
        <div className="absolute top-3 right-3 z-50 flex flex-col items-end gap-2">
            <button
                type="button"
                aria-label="menu"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-pio-text border border-pio-grid shadow-[0_4px_14px_rgba(31,36,33,0.12)] cursor-pointer"
            >
                <MenuIcon size={21} aria-hidden="true" />
            </button>
            {open && (
                <Menu
                    items={[
                        {
                            label: { text: "Logout", type: "red" },
                            onClick: handleLogout,
                        },
                        {
                            label: { text: "Sell Book" },
                            onClick: () => {
                                setOpen(false);
                                navigate("/sell");
                            },
                        },
                    ]}
                    onClickOutside={() => setOpen(false)}
                />
            )}
        </div>
    )
}

export default MenuNav;
