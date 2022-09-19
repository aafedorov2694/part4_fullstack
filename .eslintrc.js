module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'jest': true,
	},
	'extends': 'eslint:recommended',
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'indent': [
			'error',
			'tab',
			

		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'eqeqeq': 'error',
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'no-console': 0,
		'object-curly-spacing': [
			'error', 'always'
		],
	},
	'globals': {
		'process': 'readonly'
	}
}
