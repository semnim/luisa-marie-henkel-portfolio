'use client';

import { CATEGORIES } from '@/lib/constants';
import { X } from 'lucide-react';
import { useState } from 'react';
import { AnimatedBorderButton } from '../auth/animated-border-button';
import { AnimatedInput } from '../auth/animated-input';

interface TeamMember {
  role: string;
  name: string;
}

interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  client: string;
  publishedAt: string;
  team: TeamMember[];
}

interface ProjectDialogProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Partial<ProjectFormData>;
  onClose: () => void;
  onSave?: (data: ProjectFormData) => void;
}

export function ProjectDialog({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'web',
    description: initialData?.description || '',
    client: initialData?.client || '',
    publishedAt: initialData?.publishedAt || '',
    team: initialData?.team || [],
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-xl font-light tracking-item-subheading uppercase">
            {mode === 'create' ? 'CREATE PROJECT' : 'EDIT PROJECT'}
          </h2>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <AnimatedInput
              placeholder="Title*"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />

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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full bg-transparent border-t border-muted-foreground pt-2 text-foreground font-light resize-none focus:outline-none focus:border-foreground transition-colors duration-500"
              />
            </div>

            {/* Client */}
            <AnimatedInput
              placeholder="Magazine"
              value={formData.client}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client: e.target.value }))
              }
            />

            {/* Published Date */}
            <AnimatedInput
              placeholder="Published Date"
              type="date"
              value={formData.publishedAt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  publishedAt: e.target.value,
                }))
              }
            />

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
                      onChange={(e) =>
                        updateTeamMember(index, 'role', e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <AnimatedInput
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(index, 'name', e.target.value)
                      }
                    />
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
          <div className="flex gap-3 pt-6">
            <AnimatedBorderButton onClick={onClose} className="flex-1">
              CANCEL
            </AnimatedBorderButton>
            <AnimatedBorderButton
              onClick={() => onSave?.(formData)}
              className="flex-1"
            >
              SAVE
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}
