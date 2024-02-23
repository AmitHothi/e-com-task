import { ReactElement } from 'react';

export interface IIcons {
  ARROW: ReactElement;
  EMAIL: ReactElement;
  MENU: ReactElement;
  PHONE: ReactElement;
  EYES: ReactElement;
  SETTING: ReactElement;
  CROSS: ReactElement;
  CHECK: ReactElement;
  MARKETING_PHONE: ReactElement;
  MARKETING_EMAIL: ReactElement;
  VISION: ReactElement;
  MISSION: ReactElement;
  RIGHT_ARROW: ReactElement;
  RIGHT_BUTTON: ReactElement;
  POINTER: ReactElement;
  DOWN_ARROW: ReactElement;
}

export interface ISelectOption {
  label: string;
  value: string | number;
}

export interface ITableData {
  _id: number;
  name: string;
  category: string;
  variant: string;
  price: string;
  Description: string;
}

export interface ISort {
  sortField: string;
  sortDirection: 'ASC' | 'DESC';
}

export interface ITableColumn {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (key: string, value: any) => ReactElement;
  columnClass?: string;
  isSorting?: boolean;
  sortType?: 'ASC' | 'DESC';
  headerClass?: string;
}

export interface BreadcrumbItem {
  label?: string;
  link?: string;
  id?: number;
}

export interface ICategoryAttributes {
  id: string;
  attributeName: string;
  value: string;
}

export interface ICategory {
  _id: string;
  categoryName: string;
  attributes: ICategoryAttributes[];
  description: string;
  icon: string;
  status: string;
  scope: string;
  immediateParentId: string;
  ancestors: string;
  sortingOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMasterProductImage {
  id: string;
  altText: string;
  order: string;
  img: string;
}

export interface IMasterProductAttributes {
  id: string;
  attributeName: string;
  value: string;
}

export interface IMasterProduct {
  _id: string;
  masterProductName: string;
  description: string;
  icon: string;
  images: IMasterProductImage[];
  sku: string;
  status: string;
  scope: string;
  category: ICategory;
  attributes: IMasterProductAttributes[];
  tags: string;
  metaTags: string;
  sortingOrder: number;
  createdAt: string;
  updatedAt: string;
  specification: string;
  isProductReturnAble: boolean;
  returnPeriod: string;
  warrantyPeriod: string;
  isExpireAble: string;
  expirationPeriod: string;
  isReviewEnabled: boolean;
  Brand: string;
  originCountry: string;
  visibility: string;
  products: string;
  price: number;
  varientType: string;
}

export interface ISubProductImage {
  id: string;
  altText: string;
  order: string;
  img: string;
}
export interface ISubProduct {
  _id: string;
  subProductName?: string;
  description?: string;
  attributes?: string;
  store?: string;
  icon?: string;
  customImages?: ISubProductImage[];
  sku?: string;
  scope?: string;
  masterProduct?: IMasterProduct;
  barcode?: string;
  prices?: number;
  isProductReturnAble?: boolean;
  returnPeriod?: string;
  warrantyPeriod?: string;
  isExpireAble?: boolean;
  expirationPeriod?: string;
  isReviewEnabled?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
