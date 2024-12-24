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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnumField, Field, StringField } from "@/types/fields";
import { generateFieldKey } from "@/lib/utils";
import { useEffect } from "react";

const generateSchema = (fields: Field[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.type === "string") {
      const key = generateFieldKey(field.id);
      if (field.format === "email") {
        schemaShape[key] = field.required
          ? z.string().email()
          : z.string().email().optional();
      } else {
        schemaShape[key] = field.required ? z.string() : z.string().optional();
      }
      defaultValues[key] = "";
    }

    if (field.type === "enum") {
      const key = generateFieldKey(field.id);
      schemaShape[key] = z.string();
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

const EnumFormField = ({
  field: userField,
  formControl,
}: {
  formControl: Control<FieldValues> | undefined;
  field: EnumField;
}) => {
  return (
    <FormField
      control={formControl}
      name={generateFieldKey(userField.id)}
      render={({ field }) => (
        <FormItem>
          {userField.label && <FormLabel>{userField.label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={userField.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {userField.options.map(({ name, value }) => (
                <SelectItem key={value} value={value}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function FormPreview({
  fields,
  metadata,
  formValues,
  setFormValues,
}: {
  fields: Field[];
  metadata: {
    title: string;
    description: string;
  };
  formValues: Record<string, any>; // The current typed values
  setFormValues: (vals: Record<string, any>) => void; // Callback to update them
}) {
  const { formSchema, defaultValues } = generateSchema(fields);
  const mergedValues = { ...defaultValues, ...formValues };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mergedValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormValues(values);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {metadata.title !== "" && (
            <h1 className="text-3xl font-bold tracking-tight mb-1.5">
              {metadata.title}
            </h1>
          )}
          {metadata.description !== "" && (
            <p className="text-base text-zinc-500">{metadata.description}</p>
          )}
        </div>

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

          if (userField.type === "enum") {
            return (
              <EnumFormField
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
