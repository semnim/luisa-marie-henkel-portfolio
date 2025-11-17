'use client';

import type { ProjectFormData } from '@/features/projects/actions/projects';
import {
  createProject,
  updateProject,
} from '@/features/projects/actions/projects';
import { CATEGORIES } from '@/lib/constants';
import { createSlugFromProjectTitle } from '@/lib/utils';
import {
  validatePublishedDate,
  validateTeamMember,
  validateTitle,
} from '@/lib/validation';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimatedBorderButton } from '../auth/animated-border-button';
import { AnimatedInput } from '../auth/animated-input';

interface ProjectDialogProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  projectId?: number;
  initialData: Partial<ProjectFormData> | null;
  onClose: () => void;
  onSave?: () => Promise<void>;
}

const getProjectFormDataWithDefaults = (
  initialData: Partial<ProjectFormData> | null
) => {
  return {
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'editorial',
    description: initialData?.description || '',
    client: initialData?.client || '',
    publishedAt: initialData?.publishedAt || '',
    team: initialData?.team || [],
  };
};
export function ProjectDialog({
  isOpen,
  mode,
  projectId,
  initialData,
  onClose,
  onSave,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>(
    getProjectFormDataWithDefaults(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(getProjectFormDataWithDefaults(initialData));
  }, [initialData]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: createSlugFromProjectTitle(value),
    }));
    clearFieldError('title');
  };

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { role: '', name: '' }],
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const updateTeamMember = (
    index: number,
    field: 'role' | 'name',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate title
    const titleError = validateTitle(formData.title);
    if (titleError) {
      newErrors.title = titleError;
    }

    // Validate team members
    formData.team.forEach((member, index) => {
      const memberErrors = validateTeamMember(member.role, member.name);
      if (memberErrors.role) {
        newErrors[`team.${index}.role`] = memberErrors.role;
      }
      if (memberErrors.name) {
        newErrors[`team.${index}.name`] = memberErrors.name;
      }
    });

    // Validate published date
    const dateError = validatePublishedDate(formData.publishedAt);
    if (dateError) {
      newErrors.publishedAt = dateError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});

    // Client-side validation
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call appropriate server action
      const result =
        mode === 'create'
          ? await createProject(formData)
          : await updateProject(projectId!, formData);

      if (result.success) {
        // Show success toast
        toast.success('Project saved!');

        // Call parent onSave callback to refresh data
        if (onSave) {
          await onSave();
        }

        // Close dialog immediately to avoid showing stale data
        onClose();

        // Reset state for next open
        setErrors({});
        setIsSubmitting(false);
      } else {
        // Map server errors to field errors
        const errorMap: Record<string, string> = {};
        result.errors?.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setErrors(errorMap);
        setIsSubmitting(false);

        // Show error toast for general errors
        if (errorMap._general) {
          toast.error(errorMap._general);
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const ErrorMessage = ({ field }: { field: string }) => {
    return errors[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-xl font-light tracking-item-subheading uppercase sticky top-0 bg-background z-10">
            {mode === 'create' ? 'CREATE PROJECT' : 'EDIT PROJECT'}
          </h2>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <AnimatedInput
                placeholder="Title*"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
              <ErrorMessage field="title" />
            </div>

            {/* Slug */}
            <AnimatedInput
              placeholder="Slug (generated)"
              value={formData.slug}
              className="text-muted-foreground"
              // onChange={(e) =>
              //   setFormData((prev) => ({ ...prev, slug: e.target.value }))
              // }
              disabled
              required
            />

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                Category*
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-transparent border-t border-muted-foreground pt-2 text-foreground font-light focus:outline-none focus:border-foreground transition-colors duration-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-background">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                Description
              </label>
              <textarea
                value={formData.description}
                placeholder="A background text describing this project..."
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  clearFieldError('description');
                }}
                rows={8}
                className="w-full bg-transparent border-t border-muted-foreground pt-2 text-foreground font-light resize-none focus:outline-none focus:border-foreground transition-colors duration-500"
              />
              <ErrorMessage field="description" />
            </div>

            {/* Client */}
            <div>
              <AnimatedInput
                placeholder="Magazine"
                value={formData.client}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, client: e.target.value }));
                  clearFieldError('client');
                }}
              />
              <ErrorMessage field="client" />
            </div>

            {/* Published Date */}
            <div>
              <AnimatedInput
                placeholder="Published Date"
                type="date"
                value={formData.publishedAt}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    publishedAt: e.target.value,
                  }));
                  clearFieldError('publishedAt');
                }}
              />
              <ErrorMessage field="publishedAt" />
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                  Team Members
                </label>
                <button
                  onClick={addTeamMember}
                  className="text-xs font-light tracking-item-subheading uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  + ADD
                </button>
              </div>
              {formData.team.map((member, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <AnimatedInput
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => {
                        updateTeamMember(index, 'role', e.target.value);
                        clearFieldError(`team.${index}.role`);
                      }}
                    />
                    <ErrorMessage field={`team.${index}.role`} />
                  </div>
                  <div className="flex-1">
                    <AnimatedInput
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => {
                        updateTeamMember(index, 'name', e.target.value);
                        clearFieldError(`team.${index}.name`);
                      }}
                    />
                    <ErrorMessage field={`team.${index}.name`} />
                  </div>
                  <button
                    onClick={() => removeTeamMember(index)}
                    className="text-red-500 hover:text-red-400 transition-colors flex items-start duration-300"
                  >
                    <X />
                  </button>
                </div>
              ))}
              {formData.team.length === 0 && (
                <p className="text-xs text-muted-foreground/50">
                  No team members added yet.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 bg-background pt-6 pb-3 fixed bottom-0 inset-x-0 w-full">
            <AnimatedBorderButton onClick={onClose} className="flex-1">
              CANCEL
            </AnimatedBorderButton>
            <AnimatedBorderButton
              onClick={handleSave}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}
