# Confirmation buttons for video deletion
_Exported on 21/04/2026 at 20:05:08 GMT+3 from Cursor (3.1.15)_

---

**User**

Confirmation buttons for deleting videos is out of place. It should be a modal.

---

**Cursor**


Searching the codebase for where video deletion and its confirmation are implemented.




Checking UI component patterns for consistency:




Creating `alert-dialog.tsx` and updating `VideoDeleteButton` to use it.




Here’s what changed:

### `components/ui/alert-dialog.tsx`
New wrapper around Radix **Alert Dialog** (from the existing `radix-ui` package), aligned with your other UI pieces: overlay, centered panel, header/footer layout, and default styles for title/description. `AlertDialogAction` / `AlertDialogCancel` reuse `buttonVariants` from your `Button` component.

### `components/VideoDeleteButton.tsx`
- Replaced the inline “Delete …? / Confirm / Cancel” row with an **alert dialog**.
- **Delete** opens the modal; **Cancel** uses `AlertDialogCancel`; **Delete video** is a destructive `Button` that runs the async `DELETE` (not `AlertDialogAction`, so the dialog only closes after a successful delete).
- Errors still show **inside** the modal; they clear when the dialog closes.
- Loading copy: **“Deleting…”** on the primary action while the request runs.

The card footer stays a single **Delete** control until the user confirms in the modal, so layout no longer shifts when confirming.

