import Usuario from "../entities/Usuario";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/usuarios.json";

export class UsuarioRepository {
  listar(): Usuario[] {
    return lerArquivo(ARQUIVO);
  }

  buscarPorEmail(email: string): Usuario | undefined {
    return this.listar().find(usuario => usuario.email === email);
  }

  criar(nome: string, email: string, senha: string): Usuario {
    const novoUsuario: Usuario = {
      id: gerarId(),
      nome,
      email,
      senha
    };

    const usuarios = this.listar();
    usuarios.push(novoUsuario);
    salvarArquivo(ARQUIVO, usuarios);
    return novoUsuario;
  }
}