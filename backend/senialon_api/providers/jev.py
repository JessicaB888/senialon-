"""Validación de la respuesta Choice documentada por TypeSafe; sin coerción."""

import math


def validate_jev(data: dict, payload: dict) -> dict:
    if not isinstance(data, dict) or not isinstance(data.get("model"), str) or not data["model"]:
        raise ValueError("JEV no informó el modelo.")
    answers = data.get("answers")
    if not isinstance(answers, dict) or set(answers) != set(payload["questions"]):
        raise ValueError("JEV devolvió preguntas incompatibles.")
    for key, question in payload["questions"].items():
        answer = answers[key]
        if not isinstance(answer, dict) or answer.get("type") != "choice":
            raise ValueError("Tipo de decisión inválido.")
        probabilities = answer.get("probabilities")
        if not isinstance(probabilities, dict) or set(probabilities) != set(question["criteria"]):
            raise ValueError("Categorías incompatibles con los criterios.")
        values = [*probabilities.values(), answer.get("confidence")]
        if any(type(value) not in (int, float) or not math.isfinite(value)
               or not 0 <= value <= 1 for value in values):
            raise ValueError("Probabilidades inválidas.")
        if abs(sum(probabilities.values()) - 1) > .001 or answer.get("choice") not in probabilities:
            raise ValueError("Distribución inválida.")
        if probabilities[answer["choice"]] + 1e-9 < max(probabilities.values()):
            raise ValueError("Decisión incompatible con sus probabilidades.")
    usage = data.get("usage")
    if not isinstance(usage, dict) or any(type(usage.get(key)) is not int or usage[key] < 0
                                         for key in ("input_tokens", "output_tokens")):
        raise ValueError("Uso de JEV inválido o ausente.")
    return data
