# TODO: Fix businessUserProfileId in holdOrderPayload

## Tasks:
- [x] Add businessProfileId to cart state to track current business
- [x] Modify addItem reducer to clear cart if adding product from different business
- [x] Update holdOrderPayload to use state.businessProfileId instead of fallback
- [x] Fix fallback values from 0 to 1 for userBusinessProfileId
- [ ] Test the changes to ensure orders are placed correctly only for same business products
