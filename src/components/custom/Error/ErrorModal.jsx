import React from "react";
import { Button, Card, Title } from '@jppinedo/lienzo';
import { AlertCircle } from "react-feather";

/**
 * ErrorModal — was MUI Dialog (Lienzo has NO Dialog: DS gap).
 * Rebuilt as a small custom modal from Lienzo primitives (fixed overlay +
 * Card + Title + Button). Candidate new Lienzo molecule: Dialog/Modal.
 */
const ErrorModal = ({ showError, error, onClose }) => {
  if (!showError) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="max-w-[480px] w-[90%]">
        <Card>
          <div className="flex items-center gap-4 mb-3">
            <AlertCircle size={32} color="#ff2424" aria-hidden="true" />
            <Title size="lg" id="alert-dialog-title">{"Something went wrong"}</Title>
          </div>
          <div id="alert-dialog-description">
            {"An unexpected error occurred. Please try again later."}
            {error?.message && <div>{`Error: ${error.message}`}</div>}
            {error?.code && <div>{`Code: ${error.code}`}</div>}
          </div>
          <div className="flex justify-end mt-4">
            <Button label="Close" onClick={onClose} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ErrorModal;
