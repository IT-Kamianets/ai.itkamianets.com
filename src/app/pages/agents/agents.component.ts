import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catalogAgents, STATUS_LABELS } from '../../feature/catalog/catalog.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, TrPipe],
	templateUrl: './agents.component.html',
})
export class AgentsComponent {
	protected readonly agents = catalogAgents;
	protected readonly statusLabels = STATUS_LABELS;
}
