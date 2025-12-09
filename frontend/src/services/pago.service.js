import api from "./api";

const pagar = (data) => {
  return api.post("/pagos", data);
};

export default {
  pagar
};
