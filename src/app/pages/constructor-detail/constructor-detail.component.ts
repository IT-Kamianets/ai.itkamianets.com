import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catalogAgents, findConstructor, repoUrl } from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, CodeBlockComponent, TrPipe],
	templateUrl: './constructor-detail.component.html',
})
export class ConstructorDetailComponent {
	protected readonly item = findConstructor(
		inject(ActivatedRoute).snapshot.data['slug'] as string,
	)!;
	protected readonly repo = repoUrl(this.item.repo);
	protected readonly app = this.item.kind === 'app';
	/** Agents cloned from this constructor, or the apps that drive them; each links to its agent's page. */
	protected readonly builtWith = this.app
		? catalogAgents.flatMap((agent) =>
				agent.applications
					.filter((app) => app.constructorSlug === this.item.slug)
					.map((app) => ({ name: app.name, slug: agent.slug })),
			)
		: catalogAgents
				.filter((agent) => agent.constructorSlug === this.item.slug)
				.map((agent) => ({ name: agent.name, slug: agent.slug }));
	protected readonly generated = this.item.generated.join('\n');
}
