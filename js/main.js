// Convert XML to markdown with recommendation prompt
document.getElementById("convertBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length === 0) {
    alert("Please select an XML file.");
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const xmlText = e.target.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const animeElements = xmlDoc.getElementsByTagName("anime");
    const animeList = [];

    // Process each anime entry, filtering for Completed entries
    for (let i = 0; i < animeElements.length; i++) {
      const statusNode = animeElements[i].getElementsByTagName("my_status")[0];
      if (!statusNode || statusNode.textContent.trim() !== "Completed") continue;

      const titleNode = animeElements[i].getElementsByTagName("series_title")[0];
      const scoreNode = animeElements[i].getElementsByTagName("my_score")[0];
      if (!titleNode || !scoreNode) continue;

      const title = titleNode.textContent.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
      const score = parseFloat(scoreNode.textContent.trim()) || 0;

      animeList.push({ title, score });
    }

    // Sort by score in descending order.
    animeList.sort((a, b) => b.score - a.score);

    // Build the output string starting with the recommendation prompt.
    let outputMarkdown = `**Role**: *Act like an expert anime recommendation system with deep knowledge of genres, themes, and storytelling styles.*  
**Task**: *Analyze my anime preferences and ratings (listed in the table below) to recommend 10 new anime I might enjoy. Prioritize titles with similar genres, themes, or tones to my highest-rated shows (e.g., psychological depth, intense action, character-driven stories, sports, or emotional drama). Avoid recommending titles I’ve already watched.*  
**Format**: *Provide a markdown table with columns: **Title**, **Genre**, **Why Recommended** (briefly tie to my preferences), and **Streaming Platform**. Add a short summary explaining overarching patterns in my taste and how the recommendations align.*  

**Table**:\n\n`;

    // Build the Markdown table.
    outputMarkdown += `| Anime Title | Score |\n`;
    outputMarkdown += `|-------------|-------|\n`;
    animeList.forEach((anime) => {
      outputMarkdown += `| ${anime.title} | ${anime.score} |\n`;
    });

    document.getElementById("output").value = outputMarkdown;
  };

  reader.readAsText(file);
});

// Copy prompt button functionality
document.getElementById("copyBtn").addEventListener("click", function () {
  const outputText = document.getElementById("output").value;
  navigator.clipboard.writeText(outputText)
    .then(() => alert("Prompt copied to clipboard!"))
    .catch(err => alert("Failed to copy prompt: " + err));
});

