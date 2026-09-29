import { useState } from "react";

interface HelpTooltipProps {
  text: string;
}

function HelpTooltip({
  text,
}: HelpTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="help-tooltip">
      <button
        type="button"
        className="help-tooltip-button"
        aria-label="Help"
        onClick={() => {
          setOpen((previous) => !previous);
        }}
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >
        ?
      </button>

      {open && (
        <span className="help-tooltip-content">
          {text}
        </span>
      )}
    </span>
  );
}

export default HelpTooltip;