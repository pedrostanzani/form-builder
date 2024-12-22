"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Field, StringField } from "@/types/fields";
import { generateFieldKey } from "@/lib/utils";

const generateSchema = (fields: Field[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.type === "string") {
      const key = generateFieldKey(field.id);
      if (field.format === "email") {
        schemaShape[key] = field.required ? z.string().email() : z.string().email().optional();
      } else {
        schemaShape[key] = field.required ? z.string() : z.string().optional();
      }
      defaultValues[key] = "";
    }
  });

  return {
    formSchema: z.object(schemaShape),
    defaultValues,
  };
};

const StringFormField = ({
  field: userField,
  formControl,
}: {
  formControl: Control<FieldValues> | undefined;
  field: StringField;
}) => {
  return (
    <FormField
      control={formControl}
      name={generateFieldKey(userField.id)}
      render={({ field }) => (
        <FormItem>
          {userField.label && <FormLabel>{userField.label}</FormLabel>}
          <FormControl>
            {/* <Textarea placeholder={userField.placeholder} {...field} /> */}
            {userField.format === "input" ? (
              <Input placeholder={userField.placeholder} {...field} />
            ) : userField.format === "textarea" ? (
              <Textarea placeholder={userField.placeholder} {...field} />
            ) : userField.format === "email" ? (
              <Input
                type="email"
                placeholder={userField.placeholder}
                {...field}
              />
            ) : (
              <Input
                type="password"
                placeholder={userField.placeholder}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
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
        {fields.map((userField) => {
          if (userField.type === "string") {
            return (
              <StringFormField
                key={userField.id}
                field={userField}
                formControl={form.control}
              />
            );
          }
        })}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
