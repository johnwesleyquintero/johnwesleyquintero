import { getGitHubProjects } from "@/lib/github";
import { CONFIG } from "@/lib/constants";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const allProjects = await getGitHubProjects(CONFIG.githubUsername);
  // Filter out forks, ensure at least 1 star, sort by stars (highest first), and take top 10
  const projects = allProjects
    .filter(repo => !repo.fork && (repo.stargazers_count || 0) > 0)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 10);
  
  return <HomeClient initialProjects={projects} />;
}
