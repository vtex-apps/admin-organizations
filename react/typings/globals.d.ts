import { ReactNode } from "react";
import { ApolloError } from "apollo-client";

declare global {
  interface ChallengeProps {
    children: ReactNode[];
  }

  interface MDField {
    key: string;
    value: string;
  }

  interface MDSearchResult {
    loading: boolean;
    error?: ApolloError;
    data: MDSearchData;
  }

  interface MDSearchData {
    documents: MDSearchDocumentResult[];
  }

  interface MDSearchDocumentResult {
    id: string;
    fields: MDField[];
  }

  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object;
    getSchema?(props?: P): object;
  }

  interface Role {
    id: string
    label: string;
    name: string;
    permissions: string;
  }

  interface Permission {
    name: string;
    label: string;
    id?: string;
  }

  interface TostMessage {
    showToast: boolean
    message: string
    type: string
  }
}
