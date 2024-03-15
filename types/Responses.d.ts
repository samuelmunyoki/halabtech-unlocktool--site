export type ServerResponses = {
  Code: rescode;
  Message?: string;
  Data?: any;
};

export enum rescode {
  "ERROR",
  "RETRY",
  "SUCCESS",
  "EMPTY",
}
