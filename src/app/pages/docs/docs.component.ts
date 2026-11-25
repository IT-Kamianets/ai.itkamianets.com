import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import docsData from '../../../data/docs/docs.json';
import {
	catalogPackages,
	installCommand,
	STATUS_LABELS,
} from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { DependencyGraphComponent } from '../../shared/dependency-graph/dependency-graph.component';
import { RichPipe, TrPipe } from '../../shared/translate/tr.pipe';

type DocsPage = 'overview' | 'start' | 'installation' | 'architecture' | 'security' | 'examples';

type DocBlock =
	| { type: 'p'; text: string }
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] }
	| { type: 'links'; items: { label: string; path: string; text: string }[] }
	| { type: 'code'; code: string }
	| { type: 'install'; packages: string[] }
	| { type: 'graph' }
	| { type: 'packages' }
	| { type: 'examples' };

interface DocPageContent {
	title: string;
	lead: string;
	sections: { title: string; blocks: DocBlock[] }[];
}

@Component({
	imports: [
		RouterLink,
		RouterLinkActive,
		CodeBlockComponent,
		DependencyGraphComponent,
		TrPipe,
		RichPipe,
	],
	templateUrl: './docs.component.html',
})
export class DocsComponent {
	protected readonly content = (docsData as Record<DocsPage, DocPageContent>)[
		inject(ActivatedRoute).snapshot.data['page'] as DocsPage
	];
	protected readonly nav = [
		{ label: 'Overview', path: '/docs' },
		{ label: 'Build an agent', path: '/docs/build-an-agent' },
		{ label: 'Installation', path: '/docs/installation' },
		{ label: 'Architecture', path: '/docs/architecture' },
		{ label: 'Security', path: '/docs/security' },
		{ label: 'Examples', path: '/docs/examples' },
	];
	protected readonly packages = catalogPackages;
	protected readonly statusLabels = STATUS_LABELS;
	protected readonly installCommand = installCommand;
	protected sectionId(title: string) {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}
}
