# IT Kamianets AI Framework: packages

Every package of the IT Kamianets AI Framework (also called AI ITKP): what it does, what it depends on, and how to install it. Use this file to choose packages for a new agent.

- Website: https://ai.itkamianets.com
- Source: https://github.com/IT-Kamianets
- This file: https://ai.itkamianets.com/packages.md (generated from the website catalog on every build)

6 packages: 1 schemas, 1 core, 1 providers, 3 integrations. 1 constructor, 1 agent.

**Status: the framework is being designed.** Packages marked planned are not on npm yet; their names and APIs may still change.

## How the framework is built

```text
schemas            ai-*-schema          JSON, no runtime
core               ai-core              the agent engine
providers          ai-<provider>        models: ai-ollama, later hosted ones
integrations       ai-<service>         tools: ai-unity, ai-assetra, ai-firebase
constructors       ai-constructor-*     starter repositories
agent packages     <agent>-*            owned by the agent; outside this catalog
```

Each layer uses only the layers above it in this list. Domain logic never goes into ai-core, and an agent's rules never go into framework packages.

## Using packages

**Start an agent from a starter repository.** Each constructor has one (listed under Constructors). Clone it under your agent's name; its AGENTS.md walks you or your AI agent through what to build first.

**Add a package to an agent.** `npm install <npm name>`. npm installs its dependencies. Node.js 24 LTS, ESM only.

**Name your own packages** `<agent>-<part>`. A new agent starts with `<agent>-cli`, the command itself. A package that more than one agent could use belongs in the framework instead, as `ai-*`.

**Change a framework package through a pull request.** Clone it next to your agent, `npm link` it, work on a branch, open a pull request, and go back to the published version after the merge. Full flow: https://ai.itkamianets.com/docs/build-an-agent

## Packages at a glance

### Schemas

JSON Schema with no runtime: contracts that leave the Node.js process, for apps in any stack.

