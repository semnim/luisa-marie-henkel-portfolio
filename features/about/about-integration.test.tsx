import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AboutAdmin } from './about-admin';
import * as actions from './actions';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock server actions
vi.mock('./actions', () => ({
  fetchAboutContent: vi.fn(),
  updateAboutParagraphs: vi.fn(),
}));

describe('AboutAdmin Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.mocked(actions.fetchAboutContent).mockResolvedValue({
      paragraphs: ['Test paragraph 1', 'Test paragraph 2'],
    });

    vi.mocked(actions.updateAboutParagraphs).mockResolvedValue({
      success: true,
    });
  });

  it('should load and display paragraphs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Paragraph #1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph #2')).toBeInTheDocument();
    });

    // Verify paragraph content is in textareas
    const textareas = screen.getAllByPlaceholderText('Write a paragraph...');
    expect(textareas[0]).toHaveValue('Test paragraph 1');
    expect(textareas[1]).toHaveValue('Test paragraph 2');
  });

  it('should add a new paragraph', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByPlaceholderText('Write a new paragraph...'));

    const input = screen.getByPlaceholderText('Write a new paragraph...');
    await user.type(input, 'New paragraph');

    const addButton = screen.getByText('ADD PARAGRAPH');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Paragraph #3')).toBeInTheDocument();
    });

    // Verify the new paragraph is in the list
    const textareas = screen.getAllByPlaceholderText('Write a paragraph...');
    expect(textareas[2]).toHaveValue('New paragraph');

    // Verify input is cleared
    expect(input).toHaveValue('');
  });

  it('should edit existing paragraph', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Paragraph #1'));

    const textareas = screen.getAllByPlaceholderText('Write a paragraph...');
    const firstParagraph = textareas[0];

    // Clear and type new content
    await user.clear(firstParagraph);
    await user.type(firstParagraph, 'Updated paragraph');

    expect(firstParagraph).toHaveValue('Updated paragraph');
  });

  it('should delete a paragraph', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Paragraph #1'));

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    // First paragraph should be gone, second becomes first
    await waitFor(() => {
      const textareas = screen.getAllByPlaceholderText('Write a paragraph...');
      expect(textareas).toHaveLength(1);
      expect(textareas[0]).toHaveValue('Test paragraph 2');
    });
  });

  it('should reset changes to original content', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Paragraph #1'));

    // Edit a paragraph
    const textareas = screen.getAllByPlaceholderText('Write a paragraph...');
    await user.clear(textareas[0]);
    await user.type(textareas[0], 'Modified content');

    expect(textareas[0]).toHaveValue('Modified content');

    // Reset
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);

    // Should revert to original
    await waitFor(() => {
      const resetTextareas = screen.getAllByPlaceholderText('Write a paragraph...');
      expect(resetTextareas[0]).toHaveValue('Test paragraph 1');
    });
  });

  it('should save paragraphs successfully', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Save'));

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(actions.updateAboutParagraphs).toHaveBeenCalled();
      const callArgs = vi.mocked(actions.updateAboutParagraphs).mock.calls[0];
      expect(callArgs[0]).toEqual(['Test paragraph 1', 'Test paragraph 2']);
    });
  });

  it('should filter out empty paragraphs when saving', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Paragraph #1'));

    // Delete first paragraph using delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(actions.updateAboutParagraphs).toHaveBeenCalled();
      const callArgs = vi.mocked(actions.updateAboutParagraphs).mock.calls[0];
      expect(callArgs[0]).toEqual(['Test paragraph 2']);
    });
  });

  it('should show error when trying to save with no valid paragraphs', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Paragraph #1'));

    // Delete all paragraphs
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    await user.click(deleteButtons[0]); // After first delete, the second becomes first

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalledWith('At least one paragraph is required');
    expect(actions.updateAboutParagraphs).not.toHaveBeenCalled();
  });

  it('should disable buttons while saving', async () => {
    const user = userEvent.setup();

    // Make mutation pending by not resolving immediately
    let resolveMutation: (value: any) => void;
    const mutationPromise = new Promise((resolve) => {
      resolveMutation = resolve;
    });

    vi.mocked(actions.updateAboutParagraphs).mockReturnValue(
      mutationPromise as any
    );

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Save'));

    const saveButton = screen.getByRole('button', { name: /save/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });
    const addButton = screen.getByRole('button', { name: /add paragraph/i });

    await user.click(saveButton);

    // Buttons should be disabled
    await waitFor(() => {
      expect(saveButton).toHaveTextContent('Saving...');
      expect(saveButton).toBeDisabled();
      expect(resetButton).toBeDisabled();
    });

    // Add button should also be disabled when pending
    expect(addButton).toBeDisabled();

    // Resolve mutation
    resolveMutation!({ success: true });

    // Buttons should be enabled again
    await waitFor(() => {
      expect(saveButton).toHaveTextContent('Save');
      expect(saveButton).toBeEnabled();
      expect(resetButton).toBeEnabled();
    });
  });

  it('should show success toast on successful save', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Save'));

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('About content saved successfully');
    });
  });

  it('should show error toast on save failure', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    vi.mocked(actions.updateAboutParagraphs).mockResolvedValue({
      success: false,
      errors: [{ field: 'paragraphs', message: 'Validation error' }],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Save'));

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Validation error');
    });
  });

  it('should disable add button when input is empty', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByRole('button', { name: /add paragraph/i }));

    const addButton = screen.getByRole('button', { name: /add paragraph/i });
    expect(addButton).toBeDisabled();
  });

  it('should enable add button when input has content', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <AboutAdmin />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByPlaceholderText('Write a new paragraph...'));

    const input = screen.getByPlaceholderText('Write a new paragraph...');
    const addButton = screen.getByText('ADD PARAGRAPH');

    await user.type(input, 'Some content');

    expect(addButton).toBeEnabled();
  });
});
