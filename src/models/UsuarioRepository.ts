import Usuario from "../entities/Usuario";
export class UsuarioRepository {
  private usuarios: Usuario[] = [];

  listar(): Usuario[] {
    return this.usuarios;
  }

  buscarPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find(usuario => usuario.email === email);
  }

  criar(nome: string, email: string, senha: string): Usuario {
    const novoUsuario: Usuario = {
      id: Date.now().toString(),
      nome,
      email,
      senha
    };

    this.usuarios.push(novoUsuario);
    return novoUsuario;
  }
}