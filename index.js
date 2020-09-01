/**
 * Build the end result
 */

const fs = require("fs-extra");
const path = require("path");
const pMap = require("p-map");
const childProcess = require("child_process");
const util = require("util");

const config = {
  outputDirectory: "public",
  buildDir: "public",
};

// Initialise the output

fs.removeSync(config.outputDirectory);
fs.mkdirSync(config.outputDirectory);

// Build and copy everything

const nodeProjects = fs
  .readdirSync(".")
  .map((f) => path.resolve(f))
  .filter((f) => fs.lstatSync(f).isDirectory())
  .filter((f) => fs.existsSync(path.resolve(f, "package.json")))
  .sort();

const exec = util.promisify(childProcess.exec);
pMap(
  nodeProjects,
  async (project) => {
    const projectName = path.relative(".", project);
    console.log(`Building ${projectName}`);
    await exec("npm i", {
      cwd: project,
    });
    await exec("CI=true npm t --if-present", {
    	cwd: project,
    })
    await exec("npm run build", {
      cwd: project,
    });
    const { name, description, staticBuild } = await fs.readJson(
      path.resolve(project, "package.json")
    );

    const destination = path.resolve(config.outputDirectory, projectName);
    await fs.mkdirp(destination);
    await fs.copy(
      path.resolve(project, staticBuild || config.buildDir),
      destination
    );

    console.log(`Complete ${projectName}`);
    return { name, description };
  },
  {
    concurrency: 2,
  }
)
  .then(async (projects) => {
    // Write main index
    const contents = projects.reduce(
      (body, project) =>
        body +
        `<div class="project">
          <h2>
              <a href="./${project.name}">${project.name}</a>
          </h2>
          <p>${project.description}</p>
        </div>\n`,
      ""
    );

    const template = fs.readFileSync("index.html", "utf8");

    const output = template.replace("</body>", contents + "</body>");

    fs.writeFileSync(
      path.resolve(config.outputDirectory, "index.html"),
      output,
      "utf8"
    );
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
