import {Route, Routes} from "react-router";

import RouterLayout from "./components/RouterLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminRoute from "./components/AdminRoute.tsx";

import ArmyListPage from "./pages/ArmyListPage.tsx";
import CreateArmyPage from "./pages/CreateArmyPage.tsx";
import ArmyPage from "./pages/ArmyPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";


function App() {

    return (
        <Routes>

            <Route
                path="login"
                element={<LoginPage/>}
            />


            <Route element={<ProtectedRoute/>}>

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


                    <Route element={<AdminRoute/>}>

                        <Route
                            path="admin"
                            element={<AdminPage/>}
                        />

                    </Route>

                </Route>

            </Route>

        </Routes>
    )
}


export default App;
