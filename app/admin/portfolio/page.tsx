'use client';

import { fetchAllProjectsWithImages } from '@/app/actions/projects';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { GalleryManagementDialog } from '@/components/admin/gallery-management-dialog';
import { MediaManagementDialog } from '@/components/admin/media-management-dialog';
import { ProjectDialog } from '@/components/admin/project-dialog';
import { ProjectListItem } from '@/components/admin/project-list-item';
import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { Project } from '@/lib/schema';
import { toPartial } from '@/lib/utils';
import { useEffect, useState } from 'react';

export type PortfolioProjectItem = Project & {
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

  useEffect(() => {
    async function loadProjects() {
      const projectsResponse = await fetchAllProjectsWithImages();
      const mappedProjects = projectsResponse.map((project) => ({
        ...project,
        hasDesktopHero: project.images.some(
          (image) =>
            image.imageType === 'project_hero' && image.variant === 'desktop'
        ),
        hasMobileHero: project.images.some(
          (image) =>
            image.imageType === 'project_hero' && image.variant === 'mobile'
        ),
        hasDesktopThumb: project.images.some(
          (image) =>
            image.imageType === 'thumbnail' && image.variant === 'desktop'
        ),
        hasMobileThumb: project.images.some(
          (image) =>
            image.imageType === 'thumbnail' && image.variant === 'mobile'
        ),
        galleryCount: project.images.length,
      }));
      setProjects(mappedProjects);
      console.log(mappedProjects);
    }
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

  const confirmDelete = () => {
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
        initialData={{
          ...toPartial(selectedProject),
          publishedAt: selectedProject?.publishedAt?.toISOString() ?? '',
        }}
        onClose={() => setProjectDialogOpen(false)}
        onSave={(data) => {
          console.log('Save project:', data);
          setProjectDialogOpen(false);
        }}
      />

      <MediaManagementDialog
        isOpen={mediaDialogOpen}
        projectTitle={selectedProject?.title || ''}
        onClose={() => setMediaDialogOpen(false)}
        onSave={(media) => {
          console.log('Save media:', media);
          setMediaDialogOpen(false);
        }}
      />

      <GalleryManagementDialog
        isOpen={galleryDialogOpen}
        projectTitle={selectedProject?.title || ''}
        images={[
          {
            id: '1',
            filename: 'project-hero.jpg',
            url: 'https://placehold.co/800x600',
          },
          {
            id: '2',
            filename: 'detail-shot-1.jpg',
            url: 'https://placehold.co/800x600',
          },
        ]}
        onClose={() => setGalleryDialogOpen(false)}
        onUpload={() => console.log('Upload gallery images')}
        onRemove={(id) => console.log('Remove image', id)}
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
