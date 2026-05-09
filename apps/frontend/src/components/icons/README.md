# Icons structure

```text
src/components/icons
|- index.ts
|- README.md
|- shared/
|  |- index.ts
|  |- SvgIconBase.tsx
|  `- types.ts
|- customer/
|  `- index.ts
|- operator/
|  `- index.ts
`- admin/
   `- index.ts
```

## Suggested usage

- `shared/`: icons reused across multiple websites.
- `customer/`: icons specific to the customer website.
- `operator/`: icons specific to the operator dashboard.
- `admin/`: icons specific to the system admin dashboard.

## Conventions

- Prefer SVG React components for custom icons in `src/components/icons`.
- Prefer `@ant-design/icons` directly for standard Ant Design icons in operator/admin screens.
- Keep favicon, manifest, and social meta images in `public/`, not here.
