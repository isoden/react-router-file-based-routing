# React Router with Remix-like file-based routing powered by Vite

⚠️ experimental

## features

The following `routes` can be generated from this file structure:

```
src/routes
├── 404.tsx
├── _auth.login.tsx
├── _auth.register.tsx
├── _auth.tsx
├── _index.tsx
├── _root.tsx
├── app
│   └── route.tsx
├── app._index
│   └── route.tsx
├── app.projects
│   └── route.tsx
├── app_.projects.$id.roadmap
│   └── route.tsx
├── concerts.$city.tsx
├── concerts._index.tsx
├── concerts.trending.tsx
├── concerts.tsx
├── concerts_.mine.tsx
├── files.$.tsx
├── optional.($lang).$productId.tsx
└── optional.($lang).categories.tsx
```

```tsx
const routes: RouteObject[] = [
  {
    /* Component: import('src/routes/_root') */
    children: [
      {
        index: true,
        /* lazy: import('src/routes/_index') */
      },
      {
        /* lazy: import('src/routes/_auth') */
        children: [
          {
            path: 'login',
            /* lazy: import('src/routes/_auth.login') */
          },
          {
            path: 'register',
            /* lazy: import('src/routes/_auth.register') */
          },
        ],
      },
      {
        path: 'app',
        /* lazy: import('src/routes/app/route') */
        children: [
          {
            index: true,
            /* lazy: import('src/routes/app._index/route') */
          },
          {
            path: 'projects',
            /* lazy: import('src/routes/app.projects/route') */
          },
        ],
      },
      {
        path: 'app/projects/:id/roadmap',
        /* lazy: import('src/routes/app_.projects.$id.roadmap/route') */
      },
      {
        path: 'concerts',
        /* lazy: import('src/routes/concerts') */
        children: [
          {
            index: true,
            /* lazy: import('src/routes/concerts._index') */
          },
          {
            path: 'trending',
            /* lazy: import('src/routes/concerts.trending') */
          },
          {
            path: ':city',
            /* lazy: import('src/routes/concerts.$city') */
          },
        ],
      },
      {
        path: 'concerts/mine',
        /* lazy: import('src/routes/concerts_.mine') */
      },
      {
        path: 'files/*',
        /* lazy: import('src/routes/files.$') */
      },
      {
        path: 'optional',
        children: [
          {
            path: 'lang?',
            children: [
              {
                path: 'categories',
                /* lazy: import('src/routes/optional.($lang).categories') */
              },
              {
                path: ':productId',
                /* lazy: import('src/routes/optional.($lang).$productId') */
              },
            ],
          },
        ],
      },
      {
        path: '*',
        /* Component: import('src/routes/404') */
      },
    ],
  },
]
```

## TODO

- [ ] [Escaping Special Characters](https://remix.run/docs/en/main/file-conventions/routes#escaping-special-characters)

## inspired by

- https://github.com/oedotme/generouted
- https://omarelhawary.me/blog/file-based-routing-with-react-router-upgrading-to-v6
