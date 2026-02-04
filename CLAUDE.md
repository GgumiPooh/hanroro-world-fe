# Project Instructions

## File Organization

- Flat structure: `src/hooks/*.ts`, not `src/hooks/backend/*.ts`
- Zod schemas: `src/schemas/{feature}.ts` (export schemas only)
- Types: `src/types/{feature}.ts` using `z.infer<typeof schema>` (export all)
- Shared utilities: `src/utils/{name}.ts`
  - `localization.ts`: `selectLocalizedText`
  - `metadata.ts`: `findMetadataUrl`, `findCoverUrl`
- Constants: `src/constants/{name}.ts`
  - `misc.ts`: time units (`A_MINUTE`), `EARLIEST_ACTIVITY_YEAR`, `ActivityType`
  - `navigation.ts`: routes, menu lists
- No `export type { X } from '...'` re-exports; define types directly

## Abstraction

- Only extract utilities for non-trivial logic (5+ lines, complex fallbacks)
- Keep simple patterns inline (e.g., escape key handler as one-liner)
- No wrapper hooks for single-line operations

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
- Prefer type unions over enums: `type Sort = "latest" | "oldest"`
- Use `as const` objects for runtime constants
- Enum-like `as const` objects: PascalCase name (e.g., `ImageStatus.LOADING`, `ActivityType.PERFORMANCE`)

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
- In Props type definition: `className` first, function props last

### JSX Attribute Order

1. `className` (first)
2. Other attributes (`type`, `value`, `disabled`, etc.)
3. Event handlers (`onClick`, `onChange`, etc.) (last)

  ```typescript
  type Props = {
    className?: string;
    label: string;
  };

  const MyComponent: FC<Props> = ({ className, label }) => {
    const [count, setCount] = useState(0);

    return (
      <button className={className} onClick={handleClick}>
        {label}: {count}
      </button>
    );

    function handleClick() {
      setCount(count + 1);
    }
  };

  export default MyComponent;
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
- Modals/Overlays: use `<Portal>` from `@headlessui/react` instead of `createPortal`

## Verification

- Run `npx tsc --noEmit` after all code changes
- Run `npm run build` for production build verification
- Fix all type errors before completion
