'use client';

import { AnimatedBorderButton } from '../auth/animated-border-button';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95 overflow-y-auto">
      <div className="w-full max-w-2xl py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-xl font-light tracking-item-subheading uppercase mb-2">
              SELECT PROJECT
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              Choose a project to feature
            </p>
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
            <AnimatedBorderButton onClick={onClose} className="w-full">
              CANCEL
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}
