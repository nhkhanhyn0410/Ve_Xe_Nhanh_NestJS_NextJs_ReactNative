# Theme setup

## Folder structure

```text
src/theme
|- index.css
|- README.md
|- shared/
|  |- AntdLightThemeProvider.tsx
|  |- createAntdLightTheme.ts
|  |- ThemeScope.tsx
|  `- theme.types.ts
|- customer/
|  |- colors.css
|  `- CustomerThemeProvider.tsx
|- operator/
|  |- colors.css
|  |- operatorAntdTheme.ts
|  `- OperatorThemeProvider.tsx
`- admin/
   |- colors.css
   |- adminAntdTheme.ts
   `- AdminThemeProvider.tsx
```

## Where to add colors

- Customer website: update [`customer/colors.css`](./customer/colors.css)
- Operator website: update [`operator/colors.css`](./operator/colors.css)
- Admin website: update [`admin/colors.css`](./admin/colors.css)

## How it works

- `index.css` maps raw app-specific variables into semantic variables like `--app-background`, `--app-primary`, `--app-border`.
- Public pages use `CustomerThemeProvider`.
- Operator pages use `OperatorThemeProvider` and Ant Design `ConfigProvider`.
- Admin pages use `AdminThemeProvider` and Ant Design `ConfigProvider`.

## Recommended workflow

1. Replace the placeholder values in each `colors.css` file with your real palette.
2. When building UI, prefer semantic variables or theme utilities like `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `text-brand`, `border-border`.
3. Avoid hard-coding raw Tailwind colors for shared layout elements, so switching palette later stays easy.
