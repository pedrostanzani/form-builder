import { useEffect, useState } from "react";

import { EnumField, Field, StringField } from "@/types/fields";
import { cn, generateFieldKey } from "@/lib/utils";

import { codeToHtml } from "shiki";
import type { Plugin } from "prettier";
import * as prettier from "prettier/standalone";
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { Check, Copy } from "lucide-react";

const formatTypeScriptCode = async (code: string) => {
  return await prettier.format(code, {
    parser: "typescript",
    plugins: [parserTypeScript, prettierPluginEstree as Plugin<any>],
    singleQuote: false,
    semi: true,
  });
};

const generateMetadataSourceCode = (metadata: {
  title: string;
  description: string;
}) => {
  if (metadata.title === "" && metadata.description === "") {
    return "";
  }

  return `\n        <div>${
    metadata.title !== ""
      ? `\n          <h1 className="text-3xl font-bold tracking-tight mb-1.5">${metadata.title}</h1>`
      : ""
  }${
    metadata.description !== ""
      ? `\n          <p className="text-base text-zinc-500">${metadata.description}</p>`
      : ""
  }
        </div>\n`;
};

const generateStringFieldSourceCode = (field: StringField) => {
  const generateInputComponentSourceCode = () => {
    if (field.format === "input") {
      return `<Input ${
        field.placeholder !== undefined && field.placeholder !== ""
          ? `placeholder="${field.placeholder}"`
          : ``
      } {...field} />`;
    }

    if (field.format === "textarea") {
      return `<Textarea ${
        field.placeholder !== undefined && field.placeholder !== ""
          ? `placeholder="${field.placeholder}"`
          : ``
      } {...field} />`;
    }

    if (field.format === "password") {
      return `<Input type="password" ${
        field.placeholder !== undefined && field.placeholder !== ""
          ? `placeholder="${field.placeholder}"`
          : ``
      } {...field} />`;
    }

    return `<Input type="email" ${
      field.placeholder !== undefined && field.placeholder !== ""
        ? `placeholder="${field.placeholder}"`
        : ``
    } {...field} />`;
  };

  return `        <FormField
          control={form.control}
          name="${generateFieldKey(field.id)}"
          render={({ field }) => (
            <FormItem>
              ${
                field.label !== undefined && field.label !== ""
                  ? `<FormLabel>${field.label}</FormLabel>`
                  : ``
              }
              <FormControl>
                ${generateInputComponentSourceCode()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
};

const generateEnumFieldSourceCode = (field: EnumField) => {
  const generateInputComponentSourceCode = () => {
    if (field.format === "select") {
      return `<Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue ${
                      field.placeholder !== undefined &&
                      field.placeholder !== ""
                        ? `placeholder="${field.placeholder}"`
                        : ``
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
${field.options
  .map(
    ({ name, value }) =>
      `                  <SelectItem value="${value}">${name}</SelectItem>`
  )
  .join("\n")}
                </SelectContent>
              </Select>`;
    }

    if (field.format === "radio") {
      return `<RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
${field.options
  .map(
    ({
      name,
      value,
    }) => `                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="${value}" />
                  </FormControl>
                  <FormLabel className="font-normal">${name}</FormLabel>
                </FormItem>`
  )
  .join(`\n`)}
              </RadioGroup>`;
    }

    // TODO options as const
    const key = generateFieldKey(field.id);
    const optionsVariableName = `${key}_options`;

    return `          <Popover>
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
                    ? ${optionsVariableName}.find(
                        ({ value }) => value === field.value
                      )?.name
                    : ${
                      field.placeholder !== undefined
                        ? `"${field.placeholder}"`
                        : `""`
                    }}
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
                    {${optionsVariableName}.map(({ name, value }) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          form.setValue("${key}", value);
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
          </Popover>`;
  };

  return `        <FormField
          control={form.control}
          name="${generateFieldKey(field.id)}"
          render={({ field }) => (
            <FormItem>
              ${
                field.label !== undefined && field.label !== ""
                  ? `<FormLabel>${field.label}</FormLabel>`
                  : ``
              }
              ${generateInputComponentSourceCode()}
              <FormMessage />
            </FormItem>
          )}
        />`;
};

const generateFieldSourceCode = (field: Field) => {
  if (field.type === "string") {
    return generateStringFieldSourceCode(field);
  }

  if (field.type === "enum") {
    return generateEnumFieldSourceCode(field);
  }

  return "";
};

const generateStaticArraysForCombobox = (fields: EnumField[]) => {
  return fields
    .map((field) => {
      const key = generateFieldKey(field.id);
      const optionsVariableName = `${key}_options`;
      return `const ${optionsVariableName} = [
${field.options
  .map(({ name, value }) => `  { name: "${name}", value: "${value}" },`)
  .join("\n")}
]`;
    })
    .join("\n");
};

const hasFieldWithFormat = (fields: Field[], format: string) => {
  return (
    fields.filter(
      (field) =>
        (field.type === "enum" || field.type === "string") &&
        field.format === format
    ).length > 0
  );
};

export function SourceCodePreview({
  className,
  schemaCode,
  fields,
  metadata,
}: {
  className?: string;
  schemaCode: string;
  fields: Field[];
  metadata: {
    title: string;
    description: string;
  };
}) {
  const comboboxFields = fields.filter(
    (field) => field.type === "enum" && field.format === "combobox"
  );

  const sourceCode = `"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button";
${hasFieldWithFormat(fields, "radio") ? `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";` : ``}
${hasFieldWithFormat(fields, "select") ? `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";` : ``}
${
  hasFieldWithFormat(fields, "combobox")
    ? `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";`
    : ``
}
${hasFieldWithFormat(fields, "textarea") ? `import { Textarea } from "@/components/ui/textarea"` : ``}
${hasFieldWithFormat(fields, "input") || hasFieldWithFormat(fields, "email") || hasFieldWithFormat(fields, "password") ? `import { Input } from "@/components/ui/input"` : ``}

${generateStaticArraysForCombobox(comboboxFields as EnumField[])}
  
${schemaCode}

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${fields.map((field) => `      ${generateFieldKey(field.id)}: "",`).join("\n")}
    },
  })

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">${generateMetadataSourceCode(
        metadata
      )}
${fields.map((field) => generateFieldSourceCode(field)).join("\n")}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}`;

  const getHTMLFromSourceCode = async (sourceCode: string) => {
    const formattedCode = await formatTypeScriptCode(sourceCode);
    setFormattedCode(formattedCode);
    return await codeToHtml(formattedCode, {
      lang: "tsx",
      theme: "github-dark-high-contrast",
    });
  };

  const [formattedCode, setFormattedCode] = useState<string>("");
  const [html, setHTML] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  useEffect(() => {
    getHTMLFromSourceCode(sourceCode).then((html) => {
      setHTML(html);
    });
  });

  return (
    <div
      className={cn(
        "relative bg-[#090b0e] rounded-xl overflow-hidden",
        className
      )}
    >
      <div
        className="text-xs overflow-y-scroll p-4 max-h-96"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="pt-4 pr-3.5 absolute top-0 right-0">
        <button
          onClick={handleCopy}
          className="bg-transparent h-[22px] w-[22px] rounded-md flex justify-center items-center transition-colors hover:bg-zinc-700"
        >
          {isCopied ? (
            <Check size={14} className="text-zinc-100" />
          ) : (
            <Copy size={14} className="text-zinc-100" />
          )}
        </button>
      </div>
    </div>
  );
}
