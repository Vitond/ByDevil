export const payment = {
  DOB: 'DOB',
  CARD: 'CARD',
  TRANS: 'TRANS'
}

export const delivery = {
  PPL: 'PPL',
  POST: 'POST',
  DPP: 'DPP'
}

export const deliveryPrices = new Map([
  [delivery.PPL, 60],
  [delivery.POST, 80],
  [delivery.DPP, 90]
]);

export const paymentPrices = new Map([
  [payment.DOB, 20],
  [payment.CARD, 0],
  [payment.TRANS, 0]
]
);

export const inputNames = {
  NAME: 'name',
  SURNAME: 'surname',
  TELEPHONE: 'telephone',
  EMAIL: 'email',
  STREET: 'street',
  CITY: 'city',
  ZIPCODE: 'zipcode',
  DELIVERY: 'delivery',
  PAYMENT: 'payment'
}

export const regExpMap = new Map([
  [inputNames.NAME, /(.+){2,}/],
  [inputNames.SURNAME, /(.+){2,}/],
  [inputNames.TELEPHONE, /^[0-9]{9}$/],
  [inputNames.EMAIL, /^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$/],
  [inputNames.STREET, /(.+){2,}/],
  [inputNames.CITY, /(.+){2,}/],
  [inputNames.ZIPCODE, /^[0-9]{5}$/],
  [inputNames.DELIVERY, /.*/],
  [inputNames.PAYMENT, /.*/]
]);
