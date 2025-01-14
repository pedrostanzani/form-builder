import Link from "next/link";
import { Suspense } from "react";
import { Cable } from "lucide-react";

import { templates } from "@/constants/templates";
import { FormBuilder } from "@/components/form-builder";
import { FormBuilderWrapper } from "@/components/form-builder-wrapper";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const formParam = (await searchParams).form;
  const formTemplate = templates.find(
    (template) => template.name === formParam
  );

  return (
    <div className="h-full flex flex-col">
      <header className="text-zinc-950 shrink-0 sticky top-0 w-full z-50 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex justify-center sm:justify-start items-center px-4 border-b border-neutral-100">
        <Link className="flex items-center gap-2" href="/">
          <Cable size={20} />
          <span className="font-bold tracking-tight">Form Builder</span>
        </Link>
      </header>
      <Suspense>
        <FormBuilderWrapper
          initialData={
            formTemplate?.data ?? {
              metadata: {
                title: "My New Form",
                description:
                  "I built this form with shadcn/ui, React Hook Form and Zod...",
                submitText: "Submit",
              },
              fields: [],
            }
          }
        />
      </Suspense>
    </div>
  );
}
