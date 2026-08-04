import Treino from "../entities/Treino";

describe("Treino", () => {
  test("deve criar um treino", () => {
    const treino: Treino = {
      id: "1",
      nome: "Treino A",
      categoria: "Hipertrofia",
      duracao: 60,
      descricao: "Treino focado em peito e tríceps"
    };

    expect(treino.id).toBe("1");
    expect(treino.nome).toBe("Treino A");
    expect(treino.categoria).toBe("Hipertrofia");
    expect(treino.duracao).toBe(60);
    expect(treino.descricao).toBe("Treino focado em peito e tríceps");
  });

  test("deve permitir alterar os dados", () => {
    const treino: Treino = {
      id: "1",
      nome: "Treino B",
      categoria: "Cardio",
      duracao: 30,
      descricao: "Corrida na esteira"
    };

    treino.nome = "Treino C";
    treino.duracao = 45;

    expect(treino.nome).toBe("Treino C");
    expect(treino.duracao).toBe(45);
  });
});