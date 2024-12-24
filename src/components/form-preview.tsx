"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues, useForm, UseFormReturn } from "react-hook-form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { cn, generateFieldKey } from "@/lib/utils";
import { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  form,
  field: userField,
  formControl,
}: {
  form: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
  formControl: Control<FieldValues> | undefined;
  field: EnumField;
}) => {
  if (userField.format === "select") {
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
  }

  if (userField.format === "radio") {
    return (
      <FormField
        control={formControl}
        name={generateFieldKey(userField.id)}
        render={({ field }) => (
          <FormItem className="space-y-3">
            {userField.label && <FormLabel>{userField.label}</FormLabel>}
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {userField.options.map(({ name, value }) => (
                  <FormItem
                    key={value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{name}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={formControl}
      name={generateFieldKey(userField.id)}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {userField.label && <FormLabel>{userField.label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? userField.options.find(
                        ({ value }) => value === field.value
                      )?.name
                    : userField.placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No matches found.</CommandEmpty>
                  <CommandGroup>
                    {userField.options.map(({ name, value }) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          form.setValue(generateFieldKey(userField.id), value);
                        }}
                      >
                        {name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
                form={form}
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
