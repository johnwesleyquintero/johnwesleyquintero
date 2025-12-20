import { getGitHubProjects } from "@/lib/github";
import { CONFIG } from "@/lib/constants";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const allProjects = await getGitHubProjects(CONFIG.githubUsername);
  // Filter out forks, ensure at least 1 star, and take the top 10 latest projects
  const projects = allProjects
    .filter(repo => !repo.fork && (repo.stargazers_count || 0) > 0)
    .slice(0, 10);
  
  return <HomeClient initialProjects={projects} />;
}
