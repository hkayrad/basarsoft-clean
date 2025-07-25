import type { WktFeature } from "../../types";
import { getAllFeatures } from "../api/features/get";

export default function loadFeatureData(setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>) {
    getAllFeatures(setWktFeatures);
}
