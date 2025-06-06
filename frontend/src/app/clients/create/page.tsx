// src/app/clients/create/page.tsx
import { ClientForm } from "@/components/client-form";

export default function CreateClientPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-orange-600">
        <h1 className="text-4xl font-extrabold text-orange-500 tracking-tight text-center mb-6">
          Cadastrar Novo Cliente
        </h1>
        {/* O componente ClientForm será estilizado internamente */}
        <ClientForm />
      </div>
    </div>
  );
}