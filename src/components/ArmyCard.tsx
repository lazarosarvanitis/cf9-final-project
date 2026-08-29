import {useNavigate} from "react-router";

type ArmyCardProps = {
    id: number;
    name: string;
    faction: string;
    detachment: string;
    points: number;
    pointsLimit: number;
}

const ArmyCard = ({
                      id,
                      name,
                      faction,
                      detachment,
                      points,
                      pointsLimit
                  }: ArmyCardProps) => {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/armies/${id}`)}
            className="
                flex h-[270px] min-w-[210px] cursor-pointer
                flex-col justify-between rounded-lg
                border border-border bg-card p-5
                transition hover:bg-card-hover
            "
        >

            <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                    {faction}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                    {name}
                </h2>
            </div>

            <div>
                <p className="text-sm text-gray-400">
                    {detachment}
                </p>

                <p className="mt-2 text-sm font-semibold">
                    {points} / {pointsLimit} pts
                </p>
            </div>

        </div>
    )
}

export default ArmyCard;