import {Plus, Search} from "lucide-react";
import ArmyCard from "../components/ArmyCard.tsx";

const ArmyListPage = () => {

    const armies = [
        {
            id: 1,
            name: "Titan's Wrath",
            faction: "Grey Knights",
            detachment: "Banishers",
            points: 1985,
            pointsLimit: 2000
        },
        {
            id: 2,
            name: "Golden Host",
            faction: "Adeptus Custodes",
            detachment: "Lion's of the Emperor",
            points: 2000,
            pointsLimit: 2000
        },
        {
            id: 3,
            name: "Exodites",
            faction: "Aeldari",
            detachment: "Aspect Host",
            points: 1975,
            pointsLimit: 2000
        }
    ]

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


            <div className="flex gap-4 overflow-x-auto pb-5">

                {/* CREATE ARMY */}
                <button
                    className="
            flex h-[270px] min-w-[110px] cursor-pointer
            items-center justify-center rounded-lg
            border border-border bg-card
            transition hover:bg-card-hover
          "
                >
                    <Plus size={36} strokeWidth={1.5}/>
                </button>


                {/* SEARCH */}
                <button
                    className="
            flex h-[270px] min-w-[110px] cursor-pointer
            items-center justify-center rounded-lg
            border border-border bg-card
            transition hover:bg-card-hover
          "
                >
                    <Search size={30} strokeWidth={1.5}/>
                </button>


                {/* ARMY CARDS */}
                {armies.map((army) => (
                    <ArmyCard
                        key={army.id}
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