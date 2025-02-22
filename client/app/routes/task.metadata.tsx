import { MetadataForm } from '~/components/metadataForm';
import { trpc } from '~/trpc';
import { Route } from './+types/task.metadata';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const taskData = await trpc.problem.metadata.query(parseInt(params.taskId));
	const availableTopics = await trpc.contest.availableTopics.query(1);
	const availableTypes = await trpc.contest.availableTypes.query(1);
	return { taskData, availableTypes, availableTopics };
}

export default function Metadata({ params, loaderData }: Route.ComponentProps) {
	return (
		<div className="max-w-screen-sm mx-auto px-4 sm:px-6 lg:px-8">
			<h1>Info o úloze</h1>
			<MetadataForm
				problemId={parseInt(params.taskId)}
				taskData={loaderData.taskData}
				availableTypes={loaderData.availableTypes}
				availableTopics={loaderData.availableTopics}
			/>
		</div>
	);
}
