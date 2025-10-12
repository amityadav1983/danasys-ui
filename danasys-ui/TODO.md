# TODO: Implement "No More Manager" Action in Profile Manager Tab

## Steps to Complete

- [x] Update handleRemoveManager function in ManageProfile.tsx to call PUT API /api/user/noMoreManagerOfBusiness/{userProfileId}
- [x] Ensure userProfileId is fetched from getUserDetails and used in the API call
- [x] On successful API response, refetch the managed profiles to update the UI
- [x] Add proper error handling and user feedback for API failures
- [ ] Test the button click to verify the API call and UI update
