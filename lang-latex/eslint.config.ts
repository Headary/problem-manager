import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'src/parser.ts'],
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylistic,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	}
);
