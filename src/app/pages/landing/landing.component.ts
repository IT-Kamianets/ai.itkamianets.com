import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	catalogAgents,
	catalogConstructors,
	catalogPackages,
	findPackage,
	GITHUB_ORG_URL,
} from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { TrPipe } from '../../shared/translate/tr.pipe';

@Component({
	imports: [RouterLink, IconComponent, CodeBlockComponent, TrPipe],
	templateUrl: './landing.component.html',
})
export class LandingComponent {
	protected readonly packages = catalogPackages;
	protected readonly agents = catalogAgents;
	protected readonly constructors = catalogConstructors;
	protected readonly orgUrl = GITHUB_ORG_URL;
	protected readonly agentExample = findPackage('ai-core')!.example;

	/** How a session with openUnity is meant to look; the agent is planned. */
	protected readonly session = `$ open-unity
> Put a red cube on the table
  unity.scene.read
  unity.object.create     Cube at (0, 1.2, 0)
  unity.material.set      Cube: red
Done. The cube is on the table.`;
}
