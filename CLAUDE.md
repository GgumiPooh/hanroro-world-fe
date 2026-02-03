# Project Instructions

## Server Response Handling

- Validate all server response data with zod
- Define zod schemas in `src/schemas/{featureName}.ts`, export all
- Define server response types in `src/types/{featureName}.ts`, export all

## Folder Structure

- Use flat structure: files directly under feature folder, no nested subfolders
- Example: `src/hooks/*.ts` (not `src/hooks/backend/*.ts`)
- When refactoring: move files up, eliminate intermediate folders
