import Usuario, { TipoUsuario } from "../entities/Usuario";
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

  buscarPorId(id: string): Usuario | undefined {
    return this.listar().find(usuario => usuario.id === id);
  }

  criar(nome: string, email: string, senha: string, tipo: TipoUsuario = "Aluno"): Usuario {
    const novoUsuario: Usuario = {
      id: gerarId(),
      nome,
      email,
      senha,
      tipo,
      telefone: "",
      foto: "",
      metaMensal: 12
    };

    const usuarios = this.listar();
    usuarios.push(novoUsuario);
    salvarArquivo(ARQUIVO, usuarios);
    return novoUsuario;
  }

  // Atualiza os dados que o próprio usuário pode editar no seu perfil
  atualizarPerfil(id: string, nome: string, telefone: string, foto?: string, metaMensal?: number): Usuario | null {
    const usuarios = this.listar();
    const indice = usuarios.findIndex(usuario => usuario.id === id);

    if (indice === -1) return null;

    usuarios[indice].nome = nome;
    usuarios[indice].telefone = telefone;
    if (foto) {
      usuarios[indice].foto = foto;
    }
    if (metaMensal !== undefined) {
      usuarios[indice].metaMensal = metaMensal;
    }

    salvarArquivo(ARQUIVO, usuarios);
    return usuarios[indice];
  }
}