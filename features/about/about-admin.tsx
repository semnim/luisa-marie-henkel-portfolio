'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAboutContent } from './api/get-about-content';
import { useUpdateAboutParagraphs } from './api/update-about-paragraphs';

export const AboutAdmin = () => {
  const { data: content } = useAboutContent();
  const { mutate: updateParagraphs, isPending } = useUpdateAboutParagraphs({
    mutationConfig: {
      onSuccess: (result) => {
        if (result.success) {
          toast.success('About content saved successfully');
        } else {
          toast.error(result.errors?.[0]?.message || 'Failed to save');
        }
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to save');
      },
    },
  });

  // Initialize from prefetched/fetched data - content is available via HydrationBoundary
  const [paragraphs, setParagraphs] = useState<string[]>(
    () => content?.paragraphs ?? []
  );
  const [currentParagraph, setCurrentParagraph] = useState('');

  // Sync state when content updates (e.g., after save/invalidation)
  useEffect(() => {
    if (content?.paragraphs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParagraphs(content.paragraphs);
    }
  }, [content]);

  const handleAddParagraph = () => {
    if (currentParagraph.trim().length > 0) {
      setParagraphs((prev) => [...prev, currentParagraph]);
      setCurrentParagraph('');
    }
  };

  const handleDeleteParagraph = (index: number) => {
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateParagraph = (index: number, value: string) => {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const handleReset = () => {
    setParagraphs(content?.paragraphs || []);
    setCurrentParagraph('');
  };

  const handleSave = () => {
    const validParagraphs = paragraphs.filter((p) => p.trim().length > 0);
    if (validParagraphs.length === 0) {
      toast.error('At least one paragraph is required');
      return;
    }
    updateParagraphs(validParagraphs);
  };

  return (
    <div className="px-6 py-4 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-light tracking-item-subheading uppercase">
          ABOUT
        </h2>
        <div className="flex w-fit gap-3">
          <Button onClick={handleReset} disabled={isPending}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <div className="space-y-16">
        <div className="space-y-4">
          <Textarea
            placeholder="Write a new paragraph..."
            rows={5}
            value={currentParagraph}
            onChange={(e) => setCurrentParagraph(e.target.value)}
          />
          <Button
            onClick={handleAddParagraph}
            disabled={currentParagraph.trim().length === 0 || isPending}
          >
            ADD PARAGRAPH
          </Button>
        </div>
        <section className="space-y-6">
          {paragraphs.map((p, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-muted-foreground text-xs mb-2">
                Paragraph #{index + 1}
              </p>
              <Textarea
                placeholder="Write a paragraph..."
                rows={10}
                value={p}
                onChange={(e) => handleUpdateParagraph(index, e.target.value)}
              />
              <Button
                className="max-w-[150px] mt-2"
                onClick={() => handleDeleteParagraph(index)}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
