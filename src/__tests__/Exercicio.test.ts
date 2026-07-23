import Exercicio from "../entities/Exercicio";

describe("Exercicio", () => {
  test("deve criar um exercício", () => {
    const exercicio: Exercicio = {
      id: "1",
      nome: "Supino",
      grupoMuscular: "Peito",
      series: 4,
      repeticoes: 12
    };

    expect(exercicio.nome).toBe("Supino");
    expect(exercicio.grupoMuscular).toBe("Peito");
    expect(exercicio.series).toBe(4);
    expect(exercicio.repeticoes).toBe(12);
  });

  test("deve alterar as séries", () => {
    const exercicio: Exercicio = {
      id: "2",
      nome: "Agachamento",
      grupoMuscular: "Pernas",
      series: 3,
      repeticoes: 10
    };

    exercicio.series = 5;

    expect(exercicio.series).toBe(5);
  });
});