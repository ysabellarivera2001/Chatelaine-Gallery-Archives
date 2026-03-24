import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import CharacterList from "./components/CharacterList/CharacterList";
import CharacterProfile from "./components/CharacterProfile/CharacterProfile";
import RelationshipsView from "./components/Relationships/RelationshipsView";
import ProgressTracker from "./components/ProgressTracker/ProgressTracker";
import ManageView from "./components/Manage/ManageView";
import { useCharacters } from "./hooks/useCharacters";
import { useFilters } from "./hooks/useFilters";

function App() {
  const charactersApi = useCharacters();
  const filtersApi = useFilters(charactersApi.characters);

  return (
    <Layout characters={charactersApi.characters}>
      <Routes>
        <Route path="/" element={<Dashboard characters={charactersApi.characters} />} />
        <Route
          path="/list"
          element={<CharacterList characters={charactersApi.characters} filtersApi={filtersApi} />}
        />
        <Route
          path="/profile/:id"
          element={<CharacterProfile characters={charactersApi.characters} getCharacter={charactersApi.getCharacter} />}
        />
        <Route
          path="/relationships"
          element={<RelationshipsView characters={charactersApi.characters} getCharacter={charactersApi.getCharacter} />}
        />
        <Route path="/tracker" element={<ProgressTracker characters={charactersApi.characters} />} />
        <Route path="/manage" element={<ManageView charactersApi={charactersApi} />} />
      </Routes>
    </Layout>
  );
}

export default App;
