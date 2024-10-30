import React from 'react'

type Props = React.PropsWithChildren<{
  title: string
}>

export function Outline({ title, children }: Props) {
  return (
    <div className="grid gap-4 rounded border border-slate-500 p-4">
      <p className="font-mono text-xl font-bold">{title}</p>
      {children}
    </div>
  )
}
