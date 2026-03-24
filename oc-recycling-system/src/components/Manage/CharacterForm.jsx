import { useEffect, useState } from "react";
import { parsePersonality } from "../../data/seed";

const emptyForm = {
  name: "",
  pronouns: "",
  personality: "",
  group: 1,
  colorHex: "#ffffff",
  colorName: "",
  backstory: "",
  appearance: {
    height: "To be decided",
    bodyType: "To be decided",
    hair: "To be decided",
    eyes: "To be decided",
    skin: "To be decided"
  },
  relationshipsText: "",
  excelStatus: false,
  discordStatus: false,
  tumblrStatus: false,
  ao3Status: false
};

function toFormState(character) {
  if (!character) {
    return { ...emptyForm, appearance: { ...emptyForm.appearance } };
  }

  return {
    ...character,
    appearance: { ...character.appearance },
    relationshipsText: character.relationships.join(", ")
  };
}

function CharacterForm({ characters, selectedCharacter, onDelete, onSubmit }) {
  const [form, setForm] = useState(toFormState(selectedCharacter));

  useEffect(() => {
    setForm(toFormState(selectedCharacter));
  }, [selectedCharacter]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("appearance.")) {
      const key = name.split(".")[1];
      setForm((current) => ({
        ...current,
        appearance: {
          ...current.appearance,
          [key]: value
        }
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const relationshipIds = form.relationshipsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map(Number);

    const parsed = parsePersonality(form.personality);

    onSubmit({
      ...selectedCharacter,
      ...form,
      group: Number(form.group),
      mbti: parsed.mbti,
      enneagram: parsed.enneagram,
      relationships: relationshipIds
    });
  };

  const existingIds = characters.map((character) => character.id).join(", ");
  const isEditing = Boolean(selectedCharacter);

  return (
    <form className="space-y-5 rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#ffbcb5]">Character Form</p>
          <h2 className="mt-2 font-serif text-3xl">{isEditing ? `Editing ${selectedCharacter.name}` : "Create a new character"}</h2>
        </div>
        {isEditing ? (
          <button
            className="rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-100 hover:bg-red-500/20"
            onClick={() => onDelete(selectedCharacter.id)}
            type="button"
          >
            Delete character
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Name</span>
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" name="name" onChange={handleChange} value={form.name} />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Pronouns</span>
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" name="pronouns" onChange={handleChange} value={form.pronouns} />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Personality</span>
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            name="personality"
            onChange={handleChange}
            placeholder="6w2 ENFP"
            value={form.personality}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Group</span>
          <select className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" name="group" onChange={handleChange} value={form.group}>
            {[1, 2, 3, 4, 5].map((group) => (
              <option key={group} value={group}>
                Group {group}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Color Hex</span>
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" name="colorHex" onChange={handleChange} value={form.colorHex} />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Color Name</span>
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" name="colorName" onChange={handleChange} value={form.colorName} />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.18em] text-muted">Backstory</span>
        <textarea
          className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          name="backstory"
          onChange={handleChange}
          value={form.backstory}
        />
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#eed495]">Appearance</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {["height", "bodyType", "hair", "eyes", "skin"].map((field) => (
            <label key={field} className="grid gap-2 text-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-muted">{field}</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                name={`appearance.${field}`}
                onChange={handleChange}
                value={form.appearance[field]}
              />
            </label>
          ))}
        </div>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.18em] text-muted">Relationships</span>
        <input
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          name="relationshipsText"
          onChange={handleChange}
          placeholder="Comma-separated IDs, max 4"
          value={form.relationshipsText}
        />
        <span className="text-xs text-muted">Existing IDs: {existingIds}</span>
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#eed495]">Status Flags</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["excelStatus", "Excel"],
            ["discordStatus", "Discord"],
            ["tumblrStatus", "Tumblr"],
            ["ao3Status", "AO3"]
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <input checked={form[name]} name={name} onChange={handleChange} type="checkbox" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black" type="submit">
        {isEditing ? "Update character" : "Create character"}
      </button>
    </form>
  );
}

export default CharacterForm;
