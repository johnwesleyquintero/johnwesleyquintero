import subprocess
import json
import os

def update_readme():
    # 1. Fetch pinned repositories using GitHub CLI
    # This matches the logic from your GitHub Action
    query = """
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
              }
              homepageUrl
            }
          }
        }
      }
    }
    """
    
    # Get the owner name from git config or environment
    try:
        owner = subprocess.check_output(["git", "config", "user.name"]).decode().strip()
        if not owner:
            owner = "johnwesleyquintero" # Fallback
    except:
        owner = "johnwesleyquintero"

    print(f"Fetching pinned repos for {owner}...")
    
    try:
        result = subprocess.check_output([
            "gh", "api", "graphql", 
            "-f", f"query={query}", 
            "-f", f"login={owner}"
        ])
        data = json.loads(result)
        nodes = data['data']['user']['pinnedItems']['nodes']
    except Exception as e:
        print(f"Error fetching data from GitHub CLI: {e}")
        print("Make sure you are logged in with 'gh auth login'")
        return

    # Mapping for high-impact project descriptions
    descriptions = {
        "WesBI": "**An operator-grade intelligence cockpit for real-time Amazon decision-making.**",
        "Buy-Box-Master": "A strategic analysis engine for evaluating FBM marketplace competitiveness.",
        "MyOps": "A strategic task execution system built to bridge operational gaps with code.",
        "zerotrace": "A transparent Windows utility for zero-footprint system maintenance.",
        "Lax": "A sovereign communications architecture for high-stakes operational teams.",
        "wesai-genx": "An AI force multiplier and strategic partner for creative system-building."
    }

    # 2. Format into Markdown
    markdown_lines = []
    for repo in nodes:
        name = repo['name']
        url = repo['url']
        # Use our high-impact description if it exists, otherwise use GitHub's
        desc = descriptions.get(name, repo.get('description') or "No description provided.")
        lang = (repo.get('primaryLanguage') or {}).get('name') or "N/A"
        homepage = repo.get('homepageUrl')

        markdown_lines.append(f"### 📌 [{name}]({url})")
        if homepage:
            markdown_lines.append(f"*   **Live Demo/Docs:** [{homepage}]({homepage})")
        markdown_lines.append(f"*   {desc}")
        markdown_lines.append(f"*   **Language:** {lang}\n")

    project_list_content = "\n".join(markdown_lines)

    # 3. Update README.md
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        print(f"Error: {readme_path} not found.")
        return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_marker = "<!-- START_PROJECT_LIST -->"
    end_marker = "<!-- END_PROJECT_LIST -->"

    if start_marker not in content or end_marker not in content:
        print("Error: Markers not found in README.md")
        return

    start_idx = content.find(start_marker) + len(start_marker)
    end_idx = content.find(end_marker)

    new_content = content[:start_idx] + "\n" + project_list_content + content[end_idx:]

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Successfully updated README.md locally!")

if __name__ == "__main__":
    update_readme()
