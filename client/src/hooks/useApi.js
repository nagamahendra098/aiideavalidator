const API = import.meta.env.VITE_API_URL || "";

export async function fetchIdeas() {
  const res = await fetch(`${API}/ideas`);
  if (!res.ok) throw new Error("Failed to fetch ideas");
  return res.json();
}

export async function fetchIdea(id) {
  const res = await fetch(`${API}/ideas/${id}`);
  if (!res.ok) throw new Error("Failed to fetch idea");
  return res.json();
}

export async function submitIdea(data) {
  const res = await fetch(`${API}/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit idea");
  return res.json();
}

export async function deleteIdea(id) {
  const res = await fetch(`${API}/ideas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete idea");
  return res.json();
}
