import { useThreeContext } from "@/app/context/ThreeContext";
import * as THREE from "three";

type Props = {
  cls?: string;
};
export default function InfraMenu({}: Props) {
  const { addObject } = useThreeContext();
  // const [opened, setOpened] = useState<boolean>(false);

  return (
    <div
      className={`absolute top-0 left-0 bg-white shadow-lg w-[250px] h-full`}
    >
      <div className="flex justify-center items-center border-b-[3px]">
        <Tab cls="flex-1" text="Azure" />
        <Tab cls="flex-1" text="GCP" />
        <Tab cls="flex-1" text="AWS" active={true} />
      </div>
      <h3 className="text-center select-none">Components</h3>
      <div className="flex flex-col">
        <div
          className="select-none cursor-pointer hover:bg-slate-50 h-[40px] leading-[40px]"
          onClick={(event) => {
            event.preventDefault();

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshMatcapMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            geometry.translate(0, 0.5, 0);
            addObject(cube);
          }}
        >
          Cube
        </div>
      </div>
    </div>
  );
}

type TabProps = {
  text?: string;
  icon?: string;
  cls?: string;
  active?: boolean;
};
function Tab({ cls, text, active = false }: TabProps) {
  const hover = "hover:text-white hover:bg-slate-400";
  const height = "h-[50px] leading-[50px]";
  const bg = active && "bg-slate-400 text-white";
  return (
    <div
      className={`transition-colors	text-center cursor-pointer select-none ${bg} ${height} ${hover} ${cls}`}
    >
      {text}
    </div>
  );
}
