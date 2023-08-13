import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module } = getPackageJson('react-dom');
import alias from '@rollup/plugin-alias'
const pkgPath = resolvePkgPath(name);

const pkgDistPath = resolvePkgPath(name, true);

export default [
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name,
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		plugins: [
			alias({
				entries:{
					"hostConfig":`${pkgPath}/src/hostConfig.ts`
				}
			}),
			...getBaseRollupPlugins(),
			generatePackageJson({
				input: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies:{
						"react": version,
					},
					main: 'index.js'
				})
			})
		]
	},
];
