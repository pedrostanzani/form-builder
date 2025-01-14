import { Field } from "@/types/fields";

export type InitialData = {
  metadata: {
    title: string;
    description: string;
  };
  fields: Field[];
}
