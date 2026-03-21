# What's Changed?

## Unrealesed    

### V1.0.0
- initialize project
- donwloading and installing modules 

### V1.0.1
- added components.vue to view all the components in pages/components.vue
- added NavbarUser.vue SidebarAdmin.vue in components/layout/
- added Button.vue Icon.vue in components/nav/
- added Button.vue components/ui/

### V1.0.2
- added Category.vue, Status.vue, Select.vue, and Date.vue in components/ui/dropdown/
- added Category.vue, Status.vue, Select.vue, and Date.vue in pages/components.vue
- modified Button.vue Icon.vue in components/nav/
- modified NavbarUser.vue SidebarAdmin.vue in components/layout/

### V1.0.3
- added useApi.ts for API base URL 
- added auth.ts for fetching and guest middleware
- added login and register pages

### V1.0.4
- added index for landing page
- added user dashboard in pages/user/index.vue
- added useAspiration.ts
- added layouts (default.vue and guest.vue)
- added middleware (auth.vue)
- added Card in components/ui/

### V1.0.5
- added aspiration/create in pages/user/
- added aspiration/list-page in pages/user/
- added new input property
- added Checkbox and FileUpload in components/ui/
- modified all dropdown ui components

### V1.0.6
- added aspiration/detail/[id] in pages/user/
- added contants.ts in utils for Tos and Privacy Policy data
- added modal in components/ui
- added StatusTimeline in components/ui
- added FilePreviewModal in components/ui

### V1.0.7
- added useFilterPagination.ts and useNotification.ts
- added markAllAsRead in useNotification.ts
- added filter and pagination in useAspiration.ts
- added Pagination.vue in components/ui/dropdown/
- added History Page in user/aspiration/
- added Notification Page in user/
- added videos folder in assets/
- modified Landing page with new video for background

### V1.0.8
- added export excel in user/aspiration/list-page and user/aspiration/history 
- added export pdf in user/aspiration/detail/[id]
- added exportAspirationsExcel, exportAspirationHistoriesExcel, and exportAspirationPDF in useAspiration.ts

### V1.0.9
- added Profile Page in user/profile