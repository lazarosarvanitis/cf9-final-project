import {useEffect, useState} from "react";
import {Plus, Search, X} from "lucide-react";
import {useNavigate} from "react-router";

import ArmyCard from "../components/ArmyCard.tsx";

import {
    getMyArmies
} from "../services/armyService";

import type {
    ArmyListItem
} from "../services/armyService";


const ArmyListPage = () => {

    const navigate = useNavigate();

    const [armies, setArmies] =
        useState<ArmyListItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showSearch, setShowSearch] =
        useState(false);

    const [search, setSearch] =
        useState("");


    useEffect(() => {

        const loadArmies = async () => {

            try {

                const armyData =
                    await getMyArmies();

                setArmies(armyData);

            } catch (error) {

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Could not load armies");
                }

            } finally {
                setLoading(false);
            }
        }


        loadArmies();

    }, []);


    const filteredArmies =
        armies.filter((army) => {

            const searchValue =
                search.toLowerCase();

            return (
                army.name
                    .toLowerCase()
                    .includes(searchValue) ||

                army.faction
                    .toLowerCase()
                    .includes(searchValue) ||

                army.detachment
                    .toLowerCase()
                    .includes(searchValue)
            );
        });


    const handleSearchToggle = () => {

        if (showSearch) {
            setSearch("");
        }

        setShowSearch(
            !showSearch
        );
    }


    return (
        <div className="mx-auto max-w-[1500px] px-6 py-8">

            <div className="mb-8">

                <h1 className="text-2xl font-semibold">
                    My Army Lists
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Build and manage your Warhammer 40,000 army lists.
                </p>

            </div>


            {error && (

                <div className="mb-6 rounded-md border border-red-800 bg-red-950/30 p-4 text-sm text-red-300">
                    {error}
                </div>

            )}


            {showSearch && (

                <div className="relative mb-6 max-w-[500px]">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search armies..."
                        autoFocus
                        className="w-full rounded-md border border-border bg-card py-3 pl-10 pr-10 text-white outline-none transition focus:border-gray-500"
                    />

                    {search && (

                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition hover:text-white"
                        >
                            <X size={18}/>
                        </button>

                    )}

                </div>

            )}


            <div className="flex gap-4 overflow-x-auto pb-5">

                {/* CREATE ARMY */}
                <button
                    onClick={() => navigate("/armies/create")}
                    className="
                        flex h-[270px] min-w-[110px] cursor-pointer
                        items-center justify-center rounded-lg
                        border border-border bg-card
                        transition hover:bg-card-hover
                    "
                >
                    <Plus
                        size={36}
                        strokeWidth={1.5}
                    />
                </button>


                {/* SEARCH */}
                <button
                    onClick={handleSearchToggle}
                    className={`
                        flex h-[270px] min-w-[110px] cursor-pointer
                        items-center justify-center rounded-lg
                        border bg-card
                        transition hover:bg-card-hover
                        ${
                            showSearch
                                ? "border-gray-500"
                                : "border-border"
                        }
                    `}
                >
                    {showSearch ? (

                        <X
                            size={30}
                            strokeWidth={1.5}
                        />

                    ) : (

                        <Search
                            size={30}
                            strokeWidth={1.5}
                        />

                    )}
                </button>


                {/* LOADING */}
                {loading && (

                    <div className="
                        flex h-[270px] min-w-[260px]
                        items-center justify-center rounded-lg
                        border border-border bg-card
                        text-sm text-muted
                    ">
                        Loading armies...
                    </div>

                )}


                {/* EMPTY */}
                {!loading &&
                    !error &&
                    armies.length === 0 && (

                        <div className="
                            flex h-[270px] min-w-[260px]
                            items-center justify-center rounded-lg
                            border border-border bg-card
                            px-6 text-center text-sm text-muted
                        ">
                            You do not have any armies yet.
                        </div>

                    )}


                {/* NO SEARCH RESULTS */}
                {!loading &&
                    !error &&
                    armies.length > 0 &&
                    filteredArmies.length === 0 && (

                        <div className="
                            flex h-[270px] min-w-[260px]
                            items-center justify-center rounded-lg
                            border border-border bg-card
                            px-6 text-center text-sm text-muted
                        ">
                            No armies found.
                        </div>

                    )}


                {/* ARMY CARDS */}
                {!loading &&
                    filteredArmies.map((army) => (

                        <ArmyCard
                            key={army.id}
                            id={army.id}
                            name={army.name}
                            faction={army.faction}
                            detachment={army.detachment}
                            points={army.points}
                            pointsLimit={army.pointsLimit}
                        />

                    ))}

            </div>

        </div>
    )
}


export default ArmyListPage;


