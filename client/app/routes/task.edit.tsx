import Editor from '~/components/editor/editor';
import { Route } from './+types/task.edit';
import { trpc } from '~/trpc';
import TaskPdf from '~/components/editor/taskPdf';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEffect, useRef, useState } from 'react';

const MOBILE_WIDTH_THRESHOLD = 768;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return await trpc.problem.texts.query(parseInt(params.taskId));
}

export default function TaskEdit({ loaderData }: Route.ComponentProps) {
	const text = loaderData[0];

	// Check for mobile or desktop layout based on the current screen size.
	const [isMobile, setIsMobile] = useState(
		() => window.innerWidth < MOBILE_WIDTH_THRESHOLD
	);
	useEffect(() => {
		const handleResize = () =>
			setIsMobile(window.innerWidth < MOBILE_WIDTH_THRESHOLD);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Reset the active tab to the default value when changing layout.
	const [activeTab, setActiveTab] = useState('editor');
	useEffect(() => {
		setActiveTab('editor');
	}, [isMobile]);

	// This effect runs after the component is loaded. Using this, we can have a
	// value that determines if the component is loaded => if the refs are
	// loaded. This is then used in the next useEffect.
	const [componentLoaded, setComponentLoaded] = useState(false);
	useEffect(() => {
		setComponentLoaded(true);
	}, []);

	const editorComponentRef = useRef<HTMLDivElement>(null);
	const pdfComponentRef = useRef<HTMLDivElement>(null);
	const editorContainerRef = useRef(null);
	const pdfContainerRef = useRef(null);
	useEffect(() => {
		if (!componentLoaded) {
			//component not loaded, skipping append
			return;
		}

		function appendChildRef(container: Element, child: Element) {
			if (container && child && container.childElementCount === 0) {
				container.appendChild(child);
			}
		}

		if (!isMobile) {
			// mount both
			appendChildRef(
				editorContainerRef.current,
				editorComponentRef.current
			);
			appendChildRef(pdfContainerRef.current, pdfComponentRef.current);
		} else {
			if (activeTab === 'editor') {
				appendChildRef(
					editorContainerRef.current,
					editorComponentRef.current
				);
			} else {
				appendChildRef(
					pdfContainerRef.current,
					pdfComponentRef.current
				);
			}
		}
	}, [activeTab, isMobile, componentLoaded]);

	return (
		<>
			{isMobile ? (
				<Tabs
					className="w-full"
					onValueChange={setActiveTab}
					defaultValue="editor"
				>
					<TabsList className="w-full">
						<TabsTrigger className="w-1/2" value="editor">
							Editor
						</TabsTrigger>
						<TabsTrigger className="w-1/2" value="pdf">
							PDF
						</TabsTrigger>
					</TabsList>
					<TabsContent value="editor">
						<div ref={editorContainerRef} />
					</TabsContent>
					<TabsContent value="pdf">
						<div ref={pdfContainerRef} />
					</TabsContent>
				</Tabs>
			) : (
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>
						<div ref={editorContainerRef} />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>
						<div ref={pdfContainerRef} />
					</ResizablePanel>
				</ResizablePanelGroup>
			)}

			<div style={{ display: 'none' }}>
				<Editor textId={1601} ref={editorComponentRef} />
				<TaskPdf ref={pdfComponentRef} />
			</div>
		</>
	);
}
