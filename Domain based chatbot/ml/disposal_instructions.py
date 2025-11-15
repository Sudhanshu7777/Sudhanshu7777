"""Disposal instruction mapping for EcoSort Assist waste categories."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class DisposalGuidance:
    category: str
    waste_type: str
    instructions: str


CATEGORY_GUIDANCE: Dict[str, DisposalGuidance] = {
    "Organic": DisposalGuidance(
        category="Organic",
        waste_type="Compostable",
        instructions=(
            "Place food scraps and green waste into a compost or green bin."
            " Remove any packaging and keep liquids minimal to prevent odors."
        ),
    ),
    "Recyclable": DisposalGuidance(
        category="Recyclable",
        waste_type="Recyclable",
        instructions=(
            "Ensure paper and cardboard are clean and dry, flatten boxes, and place"
            " them in the blue recycling bin."
        ),
    ),
    "Plastic": DisposalGuidance(
        category="Plastic",
        waste_type="Recyclable",
        instructions=(
            "Rinse bottles and containers, remove caps and labels if possible, and"
            " place them in the plastic recycling stream."
        ),
    ),
    "Metal": DisposalGuidance(
        category="Metal",
        waste_type="Recyclable",
        instructions=(
            "Rinse cans and tins, crush them to save space, and recycle according to"
            " municipal guidelines."
        ),
    ),
    "E-Waste": DisposalGuidance(
        category="E-Waste",
        waste_type="Special Disposal",
        instructions=(
            "Back up data, remove batteries when possible, and drop off electronics"
            " at a certified e-waste collection point."
        ),
    ),
    "Hazardous": DisposalGuidance(
        category="Hazardous",
        waste_type="Hazardous",
        instructions=(
            "Seal chemicals or medical waste in leak-proof containers and deliver"
            " them to a hazardous waste facility. Do not place in regular bins."
        ),
    ),
    "Mixed": DisposalGuidance(
        category="Mixed",
        waste_type="General Waste",
        instructions=(
            "Separate recyclable and compostable items when possible. Place the"
            " remaining waste into the general trash bin."
        ),
    ),
}

DEFAULT_CATEGORY = CATEGORY_GUIDANCE["Mixed"]
CATEGORY_LABELS = list(CATEGORY_GUIDANCE.keys())


def get_guidance(category: str) -> DisposalGuidance:
    """Return disposal guidance for the given category with a safe fallback."""
    return CATEGORY_GUIDANCE.get(category, DEFAULT_CATEGORY)
