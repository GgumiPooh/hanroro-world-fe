# Project Instructions

## File Organization

- Flat structure: `src/hooks/*.ts`, not `src/hooks/backend/*.ts`
- Zod schemas: `src/schemas/{feature}.ts` (export schemas only)
- Types: `src/types/{feature}.ts` using `z.infer<typeof schema>` (export all)
- Shared utilities: `src/utils/{name}.ts` (e.g., `localization.ts` for `selectLocalizedText`)
- Constants: `src/constants/{name}.ts` (e.g., `misc.ts` for time units, `navigation.ts` for routes)
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
- Constants for config values: `MIN_NICKNAME_LENGTH`, `MAX_NICKNAME_LENGTH`, `EARLIEST_ACTIVITY_YEAR`
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
- Remove unnecessary JSX section markers (code structure should be self-documenting)
- Required prefix for necessary comments: `// TODO:`, `// NOTE:`, `// WARN:`
- JSDoc (`/** */`) only for public API (exported types, component props)

### Component Structure

- Handler functions: `handle-` prefix, hoist after `return`
- Utility functions: place outside component (after `export default`)
- Extract duplicate logic to shared utilities (e.g., `selectLocalizedText`)
- UI components must accept `className` prop and apply it to the outermost element
- In Props type definition, `className` must be the first property

  ```typescript
  const MyComponent: FC = () => {
    const [count, setCount] = useState(0);

    return <button onClick={handleClick}>Click</button>;

    function handleClick() {
      setCount(count + 1);
    }
  };

  export default MyComponent;

  function formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
  ```

### Declarative React Patterns

- Use `useEvent` from react-use instead of manual `addEventListener`/`removeEventListener`
- External links: use `<ExternalLink>` component instead of `window.open`
  ```tsx
  <ExternalLink href={url} ariaLabel="Description">
    <Button variant="icon" size="sm">
      <Icon />
    </Button>
  </ExternalLink>
  ```
- OAuth/auth redirects: `window.location.assign` is acceptable
- Avoid direct DOM manipulation; prefer React state and props
- Modals: `createPortal` to `document.body` is acceptable

## Verification

- Run `npx tsc --noEmit` after all code changes
- Run `npm run build` for production build verification
- Fix all type errors before completion
