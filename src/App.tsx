import {Route, Routes} from "react-router";
import RouterLayout from "./components/RouterLayout.tsx";
import ArmyListPage from "./pages/ArmyListPage.tsx";

function App() {

    return (
        <Routes>

            <Route element={<RouterLayout/>}>
                <Route index element={<ArmyListPage/>}/>
            </Route>

        </Routes>
    )
}

export default App;