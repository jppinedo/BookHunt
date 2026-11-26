import React from "react";

/**
 * InfoBox — a one-line hint, not a form element.
 *
 * Was a Lienzo Card: white fill, border, shadow and a fully rounded pill
 * shape made the hint ("Click on a book to start finding deals!") read as
 * another text input sitting under the real search box. It is now plain
 * text rendered directly on the page background — icon plus type — so
 * the only input-looking element on the page is the actual search
 * field. (Lienzo has no dedicated hint/callout atom; using Card for
 * prose was the misuse.) D1: on the light Lienzo surface the hint is
 * muted dark text with a coral icon, not white shadowed type.
 */
const InfoBox = ({ icon: IconElement, content }) => {
  return (
    <p className="flex items-center justify-center gap-2 max-w-[600px] mx-auto my-3 px-4 text-center text-[15px] font-medium leading-snug text-pio-text-muted">
      <IconElement size={19} style={{ flexShrink: 0 }} className="text-pio-coral" aria-hidden="true" />
      <span>{content}</span>
    </p>
  )
}

export default InfoBox;
