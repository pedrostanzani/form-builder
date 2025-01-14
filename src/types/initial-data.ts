import { Field } from "@/types/fields";

export type InitialData = {
  metadata: {
    title: string;
    description: string;
    submitText: string;
  };
  fields: Field[];
}
