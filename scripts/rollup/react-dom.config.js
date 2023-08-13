import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

const { name, module, peerDependencies } = getPackageJson('react-dom');

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
		// react-dom 会把react-reconciler 打包到一起，而react-reconciler又关联了react。
		// 最终结果会导致构建产物的 react 和 react-dom 都存在一个数据共享层，导致数据共享层失效。
		// 所以手动将react不打包进react-dom，从而使使用时，react-reconciler 能顺利的访问到react包中的数据共享层
		external: [...Object.keys(peerDependencies)],
		plugins: [
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
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
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
];
