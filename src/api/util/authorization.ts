// import { ResolverFn } from '../schema/types';

// export type LoggedIn<A, B, C, D> = (
//   resolver: ResolverFn<A, B, C, D>
// ) => ResolverFn<A, B, C & { yes: boolean }, D & { yes: boolean }>;

// export type Authenticated<R extends ResolverFn<infer A, infer B, infer C, infer D>> = ResolverFn<A, B, C, D>
// // (
// //   resolver: ResolverFn<A, B, C, D>
// // ) => ResolverFn<A, B, C & { yes: boolean }, D & { yes: boolean }>;

// // export const isLoggedIn:  =
// export const authenticated = next => (root, args, context, info) => {
//   if (!context) {
//     throw new Error(`Unauthenticated!`);
//   }

//   return next(root, args, context, info);
// };
