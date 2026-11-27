# IT Kamianets AI Framework

IT Kamianets AI Framework is a set of npm packages for building AI agents. It's also called AI ITKP; both names mean the same thing.

Website: `ai.itkamianets.com`

This repository is the website: the docs, the package catalog, the constructors and the agents built on the framework. The packages themselves will each get their own repository in the [IT-Kamianets GitHub organization](https://github.com/IT-Kamianets).

Status: we're still designing it. Every package is planned, nothing is on npm yet, and names and APIs can change.

## Why it exists

We want agents that run on the user's own computer, work with a local model by default, and do real work in tools like the Unity Editor. Writing each agent from scratch means rewriting the same loop, tool handling, sessions and permissions every time. So the shared part becomes one engine, and each agent only adds what makes it different: its prompts, rules, skills and the tools for its domain.

## How it fits together

It's built the same way as its sister project, the [IT Kamianets 3D Engine](https://3d.itkamianets.com):

```text
schemas            ai-*-schema          JSON, no runtime
core               ai-core              the agent engine
providers          ai-<provider>        models: ai-ollama, later hosted ones
integrations       ai-<service>         tools: ai-unity, ai-assetra, ai-firebase
constructors       ai-constructor-*     starter repositories
agent packages     <agent>-*            owned by the agent; outside this catalog
```

Each layer only uses the layers above it. `ai-core` knows nothing about Unity or Firebase. Those arrive as tool packages, and an agent's prompts, rules and skills stay in the agent's own repository.

An agent is a command-line program. It connects to MCP servers as a client and never runs one itself. Apps on a phone or another computer can drive an agent over the `ai-core` HTTP API.

## Packages

| Package | What it does |
|---|---|
| `ai-api-schema` | The HTTP API and streaming events between an agent and its apps, as JSON Schema, so an app in any language can be checked against it. |
| `ai-core` | The engine: the agent loop, providers, tools, the MCP client, prompts, rules, skills, sessions, system detection, permissions and the HTTP API. |
| `ai-ollama` | Local models through Ollama: find or install Ollama, recommend a model that fits the computer, download, update, remove and run it. |
| `ai-unity` | Tools for the Unity Editor: scenes, objects, transforms, materials. |
| `ai-assetra` | Tools for Assetra: search, download, upload and manage 3D models. |
| `ai-firebase` | Tools for Firebase: Authentication, Firestore, Realtime Database, Cloud Storage. |

Everything is published under the `@itkamianets` npm scope, MIT licensed, for Node.js 24 LTS, ESM only. Packages for hosted models will follow the same `ai-<provider>` naming.

## Constructors and agents

- CLI Agent (`ai-constructor-cli`) is the starter repository for agents you run as a command in the terminal. You clone it under your agent's name and it becomes your agent.
- Agent App (`ai-constructor-app`) is the starter repository for apps that drive an agent over its HTTP API: one Angular project for the web, for Android and iOS with Capacitor, and for Windows, macOS and Linux with Electron. The agent itself runs elsewhere, usually on the user's computer.
- openUnity (`open-unity-cli`) is the first agent: it builds and edits Unity scenes from plain language. Its web, mobile and desktop apps (open-unity.itkamianets.com) are a separate project by another developer and talk to the agent over the `ai-core` HTTP API.

## Open questions

Security is the big one. Pairing an app with an agent, remote access and tool permissions aren't designed yet, and they have to be settled before `ai-core` ships its HTTP API. The docs page on security lists the principles we already follow and what's still open.

## Site development

The site is Angular 22 with SSR prerendering and Tailwind CSS v4. Ukrainian is the default language, with an English switch.

```bash
npm install
npm start          # dev server
npm run validate   # check the catalog
npm run build      # validate, generate packages.md, prerender, write the sitemap
```

Content lives in data files:

- `src/data/catalog/packages.json`, `constructors.json`, `agents.json`: the catalog
- `src/data/docs/docs.json`: the docs pages
- `src/data/company/company.json`: site name and Ukrainian SEO
- `src/i18n/ua.json`: Ukrainian translations, keyed by the English text

`src/assets/packages.md` is generated from the catalog on every build, so don't edit it by hand.

The site deploys to GitHub Pages from `master` through `.github/workflows/deploy.yml`.

## License

MIT
