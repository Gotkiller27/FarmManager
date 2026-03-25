# TODO: Enable User Profile & Password Update

## Steps:
- [ ] 1. Add profile columns to users table via DB migration
- [x] 2. Update backend/src/services/users.service.js: extend updateUser for profile fields + add changePassword function
- [x] 3. Update backend/src/controllers/users.controller.js: add changePassword controller
- [x] 4. Update backend/src/routes/users.routes.js: add route PUT /:id/password
- [x] 5. Update frontend/src/services/api.js: add updateProfile & changePassword functions
- [x] 6. Implement frontend/src/stores/profilStore.js: actions for load/update profile
- [x] 7. Update frontend/src/views/ProfileView.vue: integrate EditProfileModale save, add password change modal
- [ ] 8. Test functionality & complete

Current progress: TODO.md created (step 0/8)

