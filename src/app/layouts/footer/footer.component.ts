import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@wawjs/ngx-translate';
import {
	GITHUB_ORG_URL,
	SITE_REPO_URL,
	catalogAgents,
	catalogConstructors,
	catalogPackages,
} from '../../feature/catalog/catalog.data';
import { CompanyService } from '../../feature/company/company.service';
import { TrPipe } from '../../shared/translate/tr.pipe';

/** English source text; translated through the dictionary so the footer follows the active language. */
const FOOTER_DESCRIPTION =
	'A framework for building AI agents from reusable packages: an agent engine, model providers, tool integrations and constructors.';

@Component({
	selector: 'app-footer',
	imports: [RouterLink, TrPipe],
	templateUrl: './footer.component.html',
})
export class FooterComponent {
	private readonly _translateService = inject(TranslateService);

	protected readonly company = inject(CompanyService).company;
	protected readonly currentYear = new Date().getFullYear();
	protected readonly githubUrl = GITHUB_ORG_URL;
	protected readonly repoUrl = SITE_REPO_URL;
	protected readonly packages = catalogPackages;
	protected readonly constructors = catalogConstructors;
	protected readonly agents = catalogAgents;
	protected readonly docLinks = [
		{ label: 'Overview', path: '/docs' },
		{ label: 'Build an agent', path: '/docs/build-an-agent' },
		{ label: 'Installation', path: '/docs/installation' },
		{ label: 'Architecture', path: '/docs/architecture' },
		{ label: 'Security', path: '/docs/security' },
		{ label: 'Examples', path: '/docs/examples' },
	];
	protected readonly companyDescription = computed(() =>
		this._translateService.translate(FOOTER_DESCRIPTION)(),
	);
}
