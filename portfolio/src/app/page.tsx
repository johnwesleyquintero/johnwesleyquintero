import { getGitHubProjects } from "@/lib/github";
import { CONFIG } from "@/lib/constants";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const projects = await getGitHubProjects(CONFIG.githubUsername);
  
  return <HomeClient initialProjects={projects} />;
}
