# TypeScript Style Guide - Avoiding `any` Type

## Overview
This document outlines the configuration rules and best practices for avoiding the `any` type in our TypeScript codebase.

## ESLint Rules Configuration

The following ESLint rules are configured in `eslint.config.mjs` to prevent `any` usage:

```javascript
{
  rules: {
    // Prevent usage of 'any' type
    "@typescript-eslint/no-explicit-any": "error",
    // Warn when using 'any' in function parameters
    "@typescript-eslint/no-unsafe-argument": "warn",
    // Warn when using 'any' in assignments
    "@typescript-eslint/no-unsafe-assignment": "warn",
    // Warn when calling methods on 'any'
    "@typescript-eslint/no-unsafe-call": "warn",
    // Warn when accessing properties on 'any'
    "@typescript-eslint/no-unsafe-member-access": "warn",
    // Warn when returning 'any' from functions
    "@typescript-eslint/no-unsafe-return": "warn",
  },
}
```

## TypeScript Compiler Options

Enhanced `tsconfig.json` with strict type checking:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Best Practices

### 1. Define Proper Interfaces
Instead of:
```typescript
function Header({ isDarkMode, setIsDarkMode }: any) {
```

Use:
```typescript
interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
```

### 2. Type Arrays and Objects
Instead of:
```typescript
const countries = [
  { code: "US", name: "USA" },
  // ...
];
```

Use:
```typescript
interface Country {
  code: string;
  name: string;
}

const countries: Country[] = [
  { code: "US", name: "USA" },
  // ...
];
```

### 3. Handle Potentially Undefined Values
Instead of:
```typescript
const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
```

Use:
```typescript
const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]!);
```

### 4. Use Union Types for Multiple Possible Types
Instead of:
```typescript
let value: any;
```

Use:
```typescript
let value: string | number | boolean;
```

### 5. Use Generic Types for Reusable Components
Instead of:
```typescript
function ApiResponse(data: any) {
```

Use:
```typescript
function ApiResponse<T>(data: T) {
```

## Common Alternatives to `any`

1. **`unknown`** - For truly unknown types that need type checking
2. **Union types** - `string | number | boolean`
3. **Generic types** - `<T>` for reusable components
4. **Interface/Type definitions** - For object shapes
5. **Utility types** - `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`

## Enforcement

- ESLint will show errors for explicit `any` usage
- TypeScript compiler will warn about implicit `any`
- CI/CD pipeline should fail on TypeScript errors
- Code reviews should check for proper typing

## Migration Strategy

1. Enable rules gradually (start with warnings)
2. Fix existing `any` usage incrementally
3. Add proper type definitions
4. Update to strict mode once codebase is clean
