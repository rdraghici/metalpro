/**
 * Saved BOM Projects API
 *
 * Mock implementation using localStorage
 */

import type { SavedProject } from '@/types/user';
import type { BOMRow } from '@/types/bom';

const STORAGE_KEY = 'metalpro_projects';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all projects from localStorage
 */
function getProjects(): SavedProject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save projects to localStorage
 */
function saveProjects(projects: SavedProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Get projects for a specific user
 */
export async function getUserProjects(userId: string): Promise<SavedProject[]> {
  await delay(300);
  const projects = getProjects();
  return projects
    .filter((proj) => proj.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Get single project by ID
 */
export async function getProject(projectId: string): Promise<SavedProject | null> {
  await delay(200);
  const projects = getProjects();
  return projects.find((proj) => proj.id === projectId) || null;
}

/**
 * Create new project
 */
export async function createProject(
  userId: string,
  data: {
    name: string;
    description?: string;
    fileName: string;
    rows: BOMRow[];
  }
): Promise<SavedProject> {
  await delay(400);

  const newProject: SavedProject = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    name: data.name,
    description: data.description,
    bomData: {
      fileName: data.fileName,
      totalRows: data.rows.length,
      rows: data.rows,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const projects = getProjects();
  projects.push(newProject);
  saveProjects(projects);

  return newProject;
}

/**
 * Update project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Pick<SavedProject, 'name' | 'description' | 'bomData'>>
): Promise<SavedProject> {
  await delay(400);

  const projects = getProjects();
  const index = projects.findIndex((proj) => proj.id === projectId);

  if (index === -1) {
    throw new Error('Project not found');
  }

  const updatedProject = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  saveProjects(projects);

  return updatedProject;
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await delay(300);

  const projects = getProjects();
  const filtered = projects.filter((proj) => proj.id !== projectId);
  saveProjects(filtered);
}

/**
 * Mark project as recently used (updates lastUsedAt timestamp)
 */
export async function markProjectAsUsed(projectId: string): Promise<SavedProject> {
  await delay(200);

  const projects = getProjects();
  const index = projects.findIndex((proj) => proj.id === projectId);

  if (index === -1) {
    throw new Error('Project not found');
  }

  const updatedProject = {
    ...projects[index],
    lastUsedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  saveProjects(projects);

  return updatedProject;
}
