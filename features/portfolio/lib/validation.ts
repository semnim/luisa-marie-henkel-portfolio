export interface ValidationError {
  field: string;
  message: string;
}

export function validateTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  return null;
}

export function validateTeamMember(
  role: string,
  name: string
): { role: string | null; name: string | null } {
  return {
    role:
      !role || role.trim().length === 0
        ? 'Role is required'
        : null,
    name:
      !name || name.trim().length === 0
        ? 'Name is required'
        : null,
  };
}

export function validatePublishedDate(dateString: string): string | null {
  if (!dateString || dateString.length === 0) {
    return null; // Optional field
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  return null;
}
