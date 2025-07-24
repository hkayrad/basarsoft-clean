import React from "react";

type FeaturesContextType = {
    features: FeatureDto[];
    setFeatures: React.Dispatch<React.SetStateAction<FeatureDto[]>> | null;
}

const FeaturesContext = React.createContext<FeaturesContextType>({
    features: [],
    setFeatures: null
});

export default FeaturesContext;
