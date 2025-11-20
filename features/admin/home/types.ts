import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks/use-media-upload-state';

export interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
}

export interface AvailableProject {
  id: number;
  title: string;
  slug: string;
}

export type PreviewMode = 'desktop' | 'mobile';

type FeaturedSlots = readonly [
  FeaturedProject | undefined,
  FeaturedProject | undefined,
  FeaturedProject | undefined,
  FeaturedProject | undefined
];

type MediaUploadStates = readonly [MediaUploadState, MediaUploadState, MediaUploadState, MediaUploadState];
type MediaUploadActionsArray = readonly [MediaUploadActions, MediaUploadActions, MediaUploadActions, MediaUploadActions];

export interface HeroStateReturn {
  state: MediaUploadState;
  actions: MediaUploadActions;
}

export interface HeroHandlersReturn {
  handleSave: () => Promise<void>;
  handleReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
}

export interface FeaturedStateReturn {
  projects: FeaturedSlots;
  setProjects: (projects: FeaturedSlots) => void;
  initialProjects: FeaturedSlots;
  states: MediaUploadStates;
  actions: MediaUploadActionsArray;
  loadProjects: () => Promise<void>;
}

export interface FeaturedHandlersReturn {
  handleSelect: (index: number) => void;
  handleProjectSelect: (project: { id: string; title: string }) => void;
  handleRemove: (index: number) => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  selectorOpen: boolean;
  setSelectorOpen: (open: boolean) => void;
  selectedSlot: number | null;
  unselectedProjects: AvailableProject[];
}
