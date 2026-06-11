import React from 'react';
import { notFound } from 'next/navigation';
import { FIABE_PREDEFINITE } from '../../../data/fiabe';
import { FiabaReader } from '../../../components/FiabaReader';

interface FiabaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return FIABE_PREDEFINITE.map((fiaba) => ({
    id: fiaba.id,
  }));
}

export default async function FiabaPage({ params }: FiabaPageProps) {
  const resolvedParams = await params;
  const fiaba = FIABE_PREDEFINITE.find((f) => f.id === resolvedParams.id);

  if (!fiaba) {
    notFound();
  }

  return <FiabaReader fiaba={fiaba} />;
}
