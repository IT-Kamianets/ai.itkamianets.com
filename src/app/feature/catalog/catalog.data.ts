import type { IconName } from '../../shared/icon/icons';
import agentsData from '../../../data/catalog/agents.json';
import constructorsData from '../../../data/catalog/constructors.json';
import packagesData from '../../../data/catalog/packages.json';

export const GITHUB_ORG_URL = 'https://github.com/IT-Kamianets';
/** This website's own repository. */
export const SITE_REPO_URL = `${GITHUB_ORG_URL}/ai.itkamianets.com`;

/** Where a package or agent is: only described, being written, or published. */
export type CatalogStatus = 'planned' | 'in-progress' | 'released';

export interface CatalogPackage {
	slug: string;
	name: string;
	group: string;
	status: CatalogStatus;
	summary: string;
	purpose: string;
	dependencies: string[];
	/** Empty until the first release. */
	version: string;
	license: string;
	/** The npm package name, under the organization scope. Empty for packages that are not on npm. */
	packageId: string;
	install: string;
	requirements: string[];
	usage: string;
	/** What the package does today; empty while it is planned. */
	current: string[];
	features: string[];
	examples: string[];
	roadmap: string[];
	related: string[];
	/** Optional packages or tools the code supports when present, one sentence each. */
	optional: string[];
	/** The most useful public members (or schema files), with one sentence each. Planned names may change. */
	api: { name: string; text: string }[];
	/** A short code sample using the API; empty when there is none. */
	example: string;
}

export interface CatalogConstructor {
	slug: string;
	name: string;
	icon: IconName;
	/** What the starter becomes: an agent (a command) or an app that drives an agent over its HTTP API. */
	kind: 'agent' | 'app';
	tagline: string;
	status: CatalogStatus;
	/** The starter repository developers clone to start an agent of this kind. */
	repo: string;
	description: string;
	/** The kinds of agents (or apps) this constructor suits. */
	agentTypes: string[];
	/** Agents or apps built from this constructor. */
	examples: string[];
	/** Framework packages every agent of this kind starts with. */
	packages: string[];
	/** Framework packages an agent usually adds for its domain. */
	optional: string[];
	features: string[];
	/** What the starter repository contains. */
	contents: { path: string; text: string }[];
	/** Packages a new project of this kind starts with, named after the agent. */
	generated: string[];
	/** The setup steps after cloning. */
	setup: string[];
}

export interface CatalogAgent {
	slug: string;
	name: string;
	icon: IconName;
	tagline: string;
	status: CatalogStatus;
	description: string;
	/** The constructor the agent starts from. */
	constructorSlug: string;
	/** Framework packages the agent uses. */
	packages: string[];
	/** The agent's own packages, named `<agent>-<part>`; they live outside the framework catalog. */
	parts: { name: string; text: string }[];
	/** Applications built on the agent's HTTP API, usually by other developers. */
	applications: { name: string; text: string; url: string; constructorSlug: string }[];
	features: string[];
	roadmap: string[];
}

export interface PackageGroup {
	name: string;
	packages: CatalogPackage[];
}

export const catalogPackages = packagesData as CatalogPackage[];
export const catalogConstructors = constructorsData as CatalogConstructor[];
export const catalogAgents = agentsData as CatalogAgent[];

/** From generic to specific, the same order as the architecture. */
const PACKAGE_GROUP_ORDER = ['Schemas', 'Core', 'Providers', 'Integrations'];

export const packageGroups: PackageGroup[] = PACKAGE_GROUP_ORDER.map((name) => ({
	name,
	packages: catalogPackages.filter((item) => item.group === name),
})).filter((group) => group.packages.length > 0);

export const STATUS_LABELS: Record<CatalogStatus, string> = {
	planned: 'Planned',
	'in-progress': 'In progress',
	released: 'Released',
};

export const repoUrl = (repo: string) => `${GITHUB_ORG_URL}/${repo}`;

export const findPackage = (slug: string) => catalogPackages.find((item) => item.slug === slug);

export const findConstructor = (slug: string) =>
	catalogConstructors.find((item) => item.slug === slug);

export const findAgent = (slug: string) => catalogAgents.find((item) => item.slug === slug);

export interface DependencyLevel {
	level: number;
	packages: CatalogPackage[];
}

/** Groups packages by dependency depth: level 0 has no dependencies, level 1 depends on level 0, and so on. */
export const dependencyLevels: DependencyLevel[] = (() => {
	const levels = new Map<string, number>();
	const levelOf = (slug: string): number => {
		const known = levels.get(slug);
		if (known !== undefined) {
			return known;
		}
		const dependencies = findPackage(slug)?.dependencies ?? [];
		const level = dependencies.length ? Math.max(...dependencies.map(levelOf)) + 1 : 0;
		levels.set(slug, level);
		return level;
	};
	catalogPackages.forEach((item) => levelOf(item.slug));
	const max = Math.max(...levels.values());
	return Array.from({ length: max + 1 }, (_, level) => ({
		level,
		packages: catalogPackages.filter((item) => levels.get(item.slug) === level),
	}));
})();

/** One npm command for the given packages; npm resolves their dependencies itself. */
export function installCommand(slugs: string[]): string {
	const ids = slugs.map((slug) => {
		const item = findPackage(slug);
		if (!item?.packageId) throw new Error(`Not an npm package: ${slug}`);
		return item.packageId;
	});
	return `npm install ${ids.join(' ')}`;
}
