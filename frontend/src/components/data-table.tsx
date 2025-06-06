// src/components/data-table.tsx
'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table'
import { useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  })

  return (
    <div className="rounded-md border border-gray-700 shadow-xl overflow-hidden">
      <table className="w-full text-sm text-left">
        {/* Cabeçalho da Tabela - Estilo Laranja e Preto */}
        {/* Fundo escuro (bg-gray-800) e texto branco (text-white) para contraste */}
        <thead className="bg-gray-800 text-white uppercase tracking-wider">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-3 font-semibold border-b border-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Corpo da Tabela - Estilo Laranja e Preto */}
        <tbody className="text-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              // Alterna cores das linhas para melhor legibilidade
              className={`border-t border-gray-700 ${
                row.index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
              } hover:bg-gray-700 transition-colors duration-200`}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}