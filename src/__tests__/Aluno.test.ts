import { Aluno } from "../entities/Aluno";

describe("Aluno", () => {
  test("deve criar um aluno corretamente", () => {
    const aluno = new Aluno(
      "1",
      "Erick",
      "erick@email.com",
      "11999999999",
      "Azul"
    );

    expect(aluno.id).toBe("1");
    expect(aluno.nome).toBe("Erick");
    expect(aluno.email).toBe("erick@email.com");
    expect(aluno.telefone).toBe("11999999999");
    expect(aluno.faixa).toBe("Azul");
  });

  test("deve permitir alterar os dados", () => {
    const aluno = new Aluno("1", "João", "joao@email.com", "11888888888", "Branca");

    aluno.nome = "Pedro";
    aluno.email = "pedro@email.com";
    aluno.telefone = "11777777777";
    aluno.faixa = "Amarela";

    expect(aluno.nome).toBe("Pedro");
    expect(aluno.email).toBe("pedro@email.com");
    expect(aluno.telefone).toBe("11777777777");
    expect(aluno.faixa).toBe("Amarela");
  });
});