const api = axios.create({
    baseURL: "http://127.0.0.1:3333/api",
    headers: { "Content-Type": "application/json" }
  });
  
  async function getUsuarios() {
    try {
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  }
  
  async function criarUsuario(dados) {
    try {
      const response = await api.post("/usuarios", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }
  
  async function deletarUsuario(id) {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
  