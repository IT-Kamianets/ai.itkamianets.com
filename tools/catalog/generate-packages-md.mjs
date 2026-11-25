// Writes src/assets/packages.md, served at https://ai.itkamianets.com/packages.md: every package of
// the framework in one Markdown file, for developers and AI agents choosing packages for a new agent.
// Generated from the same catalog as the website (src/data/catalog), so the two never disagree.
// Runs before every build; edit the catalog, not the output.
//
// Usage: node tools/catalog/generate-packages-md.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = async (file) => JSON.parse(await readFile(path.join(rootDir, file), 'utf8'));

const packages = await readJson('src/data/catalog/packages.json');
const constructors = await readJson('src/data/catalog/constructors.json');
const agents = await readJson('src/data/catalog/agents.json');
const company = await readJson('src/data/company/company.json');

const siteUrl = (company.siteUrl || 'https://ai.itkamianets.com').replace(/\/$/, '');
const orgUrl = 'https://github.com/IT-Kamianets';

const STATUS = { planned: 'planned', 'in-progress': 'in progress', released: 'released' };

const GROUPS = [
	{
		name: 'Schemas',
		text: 'JSON Schema with no runtime: contracts that leave the Node.js process, for apps in any stack.',
	},
	{ name: 'Core', text: 'The agent engine every agent runs on. It has no domain logic.' },
	{
		name: 'Providers',
		text: 'Model providers, one package per source of models, all behind the ai-core provider interface.',
	},
	{
		name: 'Integrations',
		text: 'Tools for one service or program each, which ai-core runs with permission checks.',
	},
];

const usedBy = (slug) =>
	packages.filter((item) => item.dependencies.includes(slug)).map((item) => item.slug);
const anchor = (slug) => `#${slug.replace(/[^a-z0-9-]/g, '')}`;
const link = (slug) => `[\`${slug}\`](${anchor(slug)})`;
const list = (items) => items.map((item) => `- ${item}`).join('\n');
const FENCE = '```';

/** The package's main public members as a table; pipes in member names are escaped for Markdown. */
const apiTable = (item) =>
	item.api.length
		? [
				'',
				item.status === 'planned' ? '**API (planned names):**' : '**API:**',
				'',
				'| Member | What it does |',
				'|---|---|',
				...item.api.map(
					(entry) => `| \`${entry.name.replace(/\|/g, '\\|')}\` | ${entry.text} |`,
				),
				'',
			].join('\n')
		: '';

const exampleBlock = (item) =>
	item.example
		? [
				'',
				'**Example:**',
				'',
				`${FENCE}${item.group === 'Schemas' ? 'json' : 'ts'}`,
				item.example,
				FENCE,
				'',
			].join('\n')
		: '';

const packageSection = (item) => {
	const users = usedBy(item.slug);
	const includes = item.current.length
		? `**Includes:**\n\n${list(item.current)}`
		: `**Will include:**\n\n${list(item.features)}`;

	return `### ${item.slug}

${item.summary}

| | |
|---|---|
| npm | \`${item.packageId}\` |
| Status | ${item.version ? `v${item.version}` : STATUS[item.status]} |
| Depends on | ${item.dependencies.length ? item.dependencies.map(link).join(', ') : 'nothing'} |
| Used by | ${users.length ? users.map(link).join(', ') : 'nothing in the framework'} |
| Repository | ${orgUrl}/${item.slug} |
| Page | ${siteUrl}/packages/${item.slug} |

**Purpose.** ${item.purpose}

**Usage.** ${item.usage}

${includes}
${apiTable(item)}${exampleBlock(item)}
**Install:**

${FENCE}text
npm install ${item.packageId}
${FENCE}
${item.requirements.length ? `\nRequirements:\n\n${list(item.requirements)}\n` : ''}`;
};

