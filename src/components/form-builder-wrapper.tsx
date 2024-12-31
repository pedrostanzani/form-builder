"use client";
import { FormBuilder } from "./form-builder";
import { initialFieldsSchema } from "@/types/fields";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FormBuilderWrapper = () => {
  const [isClient, setIsClient] = useState(false);

  const parseParam = (form: string | null) => {
    if (form === "shopping") {
      return "shopping";
    }
    return null;
  };

  const searchParams = useSearchParams();
  const form = searchParams.get("form");
  const param = parseParam(form);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (param === null) {
    return (
      <FormBuilder
        initialData={{
          metadata: {
            title: "My New Form",
            description:
              "I built this form with shadcn/ui, React Hook Form and Zod...",
          },
          fields: [],
        }}
      />
    );
  }

  return (
    <FormBuilder
      initialData={{
        metadata: {
          title: "Criar nova lista de compras",
          description:
            "Use esse formulário para criar uma nova lista de compras.",
        },
        fields: [
          {
            type: "string",
            format: "input",
            label: "Nome da lista",
            placeholder: "Minha nova lista de compras...",
            required: false,
            id: 0,
          },
          {
            type: "enum",
            format: "select",
            label: "Frutas",
            placeholder: "Selecionar fruta...",
            options: [
              { name: "Maçã", value: "apple" },
              { name: "Banana", value: "banana" },
              { name: "Laranja", value: "orange" },
              { name: "Kiwi", value: "kiwi" },
            ],
            id: 1,
          },
          {
            type: "string",
            format: "textarea",
            label: "Anotações",
            placeholder: "Anotações...",
            required: false,
            id: 2,
          },
        ],
      }}
    />
  );
};
