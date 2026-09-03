// next lint is deprecated in Next 15 and removed in 16, so the linter runs as
// the ESLint CLI. eslint-config-next 16 exports flat config directly, which is
// why there is no FlatCompat shim here; it also ships the global ignores
// (.next, out, build, next-env.d.ts), so do not re-add them.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript];

export default eslintConfig;
