import React from "react";

type FeaturesContextType = {
    features: FeatureDto[];
    setFeatures: React.Dispatch<React.SetStateAction<FeatureDto[]>> | null;
    getFeatures: () => Promise<void> | null;
}

const FeaturesContext = React.createContext<FeaturesContextType>({
    features: [],
    setFeatures: null,
    getFeatures: () => null
});

export default FeaturesContext;
