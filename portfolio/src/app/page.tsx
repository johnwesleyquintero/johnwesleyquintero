import { getGitHubProjects } from "@/lib/github";
import { CONFIG } from "@/lib/constants";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const allProjects = await getGitHubProjects(CONFIG.githubUsername);
  const displayProjects = allProjects
    .filter(repo => !repo.fork)
    .slice(0, 8);

  return <HomeClient initialProjects={displayProjects} />;
}
