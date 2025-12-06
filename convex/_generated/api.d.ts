/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_base from "../agents/base.js";
import type * as agents_defensibilityCop from "../agents/defensibilityCop.js";
import type * as agents_distributionHater from "../agents/distributionHater.js";
import type * as agents_fixGenerator from "../agents/fixGenerator.js";
import type * as agents_founderFit from "../agents/founderFit.js";
import type * as agents_hackathonRealityCheck from "../agents/hackathonRealityCheck.js";
import type * as agents_marketCynic from "../agents/marketCynic.js";
import type * as agents_mentor from "../agents/mentor.js";
import type * as agents_monetizationSkeptic from "../agents/monetizationSkeptic.js";
import type * as agents_prompts from "../agents/prompts.js";
import type * as agents_types from "../agents/types.js";
import type * as ideas from "../ideas.js";
import type * as prompts from "../prompts.js";
import type * as roast from "../roast.js";
import type * as roasts from "../roasts.js";
import type * as tools_competitorLookup from "../tools/competitorLookup.js";
import type * as tools_pricingBenchmark from "../tools/pricingBenchmark.js";
import type * as tools_webSearch from "../tools/webSearch.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/base": typeof agents_base;
  "agents/defensibilityCop": typeof agents_defensibilityCop;
  "agents/distributionHater": typeof agents_distributionHater;
  "agents/fixGenerator": typeof agents_fixGenerator;
  "agents/founderFit": typeof agents_founderFit;
  "agents/hackathonRealityCheck": typeof agents_hackathonRealityCheck;
  "agents/marketCynic": typeof agents_marketCynic;
  "agents/mentor": typeof agents_mentor;
  "agents/monetizationSkeptic": typeof agents_monetizationSkeptic;
  "agents/prompts": typeof agents_prompts;
  "agents/types": typeof agents_types;
  ideas: typeof ideas;
  prompts: typeof prompts;
  roast: typeof roast;
  roasts: typeof roasts;
  "tools/competitorLookup": typeof tools_competitorLookup;
  "tools/pricingBenchmark": typeof tools_pricingBenchmark;
  "tools/webSearch": typeof tools_webSearch;
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
