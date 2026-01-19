import api from "./api";

export async function login(email, senha) {
  const response = await api.post("/auth/login", {
    email,
    senha,
  });

  // sua API retorna o token em response.data.body.token
  const token = response.data.body.token;

  // salvar no localStorage
  localStorage.setItem("token", token);

  return response.data;
}
