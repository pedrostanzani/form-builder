"use client";
import { useEffect, useState } from 'react';
import { InitialData } from '@/types/initial-data';
import { FormBuilder } from '@/components/form-builder';

export const FormBuilderWrapper = ({
  initialData,
}: {
  initialData: InitialData;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <FormBuilder initialData={initialData} />;
};