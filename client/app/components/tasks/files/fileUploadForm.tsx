import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@client/components/ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@client/components/ui/form';
import { Input } from '@client/components/ui/input';
import { Loader } from '@client/components/ui/loader';
import { config } from '@client/config';

const formSchema = z.object({
	files: z.instanceof(globalThis.FileList, { message: 'No file selected' }),
	//.refine((file) => file.size < 5 * 1024 * 1024, {
	//	message: 'File must be smaller than 5MB.',
	//}),
});

export function FileUploadForm({ problemId }: { problemId: number }) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const revalidator = useRevalidator();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData();
		for (const [index, file] of Array.from(values.files).entries()) {
			formData.append(`files[${index}]`, file);
		}
		formData.append('problemId', problemId.toString());
		const respose = await fetch(config?.API_URL + '/files/upload', {
			method: 'post',
			body: formData,
		});
		if (!respose.ok) {
			throw new Error(await respose.text());
		}
		form.reset();
		await revalidator.revalidate();
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	return (
		<Form {...form}>
			<div>{form.formState.errors.root?.message}</div>
			<form
				className="space-y-2"
				// eslint-disable-next-line
				onSubmit={form.handleSubmit(async (values) => {
					try {
						await onSubmit(values);
						toast.success('File uploaded');
					} catch (exception) {
						form.setError('root', {
							message: (exception as Error).message ?? 'Error',
							type: 'server',
						});
						toast.error('Error occured while uploading');
					}
				})}
			>
				<FormField
					control={form.control}
					name="files"
					render={({
						// exlude value and ref from input props
						// eslint-disable-next-line
						field: { value, onChange, ref, ...fieldProps },
					}) => (
						<FormItem>
							<FormLabel>Soubor</FormLabel>
							<Input
								ref={fileInputRef}
								type="file"
								{...fieldProps}
								name="files"
								onChange={(event) =>
									onChange(event.target.files)
								}
								multiple
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <Loader />}
					Nahrát soubor
				</Button>
			</form>
		</Form>
	);
}
