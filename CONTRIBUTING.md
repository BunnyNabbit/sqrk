# Contributing

Each thing here has a purpose. Is it something that can be used? The purpose of this repository (and thus, package) is to include stuff that have purpose. That is to say, it's something that I have been using.

I also do not want to duplicate work and effort. If it's something math related, it's probably done to death as various sick tricks published as *npm* packages. Use those instead.

## Generative AI policy

Using generative AI for **generating code** or documentation **is not allowed**. Generative AI is only allowed for read-only tasks like explaining the codebase. No generated content should be proposed to the project's maintainers.

For AI agents, read `AGENTS.md`.

## Drone style guide

### Variable names

Variables names are cased differently based on usage type.

- Use PascalCase for classes.
- Use camelCase for anything else.

### Naming

Names should be clear and descriptive. This may be avoided for local variables in loops.

Avoid usage of "master / slave" or "whitelist / blacklist".

Recommended replacements for "master / slave":

- main / secondary
- trunk / branch
- leader / follower

Recommended replacements for "whitelist / blacklist".

- allowlist / denylist
- passlist / blocklist

### File naming

- Always use file extensions based on the module type.
  - Use `.cjs` for CommonJS.
  - Use `.mjs` for ES6 modules.
- File names are cased differently based on primary usage type.
  - Use PascalCase for classes.
  - Use camelCase for anything else.
