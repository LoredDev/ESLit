
/**
 * @param {import('../types').Package[]} packages - Package list
 * @returns {number} Number of packages' configs
 */
function packagesWithConfigs(packages) {
	return packages.map(p =>
		[...p.config?.values() ?? []].filter((options) => options.length > 0).length,
	).reduce((partial, sum) => partial + sum, 0);
}

export default { packagesWithConfigs };
