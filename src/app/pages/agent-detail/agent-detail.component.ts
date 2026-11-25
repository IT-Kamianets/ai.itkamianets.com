import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	findAgent,
	findConstructor,
	repoUrl,
	STATUS_LABELS,
} from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, TrPipe],
	templateUrl: './agent-detail.component.html',
})
export class AgentDetailComponent {
	protected readonly item = findAgent(inject(ActivatedRoute).snapshot.data['slug'] as string)!;
	protected readonly constructorItem = findConstructor(this.item.constructorSlug)!;
	protected readonly status = STATUS_LABELS[this.item.status];
	protected readonly planned = this.item.status === 'planned';
	protected readonly repoUrl = repoUrl;
}