| Package | What it does | Depends on |
|---|---|---|
| [`ai-api-schema`](#ai-api-schema) | The contract between an agent and its apps: HTTP endpoints, streaming events, sessions and tool calls as JSON Schema. | - |

### Core

The agent engine every agent runs on. It has no domain logic.

| Package | What it does | Depends on |
|---|---|---|
| [`ai-core`](#ai-core) | The agent engine: model providers, tools, prompts, rules, skills, sessions, permissions and an HTTP API with streaming. | `ai-api-schema` |

### Providers

Model providers, one package per source of models, all behind the ai-core provider interface.

| Package | What it does | Depends on |
|---|---|---|
| [`ai-ollama`](#ai-ollama) | Local models through Ollama: detect, install, configure, recommend, download, update, remove and run models. | `ai-core` |

### Integrations

Tools for one service or program each, which ai-core runs with permission checks.

| Package | What it does | Depends on |
|---|---|---|
| [`ai-unity`](#ai-unity) | Unity Editor tools: inspect scenes, create, move, rotate, scale and delete objects, and set materials. | `ai-core` |
| [`ai-assetra`](#ai-assetra) | Assetra tools: search, download, upload and manage 3D models in the shared library. | `ai-core` |
| [`ai-firebase`](#ai-firebase) | Firebase tools: Authentication, Firestore, Realtime Database and Cloud Storage for an agent. | `ai-core` |

## Constructors

A constructor is a starter repository for one kind of agent.

### CLI Agent

For agents people run as a command in the terminal. The same agent can also serve the HTTP API, so apps on other devices can drive it.

| | |
|---|---|
| Kind | A command in the terminal |
| Status | planned |
| Agents built with it | openUnity |
| Starts with | [`ai-core`](#ai-core), [`ai-ollama`](#ai-ollama) |
| Adds when needed | [`ai-unity`](#ai-unity), [`ai-assetra`](#ai-assetra), [`ai-firebase`](#ai-firebase) |
| Starter repository | https://github.com/IT-Kamianets/ai-constructor-cli |
| Page | https://ai.itkamianets.com/constructors/cli |

## Agents

Agents built on the framework. Their own packages live outside this catalog.

### openUnity

Builds and edits Unity scenes from plain language. It runs on the user's computer with a local model through Ollama, works in the open Unity Editor, finds models in Assetra and works with Firebase.

| | |
|---|---|
| Status | planned |
| Constructor | CLI Agent |
| Framework packages | [`ai-core`](#ai-core), [`ai-ollama`](#ai-ollama), [`ai-unity`](#ai-unity), [`ai-assetra`](#ai-assetra), [`ai-firebase`](#ai-firebase) |
| Own packages | `open-unity-cli` |
| Applications | openUnity app (https://open-unity.itkamianets.com) |
| Page | https://ai.itkamianets.com/agents/open-unity |

## Schemas

JSON Schema with no runtime: contracts that leave the Node.js process, for apps in any stack.

### ai-api-schema

The contract between an agent and its apps: HTTP endpoints, streaming events, sessions and tool calls as JSON Schema.

| | |
|---|---|
| npm | `@itkamianets/ai-api-schema` |
| Status | planned |
| Depends on | nothing |
| Used by | [`ai-core`](#ai-core) |
| Repository | https://github.com/IT-Kamianets/ai-api-schema |
| Page | https://ai.itkamianets.com/packages/ai-api-schema |

**Purpose.** Apps that drive an agent, such as the openUnity web, mobile and desktop clients, are often written by other developers in other stacks. This package describes the ai-core HTTP API as JSON Schema, with TypeScript types generated from it, so an app can be built and checked without reading the agent's code. ai-core implements the schema; apps validate against it.

**Usage.** Import the types in a TypeScript app, or validate requests and events against the JSON Schema files with any validator. Every response carries the schema version, so an app can tell when the agent is newer than it knows.

**Will include:**

- Endpoints: start a session, send a message, approve or deny a tool call, list and resume sessions.
- Streaming events: text, tool call, tool result, approval request, error and done.
- Versioned: a new major version for every breaking change.
- No runtime code: usable from Angular, Swift, Kotlin or anything that reads JSON.

**API (planned names):**

| Member | What it does |
|---|---|
| `schemas/session.json` | A session: id, agent, model, created and updated time, and its messages. |
| `schemas/message.json` | One message from the user or the agent, with text and attachments. |
| `schemas/event.json` | One streamed event, told apart by its type field. |
| `schemas/approval.json` | The user's answer to a tool call that needs approval. |

**Example:**

```json
{
  "type": "tool_call",
  "sessionId": "s_01",
  "tool": "unity.object.create",
  "input": { "primitive": "Cube", "position": { "x": 0, "y": 1.2, "z": 0 } },
  "needsApproval": false
}
```

**Install:**

```text
npm install @itkamianets/ai-api-schema
```

Requirements:

- None: JSON Schema files, plus TypeScript types for TypeScript apps

## Core

The agent engine every agent runs on. It has no domain logic.

### ai-core

The agent engine: model providers, tools, prompts, rules, skills, sessions, permissions and an HTTP API with streaming.

| | |
|---|---|
| npm | `@itkamianets/ai-core` |
| Status | planned |
| Depends on | [`ai-api-schema`](#ai-api-schema) |
| Used by | [`ai-ollama`](#ai-ollama), [`ai-unity`](#ai-unity), [`ai-assetra`](#ai-assetra), [`ai-firebase`](#ai-firebase) |
| Repository | https://github.com/IT-Kamianets/ai-core |
| Page | https://ai.itkamianets.com/packages/ai-core |

**Purpose.** Every agent built on the framework runs on ai-core. It owns the agent loop: it sends the conversation to a model provider, runs the tools the model asks for after checking permissions, and streams every step to the terminal or to an app over HTTP. It knows nothing about Unity, Firebase or any other domain. Those come as tool packages, and an agent's own prompts, rules and skills come from the agent.

**Usage.** Create an agent with createAgent and give it a provider, the tool packages it needs, and its prompts, rules and skills. Run it in the terminal with agent.chat(), or start the HTTP server with agent.serve() so apps can connect. Sessions keep the conversation and can be resumed later.

**Will include:**

- Agent loop: call the model, run the tools it asks for, return the results, until the task is done or the agent needs the user.
- Provider interface: one contract for local and hosted models, implemented by ai-<provider> packages.
- Tools: typed definitions with a JSON Schema input, run on the agent host after a permission check.
- MCP client: connects to MCP servers, such as the one in the Unity Editor, and uses their tools like its own.
- Prompts, rules and skills as plain files: generic ones ship with ai-core, domain ones with the agent.
- Sessions: saved conversations that can be listed, resumed and exported.
- System detection: OS, CPU, GPU, RAM and free disk, so a provider can recommend a model that fits.
- HTTP API on the built-in Node.js http module, with streaming events for apps on other devices.
- Permissions: every tool declares what it touches, and the user approves privileged actions.

**API (planned names):**

| Member | What it does |
|---|---|
| `createAgent(options)` | Creates an agent from a name, a provider, tools, rules and skills. |
| `agent.chat()` | Starts an interactive session in the terminal. |
| `agent.run(prompt)` | Runs one task and returns the result, for scripts and one-shot commands. |
| `agent.serve(options)` | Starts the HTTP API with streaming, on this computer only by default. |
| `defineTool(definition)` | Declares a tool: name, description, JSON Schema input, permissions and the function that runs it. |
| `defineProvider(definition)` | Declares a model provider; ai-<provider> packages are built with it. |
| `mcpTools(server)` | Connects to an MCP server and returns its tools as ai-core tools. |
| `detectSystem()` | Returns the OS, CPU, GPU, RAM and free disk of the agent host. |

**Example:**

```ts
import { createAgent } from '@itkamianets/ai-core';
import { ollama } from '@itkamianets/ai-ollama';
import { unityTools } from '@itkamianets/ai-unity';

const agent = createAgent({
  name: 'my-agent',
  provider: ollama({ model: 'auto' }),
  tools: [...unityTools()],
  rules: ['./rules'],
  skills: ['./skills'],
});

await agent.chat();
```

**Install:**

```text
npm install @itkamianets/ai-core
```

Requirements:

- Node.js 24 LTS
- A model provider package, such as ai-ollama

## Providers

Model providers, one package per source of models, all behind the ai-core provider interface.

### ai-ollama

Local models through Ollama: detect, install, configure, recommend, download, update, remove and run models.

| | |
|---|---|
| npm | `@itkamianets/ai-ollama` |
| Status | planned |
| Depends on | [`ai-core`](#ai-core) |
| Used by | nothing in the framework |
| Repository | https://github.com/IT-Kamianets/ai-ollama |
| Page | https://ai.itkamianets.com/packages/ai-ollama |

**Purpose.** Ollama runs open models on the user's own computer, so an agent works offline and the user's data stays there. ai-ollama finds Ollama or installs it when the user agrees, recommends a model that fits the CPU, GPU, RAM and disk that ai-core detects, downloads and updates it, and implements the ai-core provider interface for inference.

**Usage.** Pass ollama() as the agent's provider. With the model set to 'auto' it picks a recommended model for this computer and downloads it on the first run, after asking. The setup helpers (detect, install, pull, remove) are also there for an agent's own setup command.

**Will include:**

- Finds a running or installed Ollama and its version.
- Installs Ollama on Windows, macOS and Linux after the user agrees.
- Recommends models by RAM, video memory and free disk, and by the tool support an agent needs.
- Downloads with progress, updates and removes models.
- Streaming chat with tool calls through the ai-core provider interface.

**API (planned names):**

| Member | What it does |
|---|---|
| `ollama(options)` | The provider to pass to createAgent: model name or 'auto', host and options. |
| `detectOllama()` | Whether Ollama is installed and running, and its version. |
| `installOllama()` | Installs Ollama for this OS. Call it only after the user agrees. |
| `recommendModels(system)` | Models that fit this computer, best first. |
| `pullModel(name, onProgress) / removeModel(name)` | Downloads or updates a model with progress, or removes it. |

**Example:**

```ts
import { detectSystem } from '@itkamianets/ai-core';
import { detectOllama, recommendModels, pullModel } from '@itkamianets/ai-ollama';

const status = await detectOllama();
// Not installed: ask the user, then call installOllama().

const [model] = recommendModels(await detectSystem());
await pullModel(model.name, (progress) => console.log(progress.percent));
```

**Install:**

```text
npm install @itkamianets/ai-ollama
```

Requirements:

- Node.js 24 LTS
- ai-core
- Ollama on the agent host; the package can install it when the user agrees

## Integrations

Tools for one service or program each, which ai-core runs with permission checks.

### ai-unity

Unity Editor tools: inspect scenes, create, move, rotate, scale and delete objects, and set materials.

| | |
|---|---|
| npm | `@itkamianets/ai-unity` |
| Status | planned |
| Depends on | [`ai-core`](#ai-core) |
| Used by | nothing in the framework |
| Repository | https://github.com/IT-Kamianets/ai-unity |
| Page | https://ai.itkamianets.com/packages/ai-unity |

**Purpose.** Lets an agent work in a running Unity Editor. The first version drives the Editor through Unity's own command line and MCP server, so the Unity project needs no extra package. If a tool needs something they do not offer, a small Editor package joins the 3D engine at 3d.itkamianets.com. This choice will be revisited once the first tools work.

**Usage.** Add unityTools() to the agent's tools. The agent can then read the open scene and change it. Changes go through the Editor, so they can be undone there.

**Will include:**

- Scene inspection: hierarchy, components, transforms and tags.
- Object tools: create, move, rotate, scale, duplicate and delete.
- Materials: assign them and change colors and textures.
- Every change goes through the Editor and can be undone.
- Scenes can be read as 3d-scene-schema JSON from the 3D engine.

**API (planned names):**

| Member | What it does |
|---|---|
| `unityTools(options)` | The Unity tools for createAgent, for one project. |
| `unity.scene.read` | Returns the open scene's hierarchy with transforms, components and tags. |
| `unity.object.create` | Creates a primitive, a prefab or an empty object. |
| `unity.object.transform` | Moves, rotates and scales an object. |
| `unity.object.delete` | Deletes an object. Needs the user's approval. |
| `unity.material.set` | Assigns a material or changes its color or texture. |

**Example:**

```ts
import { unityTools } from '@itkamianets/ai-unity';

const tools = unityTools({ project: 'C:/Projects/MyGame' });
// unity.scene.read, unity.object.create, unity.object.transform,
// unity.object.delete, unity.material.set
```

**Install:**

```text
npm install @itkamianets/ai-unity
```

Requirements:

- Node.js 24 LTS
- ai-core
- A Unity 6000.6 Editor with the project open
- Unity's command line or MCP server, whichever the Editor offers

### ai-assetra

Assetra tools: search, download, upload and manage 3D models in the shared library.

| | |
|---|---|
| npm | `@itkamianets/ai-assetra` |
| Status | planned |
| Depends on | [`ai-core`](#ai-core) |
| Used by | nothing in the framework |
| Repository | https://github.com/IT-Kamianets/ai-assetra |
| Page | https://ai.itkamianets.com/packages/ai-assetra |

**Purpose.** Assetra is the shared library of 3D models used by IT Kamianets games; 3d-unity-assetra works with it from inside Unity. With ai-assetra an agent finds a model for what the user describes, downloads it into the project, and publishes new models with their metadata.

**Usage.** Add assetraTools() to the agent's tools. Searching and downloading work at once; uploading needs the user's Assetra account.

**Will include:**

- Search by text, tags and size.
- Download a model into a project folder.
- Upload a model with its metadata.
- Update and remove the user's own models.

**API (planned names):**

| Member | What it does |
|---|---|
| `assetraTools(options)` | The Assetra tools for createAgent. |
| `assetra.search` | Finds models by text, tags and size. |
| `assetra.download` | Downloads a model into a folder of the project. |
| `assetra.upload` | Publishes a model with its metadata. Needs the user's approval. |

**Install:**

```text
npm install @itkamianets/ai-assetra
```

Requirements:

- Node.js 24 LTS
- ai-core
- An Assetra account for uploads

### ai-firebase

Firebase tools: Authentication, Firestore, Realtime Database and Cloud Storage for an agent.

| | |
|---|---|
| npm | `@itkamianets/ai-firebase` |
| Status | planned |
| Depends on | [`ai-core`](#ai-core) |
| Used by | nothing in the framework |
| Repository | https://github.com/IT-Kamianets/ai-firebase |
| Page | https://ai.itkamianets.com/packages/ai-firebase |

**Purpose.** A toolset that lets an agent work with a Firebase project properly, the way @angular/fire does for Angular apps: read and write data, manage users and files. It knows no project: the agent passes the config, and the project's credentials stay on the agent host.

**Usage.** Add firebaseTools() with the project's credentials to the agent's tools. Choose which services and collections the agent may use, and whether it may write.

**Will include:**

- Authentication: list, create and disable users.
- Firestore: read, write, query and delete documents.
- Realtime Database: read, write and listen.
- Cloud Storage: upload, download and list files.
- Credentials stay on the agent host, and tools never return secrets to the model.

**API (planned names):**

| Member | What it does |
|---|---|
| `firebaseTools(options)` | The Firebase tools for createAgent, for one project. |
| `firebase.firestore.get / set / query / delete` | Reads and writes Firestore documents. |
| `firebase.auth.users` | Lists, creates and disables users. |
| `firebase.storage.upload / download` | Moves files to and from Cloud Storage. |

**Install:**

```text
npm install @itkamianets/ai-firebase
```

Requirements:

- Node.js 24 LTS
- ai-core
- A Firebase project and its credentials
