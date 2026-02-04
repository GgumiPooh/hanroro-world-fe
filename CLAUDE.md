# Project Instructions

## File Organization

- Flat: `src/hooks/*.ts`, `src/schemas/*.ts`, `src/types/*.ts`, `src/utils/*.ts`, `src/constants/*.ts`
- Schemas export only zod schemas; types use `z.infer<typeof schema>`
- No re-exports: `export type { X } from '...'`

## Naming

Forbidden: `-Supabase`, `-Backend`, `-API`, `-Service`, `-Viewer`, `-View`, `-Component`, `data`, `item`, `temp`, `result`, `info`, single-letter vars, magic numbers

Required: descriptive names (`albumItem`, `publishedDate`), `-Handle` for imperative refs (`CommentListHandle`), PascalCase `as const` objects (`ImageStatus.LOADING`)

## Type Safety

- No `any`, no `!` assertions
- `assert()` over `throw new Error()`
- API responses: `unknown` → zod parse
- Utility types: `Nullable<T>`, `Optional<T>`, `Maybe<T>`
- Type unions over enums: `type Sort = "latest" | "oldest"`

## Code Style

Imports: no blank lines, `@/` alias

FP: `.map()`, `.filter()`, `.find()` over loops; `Array.from({ length: n }, ...)` over `for`

Comments: self-documenting code only; prefixes `TODO:`, `NOTE:`, `WARN:`; no JSDoc on Props

## Component Structure

```
type Props → const Component → utilities → export default
```

- Single return; conditional JSX over early returns
- Handler: `handle-` prefix, after return, currying for params
- Props order: `*className` first → other props → function props last
- Destructuring matches Props order
- `className?: string` required; apply via `cn()` to outermost element

JSX attrs: `className` → other attrs → event handlers

## React Patterns

- `useEvent` (react-use) over `addEventListener`
- `<ImageWithPlaceholder>` over `<img>`
- `<ExternalLink>` over `window.open`
- `<Portal>` (headlessui) over `createPortal`
- `window.location.assign` for OAuth redirects

## Verification

`npx tsc --noEmit` and `npm run build` after changes
