/**
 * Build the end result
 */

const fs = require("fs-extra");
const path = require("path");
const pMap = require("p-map");
const childProcess = require("child_process");
const util = require("util");
const package = require("./package.json");

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
    try {
      const projectName = path.relative(".", project);
      console.log(`Building ${projectName}`);

      console.log(`\tInstalling ${projectName}`);
      await exec("npm install", {
        cwd: project,
      });
      try {
        await exec("npm audit fix", {
          cwd: project,
        });
      } catch {
        // Carry on, this is just nice to have
      }

      console.log(`\tTesting ${projectName}`);
      await exec("CI=true npm t --if-present", {
        cwd: project,
      });

      console.log(`\tBuilding ${projectName}`);
      await exec("npm run build", {
        cwd: project,
      });
      const { name, description, staticBuild } = await fs.readJson(
        path.resolve(project, "package.json")
      );

      console.log(`\tCopying built files ${projectName}`);
      const destination = path.resolve(config.outputDirectory, name);
      await fs.mkdirp(destination);

      const contents = await exec("ls -al", {
        cwd: project,
      });
      console.log({
        project,
        listing: contents.stdout,
      });

      await fs.copy(
        path.resolve(project, staticBuild || config.buildDir),
        destination
      );

      console.log(`Complete ${projectName}`);
      return { name, description };
    } catch (error) {
      throw new Error(`Error building ${project}: ${error}`);
    }
  },
  {
    concurrency: 2,
  }
)
  .then(async (projects) => {
    // Write main index
    const components = projects.reduce(
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

    const footer = [
      `Version ${package.version}`,
      `Built at ${new Date().toISOString()}`,
    ]
      .map((item) => `<p>${item}</p>`)
      .join("\n");

    const contents = components + `\n<div class="info-footer">${footer}</div>`;

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
