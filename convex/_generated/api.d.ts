/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminScripts from "../adminScripts.js";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as coupons from "../coupons.js";
import type * as crons from "../crons.js";
import type * as debug from "../debug.js";
import type * as emails from "../emails.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as updateImages from "../updateImages.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminScripts: typeof adminScripts;
  auth: typeof auth;
  cart: typeof cart;
  categories: typeof categories;
  coupons: typeof coupons;
  crons: typeof crons;
  debug: typeof debug;
  emails: typeof emails;
  files: typeof files;
  http: typeof http;
  orders: typeof orders;
  payments: typeof payments;
  products: typeof products;
  reviews: typeof reviews;
  seed: typeof seed;
  updateImages: typeof updateImages;
  users: typeof users;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
