"use client";
import { useEffect, useState } from "react";
import { FormBuilder } from "./form-builder";
import { Field, initialFieldsSchema } from "@/types/fields";
import { useSearchParams } from "next/navigation";

export const FormBuilderWrapper = () => {
  const parseParam = (form: string | null) => {
    if (form === null) {
      return null;
    }

    try {
      const decodedString = Buffer.from(form, "base64").toString("utf-8");
      const parsedJSON = JSON.parse(decodedString);
      const validatedData = initialFieldsSchema.parse(parsedJSON);
      return {
        ...validatedData,
        fields: validatedData.fields.map((f, i) => ({ ...f, id: -i })),
      };
    } catch (error) {
      return null;
    }
  };

  const searchParams = useSearchParams();
  const form = searchParams.get("form");
  const initialData = parseParam(form);

  if (initialData === null) {
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

  return <FormBuilder initialData={initialData} />;
};
