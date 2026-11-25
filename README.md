# IT Kamianets AI Framework

**IT Kamianets AI Framework** is a framework for building AI agents from reusable npm packages. It is also called **AI ITKP**; both names mean the same thing.

Website: `ai.itkamianets.com`

This repository is the website: the framework's documentation, its package catalog, its constructors and the list of agents built on it. The packages themselves live in their own repositories in the [IT-Kamianets GitHub organization](https://github.com/IT-Kamianets).

Status: the framework is being designed. Every package is planned; names and APIs may still change.

## Concept

The framework follows the same structure as its sister project, the [IT Kamianets 3D Engine](https://3d.itkamianets.com):

```text
schemas            ai-*-schema          JSON, no runtime
core               ai-core              the agent engine
providers          ai-<provider>        models: ai-ollama, later hosted ones
integrations       ai-<service>         tools: ai-unity, ai-assetra, ai-firebase
constructors       ai-constructor-*     starter repositories
agent packages     <agent>-*            owned by the agent; outside this catalog
```

Each layer uses only the layers above it. `ai-core` has no domain logic; an agent's prompts, rules and skills stay in the agent.

## Packages

| Package | What it does |
|---|---|
| `ai-api-schema` | The HTTP API and streaming events between an agent and its apps, as JSON Schema. |
| `ai-core` | The agent engine: providers, tools, MCP client, prompts, rules, skills, sessions, system detection, permissions, HTTP API. |
| `ai-ollama` | Local models through Ollama: detect, install, recommend, download, update, remove, run. |
| `ai-unity` | Unity Editor tools: scenes, objects, transforms, materials. |
| `ai-assetra` | Assetra tools: search, download, upload and manage 3D models. |
| `ai-firebase` | Firebase tools: Authentication, Firestore, Realtime Database, Cloud Storage. |

All packages are published under the `@itkamianets` npm scope, MIT licensed, for Node.js 24 LTS, ESM only.

## Constructors and agents

- **CLI Agent** (`ai-constructor-cli`): the starter repository for agents people run as a command in the terminal.
- **openUnity** (`open-unity-cli`): the first agent, an AI agent for the Unity Editor. Its web, mobile and desktop apps (open-unity.itkamianets.com) are a separate project that connects over the `ai-core` HTTP API.

## Site development

Angular 22 with SSR prerendering, Tailwind CSS v4, Ukrainian by default with an English switch.

```bash
npm install
npm start          # dev server
npm run validate   # check the catalog
npm run build      # validate, generate packages.md, prerender, write sitemap
```

Content lives in data files:

- `src/data/catalog/packages.json`, `constructors.json`, `agents.json`: the catalog
- `src/data/docs/docs.json`: the documentation pages
- `src/data/company/company.json`: site name and Ukrainian SEO
- `src/i18n/ua.json`: Ukrainian translations, keyed by the English text

`src/assets/packages.md` is generated from the catalog on every build; do not edit it by hand.

Deployed to GitHub Pages from `master` by `.github/workflows/deploy.yml`.

## License

MIT
