import soft from '../assets/compound_svgs/comp_soft.svg?react';
import wet from '../assets/compound_svgs/comp_wet.svg?react';
import mid from '../assets/compound_svgs/comp_medium.svg?react';
import inter from '../assets/compound_svgs/comp_inter.svg?react';
import hard from '../assets/compound_svgs/comp_hard.svg?react';
import unknown from '../assets/compound_svgs/comp_unknown.svg?react';


export const CompoundsMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    soft: soft,
    medium: mid,
    wet: wet,
    hard: hard,
    intermediate: inter,
    unknown: unknown
};