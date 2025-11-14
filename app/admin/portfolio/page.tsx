'use client';

import {
  deleteProject,
  fetchAllProjectsWithImages,
} from '@/app/actions/projects';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { GalleryManagementDialog } from '@/components/admin/gallery-management-dialog';
import { MediaManagementDialog } from '@/components/admin/media-management-dialog';
import { ProjectDialog } from '@/components/admin/project-dialog';
import { ProjectListItem } from '@/components/admin/project-list-item';
import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { Image, Project } from '@/lib/schema';
import { toPartial } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type PortfolioProjectItem = Project & {
  images: Image[];
  hasDesktopHero: boolean;
  hasMobileHero: boolean;
  hasDesktopThumb: boolean;
  hasMobileThumb: boolean;
  galleryCount: number;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProjectItem[]>([]);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectDialogMode, setProjectDialogMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProjectItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<PortfolioProjectItem | null>(null);

  const loadProjects = async () => {
    const projectsResponse = await fetchAllProjectsWithImages();
    const mappedProjects = projectsResponse.map((project) => ({
      ...project,
      hasDesktopHero: project.images.some(
        (image) =>
          image.imageType === 'project_hero' &&
          (image.variant === 'desktop' || image.variant === 'both')
      ),
      hasMobileHero: project.images.some(
        (image) =>
          image.imageType === 'project_hero' &&
          (image.variant === 'mobile' || image.variant === 'both')
      ),
      hasDesktopThumb: project.images.some(
        (image) =>
          image.imageType === 'thumbnail' &&
          (image.variant === 'desktop' || image.variant === 'both')
      ),
      hasMobileThumb: project.images.some(
        (image) =>
          image.imageType === 'thumbnail' &&
          (image.variant === 'mobile' || image.variant === 'both')
      ),
      galleryCount: project.images.filter((img) => img.imageType === 'gallery')
        .length,
    }));
    setProjects(mappedProjects);
    return mappedProjects;
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = () => {
    setProjectDialogMode('create');
    setSelectedProject(null);
    setProjectDialogOpen(true);
  };

  const handleEditMetadata = (project: PortfolioProjectItem) => {
    setProjectDialogMode('edit');
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleManageMedia = (project: PortfolioProjectItem) => {
    setSelectedProject(project);
    setMediaDialogOpen(true);
  };

  const handleManageGallery = (project: PortfolioProjectItem) => {
    setSelectedProject(project);
    setGalleryDialogOpen(true);
  };

  const handleDeleteProject = (project: PortfolioProjectItem) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    const result = await deleteProject(projectToDelete.id);

    if (result.success) {
      toast.success('Project deleted successfully');
      await loadProjects();
    } else {
      toast.error(result.error || 'Failed to delete project');
    }

    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="px-6 py-4 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <h1 className="text-xl mt-2 lg:mt-0 font-light tracking-item-subheading uppercase">
            PROJECTS
          </h1>
          <AnimatedBorderButton onClick={handleCreateProject}>
            CREATE NEW PROJECT
          </AnimatedBorderButton>
        </div>

        {/* Project List */}
        {projects.length > 0 ? (
          <div className="border border-muted-foreground/20">
            {projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onEditMetadata={() => handleEditMetadata(project)}
                onManageMedia={() => handleManageMedia(project)}
                onManageGallery={() => handleManageGallery(project)}
                onDelete={() => handleDeleteProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <p className="text-muted-foreground font-light">No projects yet</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ProjectDialog
        isOpen={projectDialogOpen}
        mode={projectDialogMode}
        projectId={selectedProject?.id}
        initialData={{
          ...toPartial(selectedProject),
          publishedAt:
            selectedProject?.publishedAt?.toISOString().split('T')[0] ?? '',
        }}
        onClose={() => setProjectDialogOpen(false)}
        onSave={async () => {
          await loadProjects();
        }}
      />

      <MediaManagementDialog
        isOpen={mediaDialogOpen}
        projectId={selectedProject?.id || 0}
        projectTitle={selectedProject?.title || ''}
        existingImages={selectedProject?.images || []}
        onClose={() => setMediaDialogOpen(false)}
        onSave={async () => {
          const freshProjects = await loadProjects();
          // Update selectedProject with fresh data
          if (selectedProject) {
            const updated = freshProjects.find(
              (p) => p.id === selectedProject.id
            );
            if (updated) setSelectedProject(updated);
          }
        }}
      />

      <GalleryManagementDialog
        isOpen={galleryDialogOpen}
        projectId={selectedProject?.id}
        projectTitle={selectedProject?.title || ''}
        images={selectedProject?.images || []}
        onClose={() => setGalleryDialogOpen(false)}
        onSave={async () => {
          const freshProjects = await loadProjects();
          // Update selectedProject with fresh data
          if (selectedProject) {
            const updated = freshProjects.find(
              (p) => p.id === selectedProject.id
            );
            if (updated) setSelectedProject(updated);
          }
          setGalleryDialogOpen(false);
        }}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        title="DELETE PROJECT"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="DELETE"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
