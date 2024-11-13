import { OrderByDirection, WhereFilterOp } from 'firebase/firestore';

export interface ICondition {
  field: string;
  operator: WhereFilterOp;
  value?: any;
  refPath?: string;
}

export interface fbInterface {
  collectionPath: string;
  conditions?: ICondition[];
  orderByField?: string;
  orderByDirection?: OrderByDirection;
  limitCount?: number;
}

export interface ICollectionDocument {
  documentPath: string;
  signalName?: string;
  conditions?: ICondition[];
  orderByField?: string;
  orderByDirection?: OrderByDirection;
  limitCount?: number;
}

export interface ICollection {
  collectionPath: string;
  signalName?: string;
  conditions?: ICondition[];
  orderByField?: string;
  orderByDirection?: OrderByDirection;
  limitCount?: number;
}

export interface ISnaphotCollection {
  collectionPath: string;
  signalName?: string;
  conditions?: ICondition[];
  orderByField?: string;
  orderByDirection?: OrderByDirection;
  limitCount?: number;
}
