import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase/client';
import { checkAuth } from '@/lib/auth';
import { ProductForm } from '../product-form';

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">Новый товар</h2>
      <ProductForm />
    </div>
  );
}
