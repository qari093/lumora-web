export type PaymentMethod = {
  id: string;
  nickname: string;
  provider: string;
};

const methods: PaymentMethod[] = [];

export function addPaymentMethod(method: PaymentMethod) {
  methods.push(method);
}

export function getPaymentMethods() {
  return methods;
}
