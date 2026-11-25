// Checks the catalog before every build: unique slugs, framework names, npm names, no dependency
// cycles, no broken links between packages, constructors, agents and docs, and no em dash on the site.
//
// Usage: node tools/catalog/validate-catalog.mjs

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const packages = await json(path.join(root, 'src/data/catalog/packages.json'));
const constructors = await json(path.join(root, 'src/data/catalog/constructors.json'));
const agents = await json(path.join(root, 'src/data/catalog/agents.json'));
const docs = await json(path.join(root, 'src/data/docs/docs.json'));
const STATUSES = ['planned', 'in-progress', 'released'];
const GROUPS = ['Schemas', 'Core', 'Providers', 'Integrations'];
const bySlug = new Map(packages.map((item) => [item.slug, item]));

assert.equal(bySlug.size, packages.length, 'Duplicate package slug');
assert.equal(new Set(constructors.map((item) => item.slug)).size, constructors.length);
assert.equal(new Set(agents.map((item) => item.slug)).size, agents.length);

const closure = (slug, visiting = new Set()) => {
	assert(bySlug.has(slug), `Unknown package: ${slug}`);
	assert(!visiting.has(slug), `Dependency cycle at ${slug}`);
	const next = new Set(visiting).add(slug);
	return new Set([
		slug,
		...bySlug.get(slug).dependencies.flatMap((dep) => [...closure(dep, next)]),
	]);
};

for (const item of packages) {
	assert(/^ai-[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug), `Non-framework package: ${item.slug}`);
	assert(!item.slug.startsWith('ai-constructor-'), `Constructors are not packages: ${item.slug}`);
	assert(GROUPS.includes(item.group), `Unknown group: ${item.group}`);
	assert(STATUSES.includes(item.status), `Unknown status: ${item.slug}`);
	assert(
		item.packageId === `@itkamianets/${item.slug}`,
		`Invalid npm name: ${item.slug} (${item.packageId})`,
	);
	assert(item.status !== 'released' || item.version, `Released without a version: ${item.slug}`);
	assert(item.status === 'released' || !item.current.length || item.status === 'in-progress');
	closure(item.slug);
	for (const slug of item.related) assert(bySlug.has(slug), `Broken related link: ${slug}`);
}

for (const item of constructors) {
	assert(/^ai-constructor-/.test(item.repo), `Constructor repository: ${item.repo}`);
	assert(STATUSES.includes(item.status));
	for (const slug of [...item.packages, ...item.optional])
		assert(bySlug.has(slug), `Broken constructor reference: ${slug}`);
}

for (const item of agents) {
	assert(STATUSES.includes(item.status));
	assert(
		constructors.some((constructor) => constructor.slug === item.constructorSlug),
		`Unknown constructor for ${item.slug}: ${item.constructorSlug}`,
	);
	for (const slug of item.packages) assert(bySlug.has(slug), `Broken agent reference: ${slug}`);
	for (const part of item.parts) {
		assert(part.name.startsWith(`${item.slug}-`), `Agent package must be <agent>-*: ${part.name}`);
		assert(!bySlug.has(part.name), `Agent package in the framework catalog: ${part.name}`);
	}
}

for (const page of Object.values(docs)) {
	const ids = page.sections.map((section) =>
		section.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, ''),
	);
	assert.equal(new Set(ids).size, ids.length, `Duplicate section anchor: ${page.title}`);
	for (const block of page.sections.flatMap((section) => section.blocks)) {
		if (block.type === 'install')
			block.packages.forEach((slug) => assert(bySlug.get(slug)?.packageId, `Not an npm package: ${slug}`));
	}
}

async function* files(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) yield* files(file);
		else if (entry.isFile()) yield file;
	}
}

// The site never uses the em dash, in any language or in SEO text.
for await (const file of files(path.join(root, 'src'))) {
	if (/\.(json|ts|html|md|txt)$/.test(file)) {
		assert(!(await readFile(file, 'utf8')).includes('—'), `Em dash in ${file}`);
	}
}

console.log(
	`Catalog valid: ${packages.length} framework packages, ${constructors.length} constructors, ${agents.length} agents, ${Object.keys(docs).length} documentation pages`,
);
