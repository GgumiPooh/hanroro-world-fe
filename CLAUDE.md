# Project Instructions

## Server Response Handling

- Validate all server response data with zod
- Define zod schemas in `src/schemas/{featureName}.ts`, export schemas only (no type exports)
- Define types in `src/types/{featureName}.ts` using `z.infer<typeof schema>`, export all
- Never use `export type { X } from '...'` re-export syntax; define types directly

## Folder Structure

- Use flat structure: files directly under feature folder, no nested subfolders
- Example: `src/hooks/*.ts` (not `src/hooks/backend/*.ts`)
- When refactoring: move files up, eliminate intermediate folders

## Post-Change Verification

- After completing code modifications, ALWAYS run `npx tsc --noEmit` to verify no type errors
- If type errors exist, fix them before reporting completion
