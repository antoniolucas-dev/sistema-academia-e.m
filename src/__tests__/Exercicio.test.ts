import Exercicio from "../entities/Exercicio";

describe("Exercicio", () => {
  test("deve criar um exercício corretamente", () => {
    const exercicio: Exercicio = {
      id: "1",
      nome: "Flexão",
      grupoMuscular: "Peito",
      series: 3,
      repeticoes: 12,
    };

    expect(exercicio.id).toBe("1");
    expect(exercicio.nome).toBe("Flexão");
    expect(exercicio.grupoMuscular).toBe("Peito");
    expect(exercicio.series).toBe(3);
    expect(exercicio.repeticoes).toBe(12);
  });

  test("deve permitir alterar os dados", () => {
    const exercicio: Exercicio = {
      id: "1",
      nome: "Agachamento",
      grupoMuscular: "Pernas",
      series: 4,
      repeticoes: 10,
    };

    exercicio.nome = "Cadeira Extensora";
    exercicio.series = 3;

    expect(exercicio.nome).toBe("Cadeira Extensora");
    expect(exercicio.series).toBe(3);
  });
});