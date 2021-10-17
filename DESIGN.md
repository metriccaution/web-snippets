# Design

## Overall Structure

This project contains a number of node projects - Each of which has their own build process & dependencies.

Each of these has a `build` script defined, which compiles a static UI to the `public` directory.

The top-level of the project contains a minimal scaffolding for pulling these builds together, and scooping up each of the static UIs into a single folder structure.

The description for each project is pulled out of the `package.json`'s `description` field.
