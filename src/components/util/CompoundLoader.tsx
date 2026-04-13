import { CompoundsMap } from "../../circuits/Coumpounds";

const CompoundLoader = ({compound}:{compound: string}) => {
    const CompoundComponent = CompoundsMap[compound.toLowerCase()];

    return (<CompoundComponent className="w-7 h-7 m-2"/>)
}
export default CompoundLoader;