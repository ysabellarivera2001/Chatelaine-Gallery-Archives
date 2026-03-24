import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackupPanel from "./BackupPanel";
import CharacterForm from "./CharacterForm";
import CharacterSelector from "./CharacterSelector";

function downloadJson(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ManageView({ charactersApi }) {
  const { characters, addCharacter, updateCharacter, deleteCharacter, exportData, importData } = charactersApi;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedId = Number(searchParams.get("id"));
  const [selectedId, setSelectedId] = useState(
    Number.isInteger(requestedId) && requestedId > 0 ? requestedId : characters[0]?.id ?? null
  );

  useEffect(() => {
    if (Number.isInteger(requestedId) && requestedId > 0) {
      setSelectedId(requestedId);
    }
  }, [requestedId]);

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId) ?? null,
    [characters, selectedId]
  );

  const handleSelect = (id) => {
    setSelectedId(id);
    setSearchParams({ id: String(id) });
  };

  const handleCreateNew = () => {
    setSelectedId(null);
    setSearchParams({});
  };

  const handleSubmit = (formCharacter) => {
    try {
      if (selectedCharacter) {
        const updated = updateCharacter(selectedCharacter.id, formCharacter);
        setSelectedId(updated.id);
        setSearchParams({ id: String(updated.id) });
        navigate(`/profile/${updated.id}`);
        return;
      }

      const created = addCharacter(formCharacter);
      setSelectedId(created.id);
      setSearchParams({ id: String(created.id) });
      navigate(`/profile/${created.id}`);
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleDelete = (id) => {
    const target = characters.find((character) => character.id === id);
    if (!target) return;
    if (!window.confirm(`Delete ${target.name} from the archive?`)) return;

    deleteCharacter(id);
    const nextId = characters.find((character) => character.id !== id)?.id ?? null;
    setSelectedId(nextId);
    if (nextId) {
      setSearchParams({ id: String(nextId) });
    } else {
      setSearchParams({});
    }
  };

  const handleExport = () => {
    downloadJson("oc-recycling-system-backup.json", exportData());
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!window.confirm("Importing will replace the current archive. Continue?")) {
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const imported = importData(text);
      const nextId = imported[0]?.id ?? null;
      setSelectedId(nextId);
      if (nextId) {
        setSearchParams({ id: String(nextId) });
      } else {
        setSearchParams({});
      }
    } catch (error) {
      window.alert(error.message);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-6">
        <CharacterSelector
          characters={characters}
          onCreateNew={handleCreateNew}
          onSelect={handleSelect}
          selectedId={selectedCharacter?.id ?? null}
        />
        <BackupPanel onExport={handleExport} onImport={handleImport} />
      </div>

      <CharacterForm
        characters={characters}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        selectedCharacter={selectedCharacter}
      />
    </div>
  );
}

export default ManageView;
