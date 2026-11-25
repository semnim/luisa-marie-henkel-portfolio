'use client';

import {
  FullscreenDialog,
  FullscreenDialogDescription,
  FullscreenDialogTitle,
} from '@/components/ui/fullscreen-dialog';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  slug: string;
}

interface ProjectSelectorDialogProps {
  isOpen: boolean;
  projects: Project[];
  onClose: () => void;
  onSelect: (project: Project) => void;
}

export function ProjectSelectorDialog({
  isOpen,
  projects,
  onClose,
  onSelect,
}: ProjectSelectorDialogProps) {
  return (
    <FullscreenDialog open={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <FullscreenDialogTitle className="text-xl font-light tracking-item-subheading uppercase mb-2">
              SELECT PROJECT
            </FullscreenDialogTitle>
            <FullscreenDialogDescription className="text-sm text-muted-foreground font-light">
              Choose a project to feature
            </FullscreenDialogDescription>
          </div>

          {/* Project List */}
          {projects.length > 0 ? (
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelect(project)}
                  className="w-full px-6 py-4 border border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors duration-300 text-left"
                >
                  <p className="text-sm font-light tracking-item-subheading uppercase">
                    {project.title}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm font-light">
              No projects available
            </div>
          )}

          {/* Actions */}
          <div className="pt-6">
            <Button onClick={onClose} className="w-full">
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    </FullscreenDialog>
  );
}
