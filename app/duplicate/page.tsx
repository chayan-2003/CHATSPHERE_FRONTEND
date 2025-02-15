import Left from "@/components/duplicatestuffs/left";
import Right from "@/components/duplicatestuffs/right";
export default function duplicate()
{
    return (
        <div className="flex">
            <div className="w-1/2">
        <Left />
        </div>
        <div className="w-1/2">
        <Right />
        </div>
        </div>
    )
}