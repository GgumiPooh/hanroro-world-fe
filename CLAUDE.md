# Project Instructions

## File Organization

- Flat structure: `src/hooks/*.ts`, not `src/hooks/backend/*.ts`
- Zod schemas: `src/schemas/{feature}.ts` (export schemas only)
- Types: `src/types/{feature}.ts` using `z.infer<typeof schema>` (export all)
- No `export type { X } from '...'` re-exports; define types directly

## Naming

### Forbidden

- Implementation suffixes: `-Supabase`, `-Backend`, `-API`, `-Service`
- Redundant suffixes: `-Viewer`, `-View`, `-Component`
- Generic names: `data`, `item`, `temp`, `result`, `info`
- Single-letter variables (except trivial lambdas: `x => x * 2`)
- Magic numbers without named constants

### Required

- Descriptive names: `albumItem`, `matchedContent`, `publishedDate`
- Examples: `useAlbumsSupabase` → `useAlbums`, `SongDetailViewer` → `SongInfo`

## Type Safety

- No `any` type
- No non-null assertions (`!`); use explicit null checks
- API response typed as `unknown` before zod validation:
  ```typescript
  const data: unknown = await res.json();
  return schema.parse(data);
  ```
- Use utility types from `src/types/misc.ts`: `Nullable<T>`, `Optional<T>`, `Maybe<T>`

## Code Style

### Imports

- No blank lines between import statements
- Use `@/` path alias for all imports

### Functional Programming

- Prefer `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()` over loops
- Use `Array.from({ length: n }, (_, i) => ...)` instead of `for` loops

### Comments

- Self-documenting code; avoid unnecessary comments
- Remove all commented-out code
- Required prefix: `// TODO:`, `// NOTE:`, `// WARN:`
- JSDoc only for public API (exported types, function params)

### Component Structure

- Handler functions: `handle-` prefix, hoist after `return`
- Utility functions: place outside component

  ```typescript
  const MyComponent: FC = () => {
    const [count, setCount] = useState(0);

    return <button onClick={handleClick}>Click</button>;

    function handleClick() {
      setCount(count + 1);
    }
  };

  function formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
  ```

## Verification

- Run `npx tsc --noEmit` after all code changes
- Fix type errors before completion
