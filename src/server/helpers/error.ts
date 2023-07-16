import { ErrorInterface } from "@/types/error";

export const formatError = ({
  status,
  message,
}: ErrorInterface): ErrorInterface => ({
  status,
  message,
});
