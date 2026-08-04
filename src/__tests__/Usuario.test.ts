import Usuario from "../entities/Usuario";

describe("Usuario", () => {
  test("deve criar um usuário corretamente", () => {
    const usuario = new Usuario(
      "1",
      "Alice",
      "alice@example.com",
      "senha123"
    );

    expect(usuario.id).toBe("1");
    expect(usuario.nome).toBe("Alice");
    expect(usuario.email).toBe("alice@example.com");
    expect(usuario.senha).toBe("senha123");
  });

  test("deve permitir alterar os dados", () => {
    const usuario = new Usuario("1", "Bob", "bob@example.com", "password");

    usuario.nome = "Carlos";
    usuario.email = "carlos@example.com";

    expect(usuario.nome).toBe("Carlos");
    expect(usuario.email).toBe("carlos@example.com");
  });
});