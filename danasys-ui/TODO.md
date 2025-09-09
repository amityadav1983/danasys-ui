# TODO: Implement Switch to User Mode Functionality

## Completed Tasks
- [x] Updated `src/store/mode.ts` to persist the mode in localStorage when setMode is called.
- [x] Modified `src/components/UserProfile.tsx` to make the "Switch to User" button always visible in business mode (removed the `showDropdown` condition).
- [x] The button dispatches `setMode('user')` and navigates to '/' to switch to user mode and go to the categories/product list page.

## Summary
The "Switch to User" button in the UserProfile component now:
- Is always visible when in business mode.
- Switches the mode to 'user' and persists it in localStorage.
- Navigates to the home page ('/'), which displays the categories and product list in user mode.
- Prevents mode switching via the toggle button in business mode (as the toggle is hidden in BusinessHeader).

## Testing
- Click the "Switch to User" button in business mode.
- Verify that the mode switches to 'user'.
- Verify that the page navigates to the home page with categories and products.
- Verify that refreshing the page maintains the 'user' mode.
