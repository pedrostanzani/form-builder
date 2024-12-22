"use client";

import { Field } from "@/types/fields";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const generateFieldKey = (fieldId: number) => {
  return `field_${fieldId}`;
};

const generateSchema = (fields: Field[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  fields.forEach((field) => {
    const key = generateFieldKey(field.id);
    schemaShape[key] = field.required ? z.string() : z.string().optional();
    defaultValues[key] = "";
  });

  return {
    formSchema: z.object(schemaShape),
    defaultValues,
  };
};

export function FormPreview({ fields }: { fields: Field[] }) {
  const { formSchema, defaultValues } = generateSchema(fields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((userField) => (
          <FormField
            key={userField.id}
            control={form.control}
            name={generateFieldKey(userField.id)}
            render={({ field }) => (
              <FormItem>
                {userField.label && <FormLabel>{userField.label}</FormLabel>}
                <FormControl>
                  <Input placeholder={userField.placeholder} {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
