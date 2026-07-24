import Treino from "../entities/Treino";

describe("Treino", () => {
  test("deve criar um treino", () => {
    const treino: Treino = {
      id: "1",
      nome: "Treino A",
      alunoId: "10",
      exercicios: ["Flexão", "Agachamento"]
    };

    expect(treino.id).toBe("1");
    expect(treino.nome).toBe("Treino A");
    expect(treino.alunoId).toBe("10");
    expect(treino.exercicios.length).toBe(2);
  });

  test("deve adicionar exercício", () => {
    const treino: Treino = {
      id: "1",
      nome: "Treino B",
      alunoId: "5",
      exercicios: []
    };

    treino.exercicios.push("Supino");

    expect(treino.exercicios).toContain("Supino");
  });
});