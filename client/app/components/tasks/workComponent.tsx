import { useState } from 'react';

import { workStateEnum } from '@server/db/schema';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@client/components/ui/select';
import { trpc, trpcOutputTypes } from '@client/trpc';

import { Card, CardContent, CardHeader } from '../ui/card';
import WorkPersonSelect from './workPersonSelect';

export function getWorkStateLabel(
	workState: trpcOutputTypes['problem']['work'][0]['state']
): string {
	switch (workState) {
		case 'waiting':
			return 'Čeká';
		case 'todo':
			return 'Potřeba udělat';
		case 'pending':
			return 'Rozpracované';
		case 'done':
			return 'Hotovo';
	}
}

export function getWorkStateColor(
	workState: trpcOutputTypes['problem']['work'][0]['state']
): string {
	switch (workState) {
		case 'waiting':
			return 'bg-neutral-500 text-white';
		case 'todo':
			return 'bg-destructive text-destructive-foreground';
		case 'pending':
			return 'bg-yellow-500 text-black';
		case 'done':
			return 'bg-green-500 text-black';
	}
}

export default function WorkComponent({
	work,
	organizers,
}: {
	work: trpcOutputTypes['problem']['work'][0];
	organizers: trpcOutputTypes['contest']['organizers'];
}) {
	const [state, setState] = useState(work.state);

	async function updateState(state: typeof work.state) {
		await trpc.problem.updateWorkState.mutate({
			workId: work.workId,
			state: state,
		});
	}

	return (
		<Card className="max-w-md">
			<CardHeader className="flex flex-row justify-between gap-2">
				{work.label}
				<Select
					value={state}
					// eslint-disable-next-line
					onValueChange={async (value: typeof work.state) => {
						await updateState(value);
						setState(value);
					}}
				>
					<SelectTrigger className={getWorkStateColor(state)}>
						<SelectValue placeholder="select state" />
					</SelectTrigger>
					<SelectContent>
						{workStateEnum.enumValues.map((state) => (
							<SelectItem key={state} value={state}>
								{getWorkStateLabel(state)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<WorkPersonSelect work={work} organizers={organizers} />
			</CardContent>
		</Card>
	);
}
