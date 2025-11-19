'use client';

import type { ProjectFormData } from '@/features/portfolio/actions/create-project';
import {
  createProject,
  updateProject,
} from '@/features/portfolio/actions/create-project';
import { CATEGORIES } from '@/lib/constants';
import { createSlugFromProjectTitle } from '@/lib/utils';
import {
  validatePublishedDate,
  validateTeamMember,
  validateTitle,
} from '@/features/portfolio/lib/validation';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
      <div className="w-full overflow-y-auto max-h-dvh px-6">
        <div className="space-y-6 container mx-auto">
          {/* Header */}
          <h2 className="text-xl font-light tracking-item-subheading uppercase sticky top-0 bg-background z-10 pt-4">
            {mode === 'create' ? 'CREATE PROJECT' : 'EDIT PROJECT'}
          </h2>

          <div className="space-y-6 mb-30">
            <div className="space-y-6 lg:gap-4 lg:grid lg:grid-cols-2">
              <div className="space-y-2 relative">
                <div className="flex justify-between">
                  <Label
                    htmlFor="title"
                    className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground"
                  >
                    Title*
                  </Label>
                  <p className="absolute top-10 right-0 text-sm font-light lowercase text-muted-foreground">
                    {formData.slug}
                  </p>
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />

                <ErrorMessage field="title" />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground"
                >
                  Category*
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
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
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="description"
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
              />
              <ErrorMessage field="description" />
            </div>

            {/* Client */}
            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-4">
              <div>
                <div className="space-y-2">
                  <Label
                    htmlFor="magazine"
                    className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground"
                  >
                    Magazine
                  </Label>
                  <Input
                    id="magazine"
                    placeholder="Magazine"
                    value={formData.client}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        client: e.target.value,
                      }));
                      clearFieldError('client');
                    }}
                  />
                </div>
                <ErrorMessage field="client" />
              </div>

              {/* Published Date */}
              <div>
                <div className="space-y-2">
                  <Label
                    htmlFor="published_date"
                    className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground"
                  >
                    Published Date
                  </Label>
                  <Input
                    id="published_date"
                    placeholder={'Published Date'}
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
                </div>
                <ErrorMessage field="publishedAt" />
              </div>
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
                <div
                  key={index}
                  className="flex gap-3 items-start border-b pb-8 border-border p-2"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-center">
                      <p className="text-muted-foreground tracking-widest text-xs">
                        TEAM MEMBER #{index + 1}
                      </p>
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="ml-auto flex-0 min-w-4 text-red-500 hover:text-red-400 transition-colors flex items-start h-full duration-300 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <Label
                          htmlFor={`role_${index}`}
                          className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground mb-2"
                        >
                          Role
                        </Label>
                        <Input
                          id={`role_${index}`}
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
                        <Label
                          htmlFor={`team_member_name_${index}`}
                          className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground mb-2"
                        >
                          Name
                        </Label>
                        <Input
                          id={`team_member_name_${index}`}
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => {
                            updateTeamMember(index, 'name', e.target.value);
                            clearFieldError(`team.${index}.name`);
                          }}
                        />
                        <ErrorMessage field={`team.${index}.name`} />
                      </div>
                    </div>
                  </div>
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
          <div className="flex justify-center gap-3 bg-background pt-3 pb-3 fixed bottom-0 inset-x-0 w-full">
            <Button onClick={onClose} className="flex-1">
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
