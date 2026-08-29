import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {
    ArrowLeft,
    Check,
    Crown,
    Minus,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    X
} from "lucide-react";

type Unit = {
    id: number;
    name: string;
    type: string;
    points: number;
}

type ArmyUnit = Unit & {
    quantity: number;
}

const ArmyPage = () => {

    const navigate = useNavigate();
    const {armyId} = useParams();

    const armies = [
        {
            id: 1,
            name: "Titan's Wrath",
            faction: "Grey Knights",
            detachment: "Banishers",
            pointsLimit: 2000
        },
        {
            id: 2,
            name: "Golden Host",
            faction: "Adeptus Custodes",
            detachment: "Lions of the Emperor",
            pointsLimit: 2000
        },
        {
            id: 3,
            name: "Exodites",
            faction: "Aeldari",
            detachment: "Aspect Host",
            pointsLimit: 2000
        }
    ]


    const greyKnightsUnits: Unit[] = [
        {
            id: 1,
            name: "Brotherhood Librarian",
            type: "Character",
            points: 120
        },
        {
            id: 2,
            name: "Strike Squad",
            type: "Battleline",
            points: 120
        },
        {
            id: 3,
            name: "Terminator Squad",
            type: "Infantry",
            points: 200
        },
        {
            id: 4,
            name: "Paladin Squad",
            type: "Infantry",
            points: 225
        },
        {
            id: 5,
            name: "Nemesis Dreadknight",
            type: "Vehicle",
            points: 210
        }
    ]


    const custodesUnits: Unit[] = [
        {
            id: 6,
            name: "Blade Champion",
            type: "Character",
            points: 120
        },
        {
            id: 7,
            name: "Custodian Guard",
            type: "Battleline",
            points: 180
        },
        {
            id: 8,
            name: "Custodian Wardens",
            type: "Infantry",
            points: 250
        },
        {
            id: 9,
            name: "Allarus Custodians",
            type: "Infantry",
            points: 160
        },
        {
            id: 10,
            name: "Vertus Praetors",
            type: "Mounted",
            points: 180
        }
    ]


    const aeldariUnits: Unit[] = [
        {
            id: 11,
            name: "Autarch",
            type: "Character",
            points: 100
        },
        {
            id: 12,
            name: "Avatar of Khaine",
            type: "Monster",
            points: 335
        },
        {
            id: 13,
            name: "Dire Avengers",
            type: "Aspect Warriors",
            points: 140
        },
        {
            id: 14,
            name: "Howling Banshees",
            type: "Aspect Warriors",
            points: 120
        },
        {
            id: 15,
            name: "Fire Dragons",
            type: "Aspect Warriors",
            points: 130
        },
        {
            id: 16,
            name: "Striking Scorpions",
            type: "Aspect Warriors",
            points: 120
        },
        {
            id: 17,
            name: "Dark Reapers",
            type: "Aspect Warriors",
            points: 130
        },
        {
            id: 18,
            name: "Swooping Hawks",
            type: "Aspect Warriors",
            points: 140
        },
        {
            id: 19,
            name: "Warp Spiders",
            type: "Aspect Warriors",
            points: 140
        },
        {
            id: 20,
            name: "Shining Spears",
            type: "Aspect Warriors",
            points: 150
        }
    ]


    const getAvailableUnits = (faction: string) => {

        if (faction === "Grey Knights") {
            return greyKnightsUnits;
        }

        if (faction === "Adeptus Custodes") {
            return custodesUnits;
        }

        if (faction === "Aeldari") {
            return aeldariUnits;
        }

        return [];
    }


    const getFactionTheme = (faction: string) => {

        if (faction === "Grey Knights") {
            return {
                text: "text-sky-300",
                border: "border-sky-700/50",
                background: "bg-sky-950/40",
                pageBackground: "bg-[#15191e]",
                button: "hover:border-sky-500 hover:text-sky-300",
                progress: "bg-sky-500"
            }
        }

        if (faction === "Adeptus Custodes") {
            return {
                text: "text-[#f0cf6a]",
                border: "border-[#9b7828]/60",
                background: "bg-[#30250d]",
                pageBackground: "bg-[#191409]",
                button: "hover:border-[#e0b84f] hover:text-[#f5dc8a]",
                progress: "bg-[#e0b84f]"
            }
        }

        if (faction === "Aeldari") {
            return {
                text: "text-[#e6dcc3]",
                border: "border-violet-700/40",
                background: "bg-[#211a2b]",
                pageBackground: "bg-[#15121d]",
                button: "hover:border-[#d8c99f] hover:text-[#e6dcc3]",
                progress: "bg-[#d8c99f]"
            }
        }

        return {
            text: "text-gray-300",
            border: "border-gray-700/50",
            background: "bg-gray-900/40",
            pageBackground: "bg-[#0d0f12]",
            button: "hover:border-gray-500 hover:text-white",
            progress: "bg-gray-500"
        }
    }


    const army = armies.find(
        (army) => army.id === Number(armyId)
    );

    const [armyUnits, setArmyUnits] = useState<ArmyUnit[]>([]);
    const [warlordUnitId, setWarlordUnitId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [armyName, setArmyName] = useState(army?.name ?? "");
    const [editedArmyName, setEditedArmyName] = useState(army?.name ?? "");

    if (!army) {

        return (
            <div className="mx-auto max-w-[1300px] px-6 py-8">

                <h1 className="text-2xl font-semibold">
                    Army not found
                </h1>

            </div>
        )
    }


    const factionUnits = getAvailableUnits(army.faction);

    const theme = getFactionTheme(army.faction);


    const currentPoints = armyUnits.reduce(
        (total, unit) => total + (unit.points * unit.quantity),
        0
    );


    const remainingPoints =
        army.pointsLimit - currentPoints;


    const pointsPercentage = Math.min(
        (currentPoints / army.pointsLimit) * 100,
        100
    );


    const pointsOver =
        currentPoints > army.pointsLimit
            ? currentPoints - army.pointsLimit
            : 0;


    const hasWarlord =
        warlordUnitId !== null;


    const pointsValid =
        currentPoints <= army.pointsLimit;


    const unitLimitsValid = armyUnits.every((unit) => {

        if (unit.type === "Character") {
            return unit.quantity <= 3;
        }

        return true;
    });


    const armyValid =
        hasWarlord &&
        pointsValid &&
        unitLimitsValid;


    const getUnitQuantity = (unitId: number) => {

        const armyUnit = armyUnits.find(
            (unit) => unit.id === unitId
        );

        return armyUnit?.quantity ?? 0;
    }


    const sortedAvailableUnits = [...factionUnits]
        .sort((a, b) => {

            if (
                a.type === "Character" &&
                b.type !== "Character"
            ) {
                return -1;
            }

            if (
                a.type !== "Character" &&
                b.type === "Character"
            ) {
                return 1;
            }

            return a.name.localeCompare(b.name);
        })
        .filter((unit) =>
            unit.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            unit.type
                .toLowerCase()
                .includes(search.toLowerCase())
        );


    const sortedArmyUnits = [...armyUnits].sort((a, b) => {

        if (
            a.type === "Character" &&
            b.type !== "Character"
        ) {
            return -1;
        }

        if (
            a.type !== "Character" &&
            b.type === "Character"
        ) {
            return 1;
        }

        return a.name.localeCompare(b.name);
    });


    const handleAddUnit = (unit: Unit) => {

        const existingUnit = armyUnits.find(
            (armyUnit) => armyUnit.id === unit.id
        );


        if (existingUnit) {

            const updatedUnits = armyUnits.map((armyUnit) => {

                if (armyUnit.id === unit.id) {

                    return {
                        ...armyUnit,
                        quantity: armyUnit.quantity + 1
                    }
                }

                return armyUnit;
            });

            setArmyUnits(updatedUnits);

        } else {

            setArmyUnits([
                ...armyUnits,
                {
                    ...unit,
                    quantity: 1
                }
            ]);
        }
    }


    const handleRemoveOne = (unitId: number) => {

        const armyUnit = armyUnits.find(
            (unit) => unit.id === unitId
        );

        if (!armyUnit) {
            return;
        }


        if (armyUnit.quantity === 1) {

            handleDeleteUnit(unitId);
            return;
        }


        const updatedUnits = armyUnits.map((unit) => {

            if (unit.id === unitId) {

                return {
                    ...unit,
                    quantity: unit.quantity - 1
                }
            }

            return unit;
        });


        setArmyUnits(updatedUnits);
    }


    const handleDeleteUnit = (unitId: number) => {

        const updatedUnits = armyUnits.filter(
            (unit) => unit.id !== unitId
        );


        setArmyUnits(updatedUnits);


        if (warlordUnitId === unitId) {
            setWarlordUnitId(null);
        }
    }


    const handleDeleteRegularCopies = (unitId: number) => {

        if (warlordUnitId === unitId) {

            const updatedUnits = armyUnits.map((unit) => {

                if (unit.id === unitId) {

                    return {
                        ...unit,
                        quantity: 1
                    }
                }

                return unit;
            });


            setArmyUnits(updatedUnits);

        } else {

            handleDeleteUnit(unitId);
        }
    }


    const handleDeleteWarlord = (unitId: number) => {

        const armyUnit = armyUnits.find(
            (unit) => unit.id === unitId
        );


        if (!armyUnit) {
            return;
        }


        if (armyUnit.quantity === 1) {

            const updatedUnits = armyUnits.filter(
                (unit) => unit.id !== unitId
            );

            setArmyUnits(updatedUnits);

        } else {

            const updatedUnits = armyUnits.map((unit) => {

                if (unit.id === unitId) {

                    return {
                        ...unit,
                        quantity: unit.quantity - 1
                    }
                }

                return unit;
            });

            setArmyUnits(updatedUnits);
        }


        setWarlordUnitId(null);
    }


    const handleSetWarlord = (unit: ArmyUnit) => {

        if (unit.type !== "Character") {
            alert("Only a Character can be selected as Warlord.");
            return;
        }

        setWarlordUnitId(unit.id);
    }


    const handleRemoveWarlord = () => {
        setWarlordUnitId(null);
    }


    const handleSaveArmy = () => {

        if (!armyValid) {
            alert("The army must be valid before it can be saved.");
            return;
        }


        const savedArmy = {
            id: army.id,
            name: armyName,
            faction: army.faction,
            detachment: army.detachment,
            pointsLimit: army.pointsLimit,
            currentPoints,
            warlordUnitId,
            units: armyUnits
        }


        console.log("Saved Army:", savedArmy);

        alert("Army saved successfully.");
    }


    const handleStartRename = () => {

        setEditedArmyName(armyName);
        setIsEditingName(true);
    }


    const handleSaveName = () => {

        if (!editedArmyName.trim()) {
            alert("Army name cannot be empty.");
            return;
        }

        setArmyName(editedArmyName.trim());

        setIsEditingName(false);
    }


    const handleCancelRename = () => {

        setEditedArmyName(armyName);

        setIsEditingName(false);
    }


    const handleDeleteArmy = () => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${armyName}?`
        );


        if (!confirmDelete) {
            return;
        }


        console.log("Deleted army:", army.id);

        navigate("/");
    }


    return (
        <div className={`min-h-screen ${theme.pageBackground}`}>

            <div className="mx-auto max-w-[1300px] px-6 py-8">


                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                    <button
                        onClick={() => navigate("/")}
                        className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-white"
                    >
                        <ArrowLeft size={18}/>
                        Back to My Armies
                    </button>


                    <div className="flex gap-3">

                        <span
                            title={
                                armyValid
                                    ? ""
                                    : "You can not save the army while the list is invalid."
                            }
                        >
                            <button
                                onClick={handleSaveArmy}
                                disabled={!armyValid}
                                className={`flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm transition ${
                                    armyValid
                                        ? `cursor-pointer ${theme.button}`
                                        : "cursor-not-allowed opacity-40"
                                }`}
                            >
                                <Save size={17}/>
                                Save Army
                            </button>
                        </span>

                        <button
                            onClick={handleDeleteArmy}
                            className="flex cursor-pointer items-center gap-2 rounded-md border border-red-900/60 bg-red-950/30 px-4 py-2 text-sm text-red-300 transition hover:border-red-500 hover:bg-red-950/50"
                        >
                            <Trash2 size={17}/>
                            Delete
                        </button>

                    </div>

                </div>

                <div className={`mb-8 rounded-lg border p-6 ${theme.border} ${theme.background}`}>

                    <p className={`text-sm uppercase tracking-wider ${theme.text}`}>
                        {army.faction}
                    </p>

                    {!isEditingName && (

                        <div className="mt-1 flex items-center gap-3">

                            <h1 className="text-3xl font-semibold">
                                {armyName}
                            </h1>

                            <button
                                onClick={handleStartRename}
                                className="cursor-pointer text-muted transition hover:text-white"
                            >
                                <Pencil size={18}/>
                            </button>

                        </div>

                    )}


                    {isEditingName && (

                        <div className="mt-2 flex max-w-[500px] items-center gap-2">

                            <input
                                type="text"
                                value={editedArmyName}
                                onChange={(event) =>
                                    setEditedArmyName(event.target.value)
                                }
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-white outline-none focus:border-gray-500"
                            />


                            <button
                                onClick={handleSaveName}
                                className="flex cursor-pointer items-center justify-center rounded-md border border-green-800 p-2 text-green-400 hover:bg-green-950/40"
                            >
                                <Check size={18}/>
                            </button>


                            <button
                                onClick={handleCancelRename}
                                className="flex cursor-pointer items-center justify-center rounded-md border border-border p-2 text-muted hover:text-white"
                            >
                                <X size={18}/>
                            </button>

                        </div>

                    )}


                    <p className="mt-2 text-sm text-gray-400">
                        {army.detachment}
                    </p>

                </div>


                <div className="mb-6 grid gap-4 sm:grid-cols-4">

                    <div
                        className={`rounded-lg border bg-card p-5 ${
                            pointsValid
                                ? "border-border"
                                : "border-red-600/70"
                        }`}
                    >

                        <p className="text-sm text-muted">
                            Army Points
                        </p>

                        <p
                            className={`mt-1 text-2xl font-semibold ${
                                pointsValid
                                    ? theme.text
                                    : "text-red-400"
                            }`}
                        >
                            {currentPoints}
                        </p>

                    </div>


                    <div className="rounded-lg border border-border bg-card p-5">

                        <p className="text-sm text-muted">
                            Points Limit
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            {army.pointsLimit}
                        </p>

                    </div>


                    <div
                        className={`rounded-lg border bg-card p-5 ${
                            pointsValid
                                ? "border-border"
                                : "border-red-600/70"
                        }`}
                    >

                        <p className="text-sm text-muted">
                            Remaining
                        </p>

                        <p
                            className={`mt-1 text-2xl font-semibold ${
                                pointsValid
                                    ? ""
                                    : "text-red-400"
                            }`}
                        >
                            {remainingPoints}
                        </p>

                    </div>


                    <div
                        className={`rounded-lg border p-5 ${
                            armyValid
                                ? "border-green-700/50 bg-green-950/30"
                                : "border-red-700/50 bg-red-950/30"
                        }`}
                    >

                        <p className="text-sm text-muted">
                            Army Status
                        </p>

                        <p
                            className={`mt-1 text-lg font-semibold ${
                                armyValid
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {armyValid
                                ? "Army Valid"
                                : "Army Invalid"
                            }
                        </p>

                    </div>

                </div>


                <div
                    className={`mb-8 rounded-lg border bg-card p-5 ${
                        pointsValid
                            ? "border-border"
                            : "border-red-600/70"
                    }`}
                >

                    <div className="mb-3 flex justify-between text-sm">

                        <span className="text-muted">
                            Army Progress
                        </span>

                        <span
                            className={`font-medium ${
                                pointsValid
                                    ? ""
                                    : "text-red-400"
                            }`}
                        >
                            {Math.round(
                                (currentPoints / army.pointsLimit) * 100
                            )}%
                        </span>

                    </div>


                    <div className="h-3 overflow-hidden rounded-full bg-background">

                        <div
                            className={`h-full rounded-full transition-all ${
                                pointsValid
                                    ? theme.progress
                                    : "bg-red-500"
                            }`}
                            style={{
                                width: `${pointsPercentage}%`
                            }}
                        />

                    </div>


                    {!pointsValid && (

                        <p className="mt-3 text-sm font-medium text-red-400">
                            Army is {pointsOver} points over the limit.
                        </p>

                    )}

                </div>


                <div className="mb-8 rounded-lg border border-border bg-card p-5">

                    <h2 className="mb-4 font-semibold">
                        Army Validation
                    </h2>


                    <div className="grid gap-3 sm:grid-cols-3">

                        <div className="flex items-center gap-2">

                            {hasWarlord ? (

                                <Check
                                    size={18}
                                    className="text-green-400"
                                />

                            ) : (

                                <X
                                    size={18}
                                    className="text-red-400"
                                />

                            )}

                            <span
                                className={`text-sm ${
                                    hasWarlord
                                        ? ""
                                        : "text-red-300"
                                }`}
                            >
                                {hasWarlord
                                    ? "Warlord selected"
                                    : "Warlord required"
                                }
                            </span>

                        </div>


                        <div className="flex items-center gap-2">

                            {pointsValid ? (

                                <Check
                                    size={18}
                                    className="text-green-400"
                                />

                            ) : (

                                <X
                                    size={18}
                                    className="text-red-400"
                                />

                            )}

                            <span
                                className={`text-sm ${
                                    pointsValid
                                        ? ""
                                        : "text-red-300"
                                }`}
                            >
                                {pointsValid
                                    ? "Points within limit"
                                    : `Army exceeds points limit by ${pointsOver} points`
                                }
                            </span>

                        </div>


                        <div className="flex items-center gap-2">

                            {unitLimitsValid ? (

                                <Check
                                    size={18}
                                    className="text-green-400"
                                />

                            ) : (

                                <X
                                    size={18}
                                    className="text-red-400"
                                />

                            )}

                            <span
                                className={`text-sm ${
                                    unitLimitsValid
                                        ? ""
                                        : "text-red-300"
                                }`}
                            >
                                {unitLimitsValid
                                    ? "Character limit respected"
                                    : "Character limit is 3 copies"
                                }
                            </span>

                        </div>

                    </div>

                </div>


                <div className="grid gap-8 lg:grid-cols-2">


                    <div>

                        <div className="mb-4">

                            <h2 className="text-xl font-semibold">
                                Add Units
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Available {army.faction} units
                            </p>

                        </div>


                        <div className="relative mb-4">

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
                                placeholder="Search units..."
                                className="w-full rounded-md border border-border bg-card py-3 pl-10 pr-4 text-white outline-none transition focus:border-gray-500"
                            />

                        </div>


                        <div className="flex flex-col gap-3">

                            {sortedAvailableUnits.map((unit) => {

                                const quantity =
                                    getUnitQuantity(unit.id);

                                const characterLimitExceeded =
                                    unit.type === "Character" &&
                                    quantity > 3;


                                return (

                                    <div
                                        key={unit.id}
                                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition hover:bg-card-hover"
                                    >

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <h3 className="font-medium">
                                                    {unit.name}
                                                </h3>


                                                {unit.type === "Character" && (

                                                    <Crown
                                                        size={14}
                                                        className="text-amber-300"
                                                    />

                                                )}

                                            </div>


                                            <div className="mt-1 flex gap-3 text-sm text-muted">

                                                <span>
                                                    {unit.type}
                                                </span>


                                                {unit.type === "Character" && (

                                                    <span
                                                        className={
                                                            characterLimitExceeded
                                                                ? "font-semibold text-red-400"
                                                                : ""
                                                        }
                                                    >
                                                        {quantity} / 3
                                                    </span>

                                                )}

                                            </div>

                                        </div>


                                        <div className="flex items-center gap-4">

                                            <span className="text-sm font-semibold">
                                                {unit.points} pts
                                            </span>


                                            <button
                                                onClick={() =>
                                                    handleAddUnit(unit)
                                                }
                                                className={`flex cursor-pointer items-center justify-center rounded-md border border-border p-2 transition ${theme.button}`}
                                            >
                                                <Plus size={18}/>
                                            </button>

                                        </div>

                                    </div>

                                )
                            })}


                            {sortedAvailableUnits.length === 0 && (

                                <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted">
                                    No units found.
                                </div>

                            )}

                        </div>

                    </div>


                    <div>

                        <div className="mb-4">

                            <h2 className="text-xl font-semibold">
                                Army
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                {currentPoints} / {army.pointsLimit} points
                            </p>

                        </div>


                        {armyUnits.length === 0 && (

                            <div className={`rounded-lg border p-8 text-center ${theme.border} ${theme.background}`}>

                                <p className="text-sm text-muted">
                                    Your army is empty.
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add units from the list on the left.
                                </p>

                            </div>

                        )}


                        <div className="flex flex-col gap-3">

                            {sortedArmyUnits.map((unit) => {

                                const isWarlord =
                                    warlordUnitId === unit.id;

                                const regularQuantity =
                                    isWarlord
                                        ? unit.quantity - 1
                                        : unit.quantity;

                                const characterLimitExceeded =
                                    unit.type === "Character" &&
                                    unit.quantity > 3;


                                return (

                                    <div
                                        key={unit.id}
                                        className="flex flex-col gap-3"
                                    >


                                        {isWarlord && (

                                            <div className="rounded-lg border border-amber-700/60 bg-amber-950/20 p-4">

                                                <div className="flex items-center justify-between gap-4">

                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h3 className="font-medium">
                                                                {unit.name}
                                                            </h3>


                                                            <span className="flex items-center gap-1 rounded-md bg-amber-950/60 px-2 py-1 text-xs font-semibold text-amber-300">

                                                                <Crown size={13}/>

                                                                Warlord

                                                            </span>

                                                        </div>


                                                        <p className="mt-1 text-sm text-muted">
                                                            {unit.type}
                                                        </p>

                                                    </div>


                                                    <div className="text-right">

                                                        <p className="text-sm font-semibold text-amber-300">
                                                            {unit.points} pts
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                                                    <button
                                                        onClick={handleRemoveWarlord}
                                                        className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-amber-500 hover:text-amber-300"
                                                    >
                                                        <Crown size={16}/>
                                                        Remove Warlord
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDeleteWarlord(unit.id)
                                                        }
                                                        className="cursor-pointer text-muted transition hover:text-red-400"
                                                    >
                                                        <Trash2 size={18}/>
                                                    </button>

                                                </div>

                                            </div>

                                        )}


                                        {regularQuantity > 0 && (

                                            <div
                                                className={`rounded-lg border bg-card p-4 ${
                                                    characterLimitExceeded
                                                        ? "border-red-600/70"
                                                        : theme.border
                                                }`}
                                            >

                                                <div className="flex items-center justify-between gap-4">

                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h3 className="font-medium">
                                                                {unit.name}
                                                            </h3>


                                                            {regularQuantity > 1 && (

                                                                <span className="rounded bg-background px-2 py-1 text-xs font-semibold text-gray-300">
                                                                    x{regularQuantity}
                                                                </span>

                                                            )}

                                                        </div>


                                                        <p className="mt-1 text-sm text-muted">
                                                            {unit.type}
                                                        </p>


                                                        {characterLimitExceeded && (

                                                            <p className="mt-2 text-xs font-semibold text-red-400">
                                                                Character limit is 3 copies
                                                            </p>

                                                        )}

                                                    </div>


                                                    <div className="text-right">

                                                        <p
                                                            className={`text-sm font-semibold ${
                                                                characterLimitExceeded
                                                                    ? "text-red-400"
                                                                    : theme.text
                                                            }`}
                                                        >
                                                            {unit.points * regularQuantity} pts
                                                        </p>


                                                        {regularQuantity > 1 && (

                                                            <p className="mt-1 text-xs text-muted">
                                                                {unit.points} each
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>


                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                                                    <div className="flex items-center gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleRemoveOne(unit.id)
                                                            }
                                                            className="flex cursor-pointer items-center justify-center rounded-md border border-border p-2 text-muted transition hover:text-white"
                                                        >
                                                            <Minus size={16}/>
                                                        </button>


                                                        <span
                                                            className={`min-w-[30px] text-center text-sm font-semibold ${
                                                                characterLimitExceeded
                                                                    ? "text-red-400"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {regularQuantity}
                                                        </span>


                                                        <button
                                                            onClick={() =>
                                                                handleAddUnit(unit)
                                                            }
                                                            className={`flex cursor-pointer items-center justify-center rounded-md border border-border p-2 transition ${theme.button}`}
                                                        >
                                                            <Plus size={16}/>
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDeleteRegularCopies(unit.id)
                                                            }
                                                            className="ml-2 cursor-pointer text-muted transition hover:text-red-400"
                                                        >
                                                            <Trash2 size={18}/>
                                                        </button>

                                                    </div>


                                                    {unit.type === "Character" &&
                                                        !isWarlord && (

                                                            <button
                                                                onClick={() =>
                                                                    handleSetWarlord(unit)
                                                                }
                                                                className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-amber-500 hover:text-amber-300"
                                                            >
                                                                <Crown size={16}/>
                                                                Make Warlord
                                                            </button>

                                                        )}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                )
                            })}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ArmyPage;