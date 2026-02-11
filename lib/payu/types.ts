// PayU Payment Gateway Type Definitions

export interface PayUPaymentRequest {
    key: string
    txnid: string
    amount: string
    productinfo: string
    firstname: string
    email: string
    phone: string
    surl: string // success URL
    furl: string // failure URL
    hash: string
    udf1?: string
    udf2?: string
    udf3?: string
    udf4?: string
    udf5?: string
}

export interface PayUPaymentResponse {
    mihpayid: string
    mode: string
    status: 'success' | 'failure' | 'pending'
    unmappedstatus: string
    key: string
    txnid: string
    amount: string
    cardCategory: string
    discount: string
    net_amount_debit: string
    addedon: string
    productinfo: string
    firstname: string
    lastname: string
    address1: string
    address2: string
    city: string
    state: string
    country: string
    zipcode: string
    email: string
    phone: string
    udf1: string
    udf2: string
    udf3: string
    udf4: string
    udf5: string
    hash: string
    field1: string
    field2: string
    field3: string
    field4: string
    field5: string
    field6: string
    field7: string
    field8: string
    field9: string
    payment_source: string
    PG_TYPE: string
    bank_ref_num: string
    bankcode: string
    error: string
    error_Message: string
    cardToken: string
    name_on_card: string
    cardnum: string
    cardhash: string
}

export interface PayUConfig {
    merchantKey: string
    merchantSalt: string
    mode: 'test' | 'production'
    baseUrl: string
}
