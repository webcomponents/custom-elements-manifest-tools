/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type {
  Declaration,
  Module,
  Package,
  Reference,
} from 'custom-elements-manifest/schema.js';
import {getModule, normalizeModulePath} from './get-module.js';

/**
 * Resolves a manifest reference from a local package and module into a
 * Declaration object.
 * 
 * TODO (justinfagnani): The current implementation can only resolve within the
 * local package. To resolve to external packages would require some kind of
 * package registry, which might require this function to be async.
 * 
 * @param pkg The package to resolve the reference within
 * @param localModule The module to resolve the reference from
 * @param ref The reference to resolve
 * @param packageName The name of the package to use in error messages
 * @param packageVersion The version of the package to use in error messages
 */
export const resolveReference = (
  pkg: Package,
  localModule: Module,
  ref: Reference,
  packageName: string,
  packageVersion: string
): Declaration | undefined => {
  // Check for local reference
  if (ref.package !== undefined && ref.package !== packageName) {
    // We don't know how to resolve cross-package references yet
    console.warn(
      `Can't resolve cross-package reference ${ref} (from package ${packageName})`
    );
    return undefined;
  }
  if (
    ref.module === undefined ||
    normalizeModulePath(ref.module) === normalizeModulePath(localModule.path)
  ) {
    // Local reference. Local references refer to declarations in the local
    // module scope, which may or may not be exported.
    return localModule.declarations?.find((d) => d.name === ref.name);
  } else {
    // Cross-module reference. A reference to a different module references
    // an export or that module.
    const mod = getModule(pkg, ref.module);
    if (mod === undefined) {
      // Module not found
      const modules = pkg.modules.map((m) => m.path);
      console.warn(
        "Can't find module",
        packageName,
        packageVersion,
        ref.module,
        modules
      );
      return undefined;
    }
    const exprt = mod.exports?.find((e) => e.name === ref.name);
    if (exprt === undefined) {
      console.warn(
        "Can't find export",
        packageName,
        packageVersion,
        ref.module,
        ref.name
      );
      return undefined;
    }
    const declaration = exprt.declaration;
    // Protect against infinite recursion:
    if (mod === localModule && declaration == ref) {
      throw new Error(
        `Detected cycle in reference: ${JSON.stringify(declaration)}`
      );
    }
    // Recurse to find the declaration with the new module as the local module.
    // There are two cases:
    //  - declaration is local to the new module (its module property is
    //    undefined), in which case the recursion call is to look up a local
    //    reference to a declaration within the new module.
    //  - declaration is a reference to another module, (module is defined) in
    //    which case the recursion call will look for an export of the new
    //    module, then recurse again to find the declaration.
    return resolveReference(pkg, mod, declaration, packageName, packageVersion);
  }
};
