import type { PiEvent } from "./calculations/pi-calculations";
import { writable } from "svelte/store";

export const estimates = writable<PiEvent[]>([]);
