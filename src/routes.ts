import { Outlet, RouteObject } from 'react-router-dom'
import React from 'react'

const INDEX_ROUTE = '_index'
const PATHLESS_ROUTES_PREFIX = '_'

type RouteModule = Pick<
  RouteObject,
  | 'loader'
  | 'action'
  | 'handle'
  | 'ErrorBoundary'
  | 'HydrateFallback'
  | 'shouldRevalidate'
> & {
  default?: React.ComponentType
}

const PRESERVED_ROUTES = import.meta.glob<RouteModule>(
  '/src/routes/(_root|404).tsx',
  { eager: true },
)
const REGULAR_ROUTES = import.meta.glob<RouteModule>([
  '/src/routes/*.tsx',
  '/src/routes/*/route.tsx',
  '!/src/routes/(_root|404).tsx',
])

function invariant(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error('Invariant failed' + message ? `: ${message}` : '')
  }
}

function toSegments(filename: string): string[] {
  // TODO: Support the following features
  // - [ ] Escaping Special Characters
  // https://remix.run/docs/en/main/file-conventions/routes

  return (
    filename
      .replaceAll(/^\/src\/routes\/|\.tsx$/g, '')
      // folders for organization: e.g. '_landing.about/route' => '_landing.about'
      .replaceAll('/route', '')
      // splats: e.g. 'files.$' => 'files/*'
      .replaceAll(/\.\$(?=\.|$)/g, '/*')
      // path params: e.g. '$city' => ':city'
      .replaceAll(/\$(?!\.)/g, ':')
      // optional segments: e.g. '(lang)' を 'lang?' に変換
      .replaceAll(/\(([^)]+)\)/g, '$1?')
      // nested urls without layout nesting: e.g. 'concerts_.mine' => 'concerts/mine'
      .replaceAll('_.', '/')
      .split('.')
  )
}

function sortByPriority(
  routes: RouteObject[],
  getPath: (route: RouteObject) => string,
): RouteObject[] {
  return routes.sort(
    (a, b) =>
      Number(getPath(a).startsWith(':')) - Number(getPath(b).startsWith(':')),
  )
}

function lazy(route: RouteObject, loadRouteModule: () => Promise<RouteModule>) {
  route.lazy = async () => {
    const { default: Component, ...module } = await loadRouteModule()
    invariant(Component)
    return { Component, ...module }
  }
}

function createRoutes(): RouteObject[] {
  const store = new Map<RouteObject, string>()
  const routes = Object.entries(REGULAR_ROUTES).reduce<RouteObject[]>(
    (routes, [filename, loadRouteModule]) => {
      const segments = toSegments(filename)

      segments.reduce<RouteObject[]>((routes, segment, index) => {
        const isLeafRoute = segments.length - 1 === index
        const matchedRoute = routes.find(
          (route) => store.get(route) === segment,
        )

        if (matchedRoute) {
          if (isLeafRoute) {
            lazy(matchedRoute, loadRouteModule)
          }

          return (matchedRoute.children ??= [])
        }

        const children: RouteObject[] = []
        const route: RouteObject = {}

        store.set(route, segment)

        if (!segment.startsWith(PATHLESS_ROUTES_PREFIX)) {
          route.path = segment
        }

        if (segment === INDEX_ROUTE) {
          // @ts-expect-error 🤷‍♂️🤷‍♂️🤷‍♂️
          route.index = true
        }

        if (isLeafRoute) {
          lazy(route, loadRouteModule)
        } else {
          route.children = children
        }

        routes.push(route)
        sortByPriority(routes, (route) => store.get(route)!)

        return children
      }, routes)

      return routes
    },
    [],
  )

  const _root = PRESERVED_ROUTES['/src/routes/_root.tsx']
  const _404 = PRESERVED_ROUTES['/src/routes/404.tsx']
  const Root = _root?.default ?? Outlet
  const Fallback = _404?.default ?? React.Fragment

  return [
    {
      id: 'root',
      Component: Root,
      ..._root,
      children: [
        ...routes,
        {
          path: '*',
          Component: Fallback,
          ..._404,
        },
      ],
    },
  ]
}

export const routes = createRoutes()

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest

  test.each([
    // pathless routes
    ['_auth', ['_auth']],
    ['_auth.login', ['_auth', 'login']],
    ['_auth.register', ['_auth', 'register']],

    // nested routes
    ['concerts_.mine', ['concerts/mine']],
    ['concerts', ['concerts']],
    ['concerts._index', ['concerts', '_index']],
    ['concerts.$city', ['concerts', ':city']],
    ['concerts.trending', ['concerts', 'trending']],

    // splats
    ['files.$', ['files/*']],

    // optional segments
    ['($lang)._index', [':lang?', '_index']],
    ['($lang).$productId', [':lang?', ':productId']],
    ['($lang).categories', [':lang?', 'categories']],
  ])('toSegments(%j) => %j', (filename, expected) => {
    expect(toSegments(`/src/routes/${filename}.tsx`)).toEqual(expected)
  })

  test('sort static routes first', () => {
    const dynamic = { path: ':id' }
    const _static = { path: 'trending' }
    const passless = { index: true, path: '_auth' }
    const optional = { path: ':lang?' }
    const splats = { path: 'files/*' }

    const actual = sortByPriority(
      [dynamic, passless, optional, splats, _static],
      (route) => route.path!,
    )
    const expected = [passless, splats, _static, dynamic, optional]

    expect(actual).toEqual(expected)
  })
}
