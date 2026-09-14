import {
  Wrench,
  ClipboardCheck,
  Droplets,
  Disc3,
  Link2,
  BatteryCharging,
  Snowflake,
  PlugZap,
  Settings2,
  ScanLine,
} from "lucide-react";
import type { ServiceIcon as IconName } from "@/lib/repair-services";

const icons = {
  wrench: Wrench,
  inspection: ClipboardCheck,
  oil: Droplets,
  brakes: Disc3,
  chain: Link2,
  battery: BatteryCharging,
  ac: Snowflake,
  charging: PlugZap,
  suspension: Settings2,
  electrical: ScanLine,
};
export function ServiceIcon({ name }: { name: IconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />;
}
