import { InitialData } from "@/types/initial-data";

export const templates: {
  name: string;
  data: InitialData;
}[] = [
  {
    name: "shopping",
    data: {
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
    },
  },
];
