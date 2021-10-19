/**
 * Compile down the fragments of markdown into a single file, and pre-index
 * them for searching.
 *
 * This means less work is done on startup, and that we can pre-process the
 * data (also reducing required client-side dependencies).
 */

const fs = require("fs");
const lunr = require("lunr");
const path = require("path");
const yaml = require("js-yaml");

const infoDir = "information";
const outputDir = "build/public";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const outputData = [];
const index = lunr(function () {
  this.ref("title");
  this.field("body");

  for (const file of fs.readdirSync(infoDir)) {
    if (!file.endsWith(".md")) {
      continue;
    }

    const data = convertFile(
      fs.readFileSync(path.resolve(infoDir, file), "utf-8")
    );

    outputData.push(data);
    this.add(data);
  }
});

fs.writeFileSync(path.join(outputDir, "info.json"), JSON.stringify(outputData));
fs.writeFileSync(path.join(outputDir, "search.json"), JSON.stringify(index));

/**
 * Convert the markdown (with frontmatter) into the
 */
function convertFile(markdown) {
  const sections = markdown.split(/^-{3,}$/gim);
  if (sections.length < 3) {
    throw new Error(`No frontmatter in file`);
  }

  try {
    const frontmatter = sections[1];
    const metadata = yaml.load(frontmatter);

    return {
      title: metadata.title,
      body: [
        `# ${metadata.title}`,
        ...sections.slice(2).map((md) => md.replace(/^(#+)/gim, "$1#")),
        `_${metadata.reference}_`,
      ].join("\n\n"),
    };
  } catch (e) {
    throw new Error(`Couldn't load metadata - ${e}`);
  }
}