const constructorSection = (item) => `### ${item.name}

${item.description}

| | |
|---|---|
| Kind | ${item.tagline} |
| Status | ${STATUS[item.status]} |
| Agents built with it | ${item.examples.join(', ')} |
| Starts with | ${item.packages.map(link).join(', ')} |
| Adds when needed | ${item.optional.map(link).join(', ')} |
| Starter repository | ${orgUrl}/${item.repo} |
| Page | ${siteUrl}/constructors/${item.slug} |
`;

const agentSection = (item) => `### ${item.name}

${item.description}

| | |
|---|---|
| Status | ${STATUS[item.status]} |
| Constructor | ${constructors.find((c) => c.slug === item.constructorSlug)?.name ?? item.constructorSlug} |
| Framework packages | ${item.packages.map(link).join(', ')} |
| Own packages | ${item.parts.map((part) => `\`${part.name}\``).join(', ')} |
| Applications | ${item.applications.map((app) => `${app.name} (${app.url})`).join(', ') || '-'} |
| Page | ${siteUrl}/agents/${item.slug} |
`;

const markdown = `# IT Kamianets AI Framework: packages

Every package of the IT Kamianets AI Framework (also called AI ITKP): what it does, what it depends on, and how to install it. Use this file to choose packages for a new agent.

- Website: ${siteUrl}
- Source: ${orgUrl}
- This file: ${siteUrl}/packages.md (generated from the website catalog on every build)

${packages.length} packages: ${GROUPS.map((group) => `${packages.filter((item) => item.group === group.name).length} ${group.name.toLowerCase()}`).join(', ')}. ${constructors.length} constructor, ${agents.length} agent.

**Status: the framework is being designed.** Packages marked planned are not on npm yet; their names and APIs may still change.

## How the framework is built

\`\`\`text
schemas            ai-*-schema          JSON, no runtime
core               ai-core              the agent engine
providers          ai-<provider>        models: ai-ollama, later hosted ones
integrations       ai-<service>         tools: ai-unity, ai-assetra, ai-firebase
constructors       ai-constructor-*     starter repositories
agent packages     <agent>-*            owned by the agent; outside this catalog
\`\`\`

Each layer uses only the layers above it in this list. Domain logic never goes into ai-core, and an agent's rules never go into framework packages.

## Using packages

**Start an agent from a starter repository.** Each constructor has one (listed under Constructors). Clone it under your agent's name; its AGENTS.md walks you or your AI agent through what to build first.

**Add a package to an agent.** \`npm install <npm name>\`. npm installs its dependencies. Node.js 24 LTS, ESM only.

**Name your own packages** \`<agent>-<part>\`. A new agent starts with \`<agent>-cli\`, the command itself. A package that more than one agent could use belongs in the framework instead, as \`ai-*\`.

**Change a framework package through a pull request.** Clone it next to your agent, \`npm link\` it, work on a branch, open a pull request, and go back to the published version after the merge. Full flow: ${siteUrl}/docs/build-an-agent

## Packages at a glance

${GROUPS.map(
	(group) => `### ${group.name}

${group.text}

| Package | What it does | Depends on |
|---|---|---|
${packages
	.filter((item) => item.group === group.name)
	.map(
		(item) =>
			`| ${link(item.slug)} | ${item.summary} | ${item.dependencies.length ? item.dependencies.map((slug) => `\`${slug}\``).join(', ') : '-'} |`,
	)
	.join('\n')}`,
).join('\n\n')}

## Constructors

A constructor is a starter repository for one kind of agent.

${constructors.map(constructorSection).join('\n')}
## Agents

Agents built on the framework. Their own packages live outside this catalog.

${agents.map(agentSection).join('\n')}
${GROUPS.map(
	(group) => `## ${group.name}

${group.text}

${packages
	.filter((item) => item.group === group.name)
	.map(packageSection)
	.join('\n')}`,
).join('\n')}`;

await writeFile(path.join(rootDir, 'src/assets/packages.md'), markdown.replace(/\n{3,}/g, '\n\n'));
console.log(
	`packages.md: ${packages.length} packages, ${constructors.length} constructors, ${agents.length} agents`,
);
