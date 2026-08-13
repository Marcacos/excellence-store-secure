export const vendasPorMes = [
  { mes: "Jan", total: 18400 },
  { mes: "Fev", total: 21200 },
  { mes: "Mar", total: 19800 },
  { mes: "Abr", total: 26400 },
  { mes: "Mai", total: 29850 },
  { mes: "Jun", total: 34120 },
];

export const pedidosPorStatus = [
  { status: "Pagos", valor: 68 },
  { status: "Em separação", valor: 21 },
  { status: "Enviados", valor: 34 },
  { status: "Cancelados", valor: 5 },
];

export const maisVendidos = [
  { nome: "Camiseta Stam Preta", unidades: 312 },
  { nome: "Camiseta Stam Branca", unidades: 284 },
  { nome: "Camiseta Stam Cinza Mescla", unidades: 176 },
  { nome: "Camiseta Stam Azul Marinho", unidades: 121 },
];

export type Pedido = {
  id: string;
  cliente: string;
  data: string;
  total: number;
  status: "Pago" | "Em separação" | "Enviado" | "Cancelado";
};

export const pedidos: Pedido[] = [
  { id: "#EX-1042", cliente: "Marina Costa", data: "12/08/2026", total: 379.8, status: "Pago" },
  { id: "#EX-1041", cliente: "Rafael Lima", data: "12/08/2026", total: 189.9, status: "Enviado" },
  { id: "#EX-1040", cliente: "Bruna Alves", data: "11/08/2026", total: 564.7, status: "Em separação" },
  { id: "#EX-1039", cliente: "Diego Martins", data: "11/08/2026", total: 194.9, status: "Pago" },
  { id: "#EX-1038", cliente: "Camila Souza", data: "10/08/2026", total: 179.9, status: "Cancelado" },
  { id: "#EX-1037", cliente: "Thiago Rocha", data: "10/08/2026", total: 749.6, status: "Enviado" },
  { id: "#EX-1036", cliente: "Larissa Dias", data: "09/08/2026", total: 369.8, status: "Pago" },
];

export const auditoria = [
  { evento: "Login de Administrador", ip: "189.45.12.203", quando: "13/08/2026 09:42", nivel: "ok" },
  { evento: "Tentativa de login malsucedida (2/5)", ip: "45.132.88.10", quando: "13/08/2026 03:17", nivel: "alerta" },
  { evento: "Senha de administrador alterada", ip: "189.45.12.203", quando: "11/08/2026 18:05", nivel: "ok" },
  { evento: "Bloqueio temporário por força bruta", ip: "45.132.88.10", quando: "10/08/2026 22:51", nivel: "critico" },
  { evento: "Login de Administrador", ip: "189.45.12.203", quando: "10/08/2026 08:12", nivel: "ok" },
] as const;
