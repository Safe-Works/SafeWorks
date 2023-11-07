export interface CreatePreferencePayload {
  items?: PreferenceItem[] | undefined;
  payer?: PreferencePayer | undefined;
  payment_methods?: PreferencePaymentMethods | undefined;
  shipments?: PreferenceShipment | undefined;
  back_urls?: PreferenceBackUrl | undefined;
  notification_url?: string | undefined;
  statement_descriptor?: string | undefined;
  additional_info?: string | undefined;
  auto_return?: 'approved' | 'all' | undefined;
  external_reference?: string | undefined;
  expires?: boolean | undefined;
  date_of_expiration?: string | undefined;
  expiration_date_from?: string | undefined;
  expiration_date_to?: string | undefined;
  marketplace?: string | undefined;
  marketplace_fee?: number | undefined;
  differential_pricing?:
  | {
    id: number;
  }
  | undefined;
  binary_mode?: boolean | undefined;
  taxes?:
  | Array<{
    type: 'IVA' | 'INC';
    value: number;
  }>
  | undefined;
  tracks?: PreferenceTrack[] | undefined;
  purpose?: string | undefined;
}