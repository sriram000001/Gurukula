from app.models.schemas import QuizAnswer, MasteryEntry

WEAK_THRESHOLD = 60.0


def score_answers(answers: list[QuizAnswer]) -> list[MasteryEntry]:
    """
    Groups answers by learning objective and computes a mastery percentage.
    Simple correct/total ratio — good enough for a 30hr demo.
    Swap for a weighted/IRT model later if time allows.
    """
    by_lo: dict[str, list[bool]] = {}
    for a in answers:
        by_lo.setdefault(a.lo_id, []).append(a.correct)

    mastery = []
    for lo_id, results in by_lo.items():
        pct = (sum(results) / len(results)) * 100
        mastery.append(MasteryEntry(lo_id=lo_id, mastery_pct=round(pct, 1)))
    return mastery


def get_weak_los(mastery_map: list[MasteryEntry]) -> list[str]:
    return [m.lo_id for m in mastery_map if m.mastery_pct < WEAK_THRESHOLD]
