import {Route, Routes} from "react-router";
import RouterLayout from "./components/RouterLayout.tsx";
import ArmyListPage from "./pages/ArmyListPage.tsx";
import CreateArmyPage from "./pages/CreateArmyPage.tsx";
import ArmyPage from "./pages/ArmyPage.tsx";

function App() {

    return (
        <Routes>

            <Route element={<RouterLayout/>}>

                <Route
                    index
                    element={<ArmyListPage/>}
                />

                <Route
                    path="armies/create"
                    element={<CreateArmyPage/>}
                />

                <Route
                    path="armies/:armyId"
                    element={<ArmyPage/>}
                />

            </Route>

        </Routes>
    )
}

export default App;