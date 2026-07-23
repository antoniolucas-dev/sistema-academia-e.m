import { Aluno } from "../entities/Aluno";

describe("Aluno", () => {
  test("deve criar um aluno corretamente", () => {
    const aluno = new Aluno(
      "1",
      "Erick",
      17,
      "Jiu-Jitsu"
    );

    expect(aluno.id).toBe("1");
    expect(aluno.nome).toBe("Erick");
    expect(aluno.idade).toBe(17);
    expect(aluno.modalidade).toBe("Jiu-Jitsu");
  });

  test("deve permitir alterar os dados", () => {
    const aluno = new Aluno("1", "João", 18, "Judô");

    aluno.nome = "Pedro";
    aluno.idade = 20;
    aluno.modalidade = "Muay Thai";

    expect(aluno.nome).toBe("Pedro");
    expect(aluno.idade).toBe(20);
    expect(aluno.modalidade).toBe("Muay Thai");
  });
});