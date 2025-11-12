'use client';

import Image from 'next/image';
import { Plus, Pencil, X } from 'lucide-react';

interface FeaturedProject {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

interface FeaturedProjectCardProps {
  project?: FeaturedProject;
  onSelect?: () => void;
  onRemove?: () => void;
}

export function FeaturedProjectCard({
  project,
  onSelect,
  onRemove,
}: FeaturedProjectCardProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <button
      onClick={onSelect}
      className={`relative w-full aspect-[4/3] bg-background border ${
        project
          ? 'border-muted-foreground/40'
          : 'border-dashed border-muted-foreground/40'
      } transition-colors duration-300 overflow-hidden group cursor-pointer`}
    >
      {/* Content */}
      {project ? (
        <>
          {project.thumbnailUrl && (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          )}
          {/* Project Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-3">
            <p className="text-xs font-light tracking-item-subheading uppercase text-foreground truncate">
              {project.title}
            </p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-light tracking-item-subheading uppercase text-muted-foreground">
            SELECT PROJECT
          </span>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        {project ? (
          <Pencil className="w-12 h-12 text-foreground" strokeWidth={1} />
        ) : (
          <Plus className="w-12 h-12 text-foreground" strokeWidth={1} />
        )}
      </div>

      {/* Remove Button */}
      {project && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-3 right-3 p-2 bg-background/90 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 hover:text-background z-10"
          aria-label="Remove project"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </button>
  );
}
