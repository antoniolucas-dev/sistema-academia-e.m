export function validarEmail(
    email: string
  ): boolean {
  
  
    const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  
    return regex.test(email);
  
  }
  
  
  
  export function validarSenha(
    senha: string
  ): boolean {
  
  
    return senha.length >= 6;
  
  }
  
  
  
  export function validarNome(
    nome: string
  ): boolean {
  
  
    return nome.trim().length > 0;
  
  }