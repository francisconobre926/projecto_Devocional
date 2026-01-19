// import { createContext, useState, useContext } from "react";
// import api from "../services/api";

// const SaldoContext = createContext();

// export function SaldoProvider({ children }) {
//   const [saldo, setSaldo] = useState(0);

//   const atualizarSaldo = async () => {
//     try {
//       const response = await api.get("/transacoes/totais");
//       setSaldo(response.data["saldo total"]);
//     } catch (error) {
//       console.error("Erro ao atualizar saldo", error);
//     }
//   };

//   return (
//     <SaldoContext.Provider value={{ saldo, atualizarSaldo }}>
//       {children}
//     </SaldoContext.Provider>
//   );
// }

// export function useSaldo() {
//   return useContext(SaldoContext);
// }
