import os
import json
import re
import random
from pathlib import Path
from typing import List, Tuple, Optional, dict
from rank_bm25 import BM25Okapi

class TradingMemoryLog:
    """Append-only markdown log of trading decisions and reflections."""
    RATINGS = {"buy", "overweight", "hold", "underweight", "sell"}
    _SEPARATOR = "\n\n<!-- ENTRY_END -->\n\n"
    _DECISION_RE = re.compile(r"DECISION:\n(.*?)(?=\nREFLECTION:|\Z)", re.DOTALL)
    _REFLECTION_RE = re.compile(r"REFLECTION:\n(.*?)$", re.DOTALL)
    _RATING_LABEL_RE = re.compile(r"rating.*?[:\-][\s*]*(\w+)", re.IGNORECASE)

    def __init__(self, config: dict = None):
        self._log_path = None
        path = (config or {}).get("memory_log_path")
        if path:
            self._log_path = Path(path).expanduser()
            self._log_path.parent.mkdir(parents=True, exist_ok=True)

    def store_decision(self, ticker: str, trade_date: str, final_trade_decision: str) -> None:
        if not self._log_path: return
        if self._log_path.exists():
            raw = self._log_path.read_text(encoding="utf-8")
            for line in raw.splitlines():
                if line.startswith(f"[{trade_date} | {ticker} |") and line.endswith("| pending]"):
                    return
        rating = self._parse_rating(final_trade_decision)
        tag = f"[{trade_date} | {ticker} | {rating} | pending]"
        entry = f"{tag}\n\nDECISION:\n{final_trade_decision}{self._SEPARATOR}"
        with open(self._log_path, "a", encoding="utf-8") as f:
            f.write(entry)

    def load_entries(self) -> List[dict]:
        if not self._log_path or not self._log_path.exists():
            return []
        text = self._log_path.read_text(encoding="utf-8")
        raw_entries = [e.strip() for e in text.split(self._SEPARATOR) if e.strip()]
        entries = []
        for raw in raw_entries:
            parsed = self._parse_entry(raw)
            if parsed: entries.append(parsed)
        return entries

    def get_pending_entries(self) -> List[dict]:
        return [e for e in self.load_entries() if e.get("pending")]

    def update_with_outcome(self, ticker: str, trade_date: str, raw_return: float, alpha_return: float, holding_days: int, reflection: str) -> None:
        if not self._log_path or not self._log_path.exists(): return
        text = self._log_path.read_text(encoding="utf-8")
        blocks = text.split(self._SEPARATOR)
        pending_prefix = f"[{trade_date} | {ticker} |"
        raw_pct, alpha_pct = f"{raw_return:+.1%}", f"{alpha_return:+.1%}"
        updated, new_blocks = False, []
        for block in blocks:
            stripped = block.strip()
            if not stripped:
                new_blocks.append(block); continue
            lines = stripped.splitlines()
            tag_line = lines[0].strip()
            if not updated and tag_line.startswith(pending_prefix) and tag_line.endswith("| pending]"):
                fields = [f.strip() for f in tag_line[1:-1].split("|")]
                rating = fields[2]
                new_tag = f"[{trade_date} | {ticker} | {rating} | {raw_pct} | {alpha_pct} | {holding_days}d]"
                rest = "\n".join(lines[1:])
                new_blocks.append(f"{new_tag}\n\n{rest.lstrip()}\n\nREFLECTION:\n{reflection}")
                updated = True
            else: new_blocks.append(block)
        if not updated: return
        new_text = self._SEPARATOR.join(new_blocks)
        tmp_path = self._log_path.with_suffix(".tmp")
        tmp_path.write_text(new_text, encoding="utf-8")
        tmp_path.replace(self._log_path)

    def _parse_rating(self, text: str) -> str:
        for line in text.splitlines():
            m = self._RATING_LABEL_RE.search(line)
            if m and m.group(1).lower() in self.RATINGS: return m.group(1).capitalize()
        for line in text.splitlines():
            for word in line.lower().split():
                clean = word.strip("*:.,")
                if clean in self.RATINGS: return clean.capitalize()
        return "Hold"

    def _parse_entry(self, raw: str) -> Optional[dict]:
        lines = raw.strip().splitlines()
        if not lines: return None
        tag_line = lines[0].strip()
        if not (tag_line.startswith("[") and tag_line.endswith("]")): return None
        fields = [f.strip() for f in tag_line[1:-1].split("|")]
        if len(fields) < 4: return None
        entry = {
            "date": fields[0], "ticker": fields[1], "rating": fields[2],
            "pending": fields[3] == "pending",
            "raw": fields[3] if fields[3] != "pending" else None,
            "alpha": fields[4] if len(fields) > 4 else None,
            "holding": fields[5] if len(fields) > 5 else None,
        }
        body = "\n".join(lines[1:]).strip()
        decision_match = self._DECISION_RE.search(body)
        reflection_match = self._REFLECTION_RE.search(body)
        entry["decision"] = decision_match.group(1).strip() if decision_match else ""
        entry["reflection"] = reflection_match.group(1).strip() if reflection_match else ""
        return entry

class NeuralMemory:
    """Uses BM25 for situation retrieval."""
    def __init__(self, name: str, config: dict = None):
        self.name = name
        self.config = config or {}
        self.documents: List[str] = []
        self.recommendations: List[str] = []
        self.bm25 = None
        project_dir = self.config.get("project_dir", os.getcwd())
        self.memory_file = os.path.join(project_dir, "dataflows/data_cache", f"memories_{self.name}.json")
        self._load_memory()

    def _load_memory(self):
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.documents, self.recommendations = data.get("documents", []), data.get("recommendations", [])
                if self.documents: self._rebuild_index()
            except Exception as e: print(f"Error loading memory {self.name}: {e}")

    def _save_memory(self):
        try:
            os.makedirs(os.path.dirname(self.memory_file), exist_ok=True)
            with open(self.memory_file, "w", encoding="utf-8") as f:
                json.dump({"documents": self.documents, "recommendations": self.recommendations}, f, indent=4)
        except Exception as e: print(f"Error saving memory {self.name}: {e}")

    def _rebuild_index(self):
        tokenized_docs = [doc.lower().split() for doc in self.documents]
        self.bm25 = BM25Okapi(tokenized_docs)

    def add_situations(self, situations_and_advice: List[Tuple[str, str]]):
        for s, r in situations_and_advice:
            self.documents.append(s); self.recommendations.append(r)
        self._rebuild_index(); self._save_memory()

    def get_memories(self, current_situation: str, n_matches: int = 1) -> List[dict]:
        if not self.documents or self.bm25 is None: return []
        query = current_situation.lower().split()
        scores = self.bm25.get_scores(query)
        top_n = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:n_matches]
        return [{"situation": self.documents[i], "recommendation": self.recommendations[i], "score": float(scores[i])} for i in top_n]
