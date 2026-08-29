import {useState} from "react";
import {useNavigate} from "react-router";
import {ArrowLeft} from "lucide-react";

const CreateArmyPage = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [faction, setFaction] = useState("");
    const [detachment, setDetachment] = useState("");
    const [pointsLimit, setPointsLimit] = useState(2000);

    const getDetachments = (selectedFaction: string) => {

        if (selectedFaction === "Grey Knights") {
            return ["Banishers"];
        }

        if (selectedFaction === "Adeptus Custodes") {
            return ["Lions of the Emperor"];
        }

        if (selectedFaction === "Aeldari") {
            return ["Aspect Host"];
        }

        return [];
    }

    const handleFactionChange = (selectedFaction: string) => {
        setFaction(selectedFaction);
        setDetachment("");
    }

    const handleSubmit = (event: React.FormEvent) => {

        event.preventDefault();

        const newArmy = {
            name,
            faction,
            detachment,
            pointsLimit
        }

        console.log(newArmy);

        navigate("/");
    }

    return (
        <div className="mx-auto max-w-[900px] px-6 py-8">

            <button
                onClick={() => navigate("/")}
                className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-white"
            >
                <ArrowLeft size={18}/>
                Back to My Armies
            </button>


            <div className="mb-8">

                <h1 className="text-2xl font-semibold">
                    Create Army
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Create a new Warhammer 40,000 army list.
                </p>

            </div>


            <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-border bg-card p-6"
            >

                <div className="mb-6">

                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Army Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Titan's Wrath"
                        required
                        className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none focus:border-gray-500"
                    />

                </div>


                <div className="mb-6">

                    <label
                        htmlFor="faction"
                        className="mb-2 block text-sm font-medium"
                    >
                        Faction
                    </label>

                    <select
                        id="faction"
                        value={faction}
                        onChange={(event) =>
                            handleFactionChange(event.target.value)
                        }
                        required
                        className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none focus:border-gray-500"
                    >

                        <option value="">
                            Select faction
                        </option>

                        <option value="Grey Knights">
                            Grey Knights
                        </option>

                        <option value="Adeptus Custodes">
                            Adeptus Custodes
                        </option>

                        <option value="Aeldari">
                            Aeldari
                        </option>

                    </select>

                </div>


                <div className="mb-6">

                    <label
                        htmlFor="detachment"
                        className="mb-2 block text-sm font-medium"
                    >
                        Detachment
                    </label>

                    <select
                        id="detachment"
                        value={detachment}
                        onChange={(event) =>
                            setDetachment(event.target.value)
                        }
                        required
                        disabled={!faction}
                        className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-gray-500"
                    >

                        <option value="">
                            Select detachment
                        </option>

                        {getDetachments(faction).map((detachment) => (

                            <option
                                key={detachment}
                                value={detachment}
                            >
                                {detachment}
                            </option>

                        ))}

                    </select>

                </div>


                <div className="mb-8">

                    <label
                        htmlFor="points"
                        className="mb-2 block text-sm font-medium"
                    >
                        Points Limit
                    </label>

                    <select
                        id="points"
                        value={pointsLimit}
                        onChange={(event) =>
                            setPointsLimit(Number(event.target.value))
                        }
                        className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none focus:border-gray-500"
                    >

                        <option value={1000}>
                            1000 Points
                        </option>

                        <option value={1500}>
                            1500 Points
                        </option>

                        <option value={2000}>
                            2000 Points
                        </option>

                        <option value={3000}>
                            3000 Points
                        </option>

                    </select>

                </div>


                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="cursor-pointer rounded-md border border-border px-5 py-2.5 text-sm hover:bg-card-hover"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="cursor-pointer rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-gray-200"
                    >
                        Create Army
                    </button>

                </div>

            </form>

        </div>
    )
}

export default CreateArmyPage;