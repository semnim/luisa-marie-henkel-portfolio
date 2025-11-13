# Project Media Management Design

**Date:** 2025-11-13
**Status:** Approved
**Feature:** Admin manage hero and thumbnail images for projects

## Overview

Enable admins to upload/replace hero and thumbnail images for projects through the existing Media Management Dialog UI. Reuses gallery management patterns for Cloudinary integration and database operations.

## Constraints

1. **Variant Logic:**
   - Single upload (desktop OR mobile) → `variant='both'` (applies to both)
   - Dual upload (desktop AND mobile) → separate rows `variant='desktop'` and `variant='mobile'`

2. **Deletion Timing:**
   - Delete old images from Cloudinary only on save (not preview/cancel)
   - Best-effort deletion (log errors, continue on failure)

3. **Save Granularity:**
   - Independent `handleSaveHero` and `handleSaveThumbnail` buttons
   - Shared server action with different parameters

## Architecture

### Three-Layer Design

**1. Server Action Layer** (`app/actions/project-media-actions.ts`):
```typescript
saveProjectMedia(
  projectId: number,
  mediaType: 'project_hero' | 'thumbnail',
  files: { desktop?: File, mobile?: File }
) → { success: boolean, error?: string, uploadedImages?: Image[] }
```

**2. Utility Layer** (reuse existing `lib/cloudinary-utils.ts`):
- `uploadImageToCloudinary()` - file validation, upload, progress
- `deleteImagesFromCloudinary()` - batch deletion with failure tracking

**3. Database Layer** (extend `lib/image-repository.ts`):
- `getProjectMediaImages(projectId, mediaType)` - fetch current images
- `insertProjectMediaImages(projectId, mediaType, images)` - bulk insert
- `deleteProjectMediaImages(imageIds)` - delete by ID array

### Data Flow

```
UI Handler → saveProjectMedia()
  ↓
Validate files (size, format)
  ↓
Fetch existing images from DB
  ↓
Upload new files to Cloudinary
  ↓
Delete old images from Cloudinary (best-effort)
  ↓
Delete old DB rows
  ↓
Insert new DB rows with correct variant
  ↓
Return success/error
```

## Variant Logic Implementation

```typescript
if (files.desktop && files.mobile) {
  // Upload both separately
  uploadDesktop → { variant: 'desktop', url: desktopUrl }
  uploadMobile → { variant: 'mobile', url: mobileUrl }
  // Result: 2 DB rows
} else if (files.desktop || files.mobile) {
  // Upload single file
  uploadFile → { variant: 'both', url: fileUrl }
  // Result: 1 DB row
}
```

### Edge Cases

| Scenario | Old State | New State | Action |
|----------|-----------|-----------|--------|
| Replace 'both' with dual | 1 row (variant='both') | 2 rows (desktop + mobile) | Delete 1, insert 2 |
| Replace dual with 'both' | 2 rows (desktop + mobile) | 1 row (variant='both') | Delete 2, insert 1 |
| Replace dual with dual | 2 rows | 2 rows | Delete 2, insert 2 |
| Cloudinary deletion fails | - | - | Log warning, continue |

## UI Integration

### Component: `MediaManagementDialog`

**File:** `components/admin/media-management-dialog.tsx`

**Handler Implementation:**
```typescript
handleSaveHero = async () => {
  setHeroLoading(true)

  const files = {
    desktop: heroState.desktop.file,
    mobile: heroState.mobile.file
  }

  const result = await saveProjectMedia(projectId, 'project_hero', files)

  if (result.success) {
    toast.success('Hero images saved')
    resetHeroState()
    onRefresh()
  } else {
    toast.error(result.error)
  }

  setHeroLoading(false)
}

handleSaveThumbnail = async () => {
  // Same pattern for 'thumbnail' mediaType
}
```

**State Management:**
- Reuse existing `useMediaUploadState` hook
- Track loading per media type (hero vs thumbnail)
- Optimistic UI updates after save
- Reset file inputs after successful save

**User Flow:**
1. Upload file(s) via `MediaUploadBox` → preview shows immediately
2. Click "Save Hero" or "Save Thumbnail" → loading spinner
3. Success → toast notification, state reset, parent refresh
4. Error → error toast, state preserved for retry

## Error Handling

### File Validation Errors
- File size > 1.5MB → `{ success: false, error: 'File too large' }`
- Invalid format → `{ success: false, error: 'Only JPEG/PNG/WebP allowed' }`
- No files provided → `{ success: false, error: 'No files selected' }`

### Upload Failures
- Cloudinary upload fails → `{ success: false, error: 'Upload failed: [reason]' }`
- DB insert fails → `{ success: false, error: 'Database error' }`

### Deletion Failures (Best-Effort)
- Cloudinary deletion fails → log warning, continue with DB operations
- DB deletion fails → rollback transaction, return error

## Testing Strategy

### Unit Tests
- Variant logic (both vs desktop/mobile determination)
- File validation (size, format)
- Edge case handling (replace both with dual, etc.)

### Integration Tests
- Server action with mocked Cloudinary
- Database transaction rollback on errors
- Multiple upload scenarios

### Manual UI Tests
- Upload single desktop → saves as 'both'
- Upload single mobile → saves as 'both'
- Upload both → saves as separate variants
- Replace existing 'both' with dual upload
- Replace existing dual with 'both'
- File validation error messages
- Loading states
- Success/error toasts

## Implementation Checklist

- [ ] Create `project-media-actions.ts` with `saveProjectMedia()`
- [ ] Extend `image-repository.ts` with DB functions
- [ ] Wire handlers in `MediaManagementDialog`
- [ ] Add loading states for save buttons
- [ ] Add success/error toast notifications
- [ ] Test variant logic edge cases
- [ ] Test file validation
- [ ] Test Cloudinary upload/delete
- [ ] Manual UI testing

## Success Criteria

1. Admins can upload hero images (desktop, mobile, or both)
2. Admins can upload thumbnail images (desktop, mobile, or both)
3. Single upload applies to both variants (`variant='both'`)
4. Dual upload creates separate desktop/mobile variants
5. Old images deleted from Cloudinary on save
6. Error messages clear and actionable
7. Loading states prevent double-saves
8. Toast notifications confirm success/failure
