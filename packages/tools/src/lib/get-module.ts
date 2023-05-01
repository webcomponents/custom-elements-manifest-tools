/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type {Package} from 'custom-elements-manifest/schema.js';

/**
 * Gets a module by path from a package.
 */
export const getModule = (pkg: Package, path: string) => {
  path = normalizeModulePath(path);
  for (const mod of pkg.modules) {
    const modulePath = normalizeModulePath(mod.path);
    if (modulePath === path) {
      return mod;
    }
  }
  return undefined;
};

/**
 * Normalizes a module path by removing leading slashes.
 */
export const normalizeModulePath = (path: string) =>
  path.startsWith('/') ? path.substring(1) : path;
