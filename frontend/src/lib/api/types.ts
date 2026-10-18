import type { components, operations } from "./generated/openapi";

export type { components, operations, paths } from "./generated/openapi";
export type SchemaName = keyof components["schemas"];
export type Schema<Name extends SchemaName> = components["schemas"][Name];
export type OperationId = keyof operations;
export type ResponseStatus<Op extends OperationId> = Extract<
  keyof operations[Op]["responses"],
  number
>;
export type ResponseBody<
  Op extends OperationId,
  Status extends ResponseStatus<Op>,
> =
  Status extends ResponseStatus<Op>
    ? operations[Op]["responses"][Status] extends {
        content: { "application/json": infer Body };
      }
      ? Body
      : never
    : never;

// HTTP success does not imply that an analysis stage is complete.
export type ApiResponse<Op extends OperationId> = {
  [Status in ResponseStatus<Op>]: {
    kind: `${Status}` extends `2${string}` ? "response" : "api_error";
    status: Status;
    body: ResponseBody<Op, Status>;
  };
}[ResponseStatus<Op>];
