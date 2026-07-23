import Usuario from "../entities/Usuario";

describe("Usuario", () => {
  test("deve criar um usuário corretamente", () => {
    const usuario = new Usuario(
      "1",
      "Erick",
      "erick@email.com",
      "123456"
    );

    expect(usuario.id).toBe("1");
    expect(usuario.nome).toBe("Erick");
    expect(usuario.email).toBe("erick@email.com");
    expect(usuario.senha).toBe("123456");
  });

  test("deve alterar o nome do usuário", () => {
    const usuario = new Usuario(
      "1",
      "João",
      "joao@email.com",
      "123"
    );

    usuario.nome = "Maria";

    expect(usuario.nome).toBe("Maria");
  });
});