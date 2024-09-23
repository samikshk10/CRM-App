import { RouterClass } from "../classes";

export interface IRouteInterface {
  segment: string;
  provider: any | RouterClass;
  serializable?: boolean;
}
