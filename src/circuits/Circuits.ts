import React from "react";

const svgFiles = import.meta.glob('../assets/circuits_svgs/*.svg', {
  query: '?react',
  eager: true,
});

export const CircuitMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {};

for (const path in svgFiles) {
  const fileName = path.split('/').pop()?.replace('.svg', '');

  if (fileName) {
    CircuitMap[fileName] = (svgFiles[path] as any).default;
  }
}