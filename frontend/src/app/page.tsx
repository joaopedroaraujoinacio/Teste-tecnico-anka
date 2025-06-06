// src/app/clients/page.tsx
'use client'

import Link from 'next/link'

export default function ClientsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-950 text-white">
      <div className="bg-gray-900 p-10 rounded-xl shadow-2xl text-center max-w-md w-full border border-orange-600">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-4 tracking-tight">
          Bem-vindo 
        </h1>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Sua plataforma de gestão de clientes. Clique nos botões abaixo para navegar.
        </p>

        {/* Contêiner para os botões */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Botão "Ver Clientes Agora" */}
          <Link href="/clients" passHref>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg w-full sm:w-auto">
              Ver Clientes
            </button>
          </Link>

          {/* Botão "Cadastrar Cliente" */}
          <Link href="/clients/create" passHref>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg w-full sm:w-auto">
              Cadastrar Cliente
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}