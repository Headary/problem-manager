import {
	type RouteConfig,
	index,
	route,
	layout,
} from '@react-router/dev/routes';

export default [
	route('/', 'routes/home.tsx'),
	route(':contest/:year', 'routes/layout.tsx', [
		layout('routes/contestLayout.tsx', [
			index('routes/contestHome.tsx'),
			route('tasks', 'routes/tasks.tsx'),
			route('task-suggestions', 'routes/taskSuggestions.tsx'),
		]),
		route('task/:taskId', 'routes/task.tsx', [
			index('routes/task.edit.tsx'),
			route('work', 'routes/task.work.tsx'),
			route('metadata', 'routes/task.metadata.tsx'),
			route('files', 'routes/task.files.tsx'),
		]),
	]),
] satisfies RouteConfig;
