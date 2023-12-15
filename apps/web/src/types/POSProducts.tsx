export interface POSProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  organisation_id: string;
  organisation: object; // TODO: when organisation object will be defined, replace object here
  location: string;
}