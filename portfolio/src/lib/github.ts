import { CONFIG } from "./constants";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

export async function getGitHubProjects(username: string): Promise<GitHubRepo[]> {
  if (!username) {
    console.error('GitHub username is empty. Cannot fetch projects.');
    return [];
  }
  try {
    const url = `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=100`;
    console.log('Fetching GitHub projects from URL:', url);
    const response = await fetch(url, {
      next: { revalidate: CONFIG.revalidateTime } // Cache for the configured time
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch GitHub projects for user ${username}:`,
        `Status: ${response.status}`,
        `Error: ${errorText}`,
      );
      if (response.status === 404) {
        console.warn(
          `GitHub user '${username}' not found. Returning empty projects list.`,
        );
        return [];
      }
      throw new Error(
        `GitHub API responded with status ${response.status}: ${errorText}`,
      );
    }
    const data: GitHubRepo[] = await response.json();
    if (!Array.isArray(data)) {
      console.error('GitHub API did not return an array:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error in getGitHubProjects:', error);
    return [];
  }
}
