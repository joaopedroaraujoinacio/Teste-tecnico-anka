'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/types/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface ClientFormProps {
  defaultValues?: ClientFormData;
  onSubmit?: (data: ClientFormData) => void;
}

export function ClientForm({ defaultValues, onSubmit }: ClientFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      status: true,
    },
  });

  const internalSubmit = async (data: ClientFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      try {
        await fetch('http://localhost:3333/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        router.push('/clients');
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="status">Status (Ativo)</Label>
        <Controller
          name="status"
          control={control}
          defaultValue={defaultValues?.status ?? true}
          render={({ field }) => (
            <Switch
              id="status"
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div>
        <Button type="submit" className="mr-3">
          {onSubmit ? 'Salvar' : 'Cadastrar'}
        </Button>
        <Link href="/clients" className="mr-3">
          <Button type="button">Ver Clientes</Button>
        </Link>
        <Link href="/">
          <Button type="button">Página Inicial</Button>
        </Link>
      </div>
    </form>
  );
}
