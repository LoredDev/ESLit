import { parse, print } from 'recast';

/**
 * @typedef {(
 * import('estree').MemberExpression |
 * import('estree').Identifier |
 * import('estree').CallExpression |
 * import('estree').NewExpression
 * )} ExpressionOrIdentifier
 * This type only includes the expressions used in the cli's config type
 * @typedef {import('estree').VariableDeclaration} VariableDeclaration
 * @typedef {import('estree').Identifier['name']} IdentifierName
 * @typedef {VariableDeclaration['kind']} VariableKind
 * @typedef {import('estree').VariableDeclarator['init']} VariableInit
 * @typedef {import('estree').SpreadElement} SpreadElement
 * @typedef {import('estree').Expression} Expression
 * @typedef {import('estree').ArrayExpression} ArrayExpression
 */

/**
 * @param {IdentifierName} identifier - Nave of the variable identifier.
 * @param {VariableInit} [init] - Initial value of the variable.
 * @param {VariableKind} [kind] - Type of variable declaration.
 * @returns {VariableDeclaration} The variable declaration ast node object.
 */
function createVariable(identifier, init, kind = 'const') {
	return {
		declarations: [{
			id: { name: identifier, type: 'Identifier' },
			init,
			type: 'VariableDeclarator',
		}],
		kind,
		type: 'VariableDeclaration',
	};
}

/**
 * @param {string} string - The code/expression in string.
 * @returns {ExpressionOrIdentifier | undefined} -
 * The expression or identifier node of that string (undefined if string is not a expression).
 */
function stringToExpression(string) {
	/** @type {ExpressionOrIdentifier} */
	// eslint-disable-next-line max-len
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	const e = parse(string).program.body[0].expression;
	if ([
		'CallExpression',
		'Identifier',
		'MemberExpression',
		'NewExpression',
	].includes(e.type)) return e;
	return undefined;
}

/**
 * @param {ArrayExpression} array - The array node to search trough.
 * @param {ExpressionOrIdentifier | SpreadElement} element - The element to be search.
 * @returns {ExpressionOrIdentifier | undefined}
 * The element of the array founded, undefined if it isn't found.
 */
function findInArray(array, element) {
	/** @type {ExpressionOrIdentifier[]} */
	// @ts-expect-error The array should have just tge type above
	element = element.type === 'SpreadElement' ? element.argument : element;

	/** @type {ExpressionOrIdentifier[]} */
	// @ts-expect-error The array is filtered to have the type above
	const filteredElements = array.elements
		.map((n) => {
			if (n?.type === 'SpreadElement') return n.argument;
			return n;
		}).filter(n => n && n.type === element.type);

	const toStringElements = filteredElements.map(n => print(n).code);
	const toStringElement = print(element).code;

	const idx = toStringElements.indexOf(toStringElement);
	// eslint-disable-next-line security/detect-object-injection
	return filteredElements[idx];
}

/**
 * @param {ExpressionOrIdentifier} expression - The expression to be spread.
 * @returns {SpreadElement} The spread element node.
 */
function toSpreadElement(expression) {
	return {
		argument: expression,
		type: 'SpreadElement',
	};
}

// eslint-disable-next-line no-secrets/no-secrets
/**
 * @typedef {{
 * body: import('estree').ImportDeclaration
 * addSpecifier: (specifier: string, alias?: string) => ThisType<ImportDeclarationHelper>
 * convertDefaultSpecifier: () => ThisType<ImportDeclarationHelper>
 * }} ImportDeclarationHelper
 * @param {string} source - The package name or source path to be imported.
 * @param {string} [defaultImported] - The default specifier imported.
 * @param {import('estree').ImportDeclaration} [body] -
 * The body of the import declaration to start with.
 * @returns {ImportDeclarationHelper} A helper object for manipulating the import declaration.
 */
function createImportDeclaration(source, defaultImported, body) {
	const helper = {
		/**
		 * @param {string} specifier - The value to be imported from the package.
		 * @param {string} [alias] - The local alias of the value.
		 * @returns {ThisType<ImportDeclarationHelper>} This helper with the added specifiers.
		 */
		addSpecifier(specifier, alias) {
			this.convertDefaultSpecifier();
			if (this.body.specifiers.some(s =>
				s.local.name === alias || s.local.name === specifier,
			))
				return this;

			this.body.specifiers.push({
				imported: {
					name: specifier,
					type: 'Identifier',
				},
				local: {
					name: alias ?? specifier,
					type: 'Identifier',
				},
				type: 'ImportSpecifier',
			});

			return this;
		},
		/** @type {import('estree').ImportDeclaration} */
		body: body ?? {
			source: {
				type: 'Literal',
				value: source,
			},
			specifiers: defaultImported ? [{
				local: { name: defaultImported, type: 'Identifier' },
				type: 'ImportDefaultSpecifier',
			}] : [],
			type: 'ImportDeclaration',
		},
		/**
		 * Converts a default specifier to a specifier with a alias.
		 * @returns {ThisType<ImportDeclarationHelper>} -
		 * This helper with the converted default specifier.
		 * @example
		 * import eslit from 'eslit';
		 * // Is converted to
		 * import { default as eslit } from 'eslit';
		 */
		convertDefaultSpecifier() {
			const specifier = this.body.specifiers.find(s =>
				s.type === 'ImportDefaultSpecifier',
			);
			if (!specifier)
				return this;

			this.body.specifiers.splice(
				this.body.specifiers.indexOf(specifier),
				1,
			);
			return this.addSpecifier('default', specifier.local.name);
		},
	};

	if (defaultImported &&
		body &&
		!body.specifiers.some(s =>
			s.type === 'ImportDefaultSpecifier' &&
			s.local.name === defaultImported,
		))
		helper.addSpecifier('default', defaultImported);

	return helper;
}

const astUtils = {
	createImportDeclaration,
	createVariable,
	findInArray,
	stringToExpression,
	toSpreadElement,
};
export default astUtils;
