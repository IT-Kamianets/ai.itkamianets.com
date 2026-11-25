import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	catalogAgents,
	findConstructor,
	GENERATED_PACKAGE_SUFFIXES,
	repoUrl,
} from '../../feature/catalog/catalog.data';
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
	protected readonly agents = catalogAgents.filter(
		(agent) => agent.constructorSlug === this.item.slug,
	);
	protected readonly generated = GENERATED_PACKAGE_SUFFIXES.map(
		(suffix) => `<agent>-${suffix}`,
	).join('\n');
}
