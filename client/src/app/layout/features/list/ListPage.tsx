import { useContext } from "react";
import FeaturesContext from "../../../lib/context/featureContext";
import { deleteFeature } from "../../../lib/api/agent";

export default function ListPage() {
    const { features, getFeatures } = useContext(FeaturesContext);

    const handleDelete = async (id: number) => {
        try {
            await deleteFeature(id);
            // Optionally, you can refresh the features list here
            getFeatures();
        } catch (error) {
            console.error("Error deleting feature:", error);
        }
    };

    return (
        <div style={{ paddingBottom: "32px" }}>
            {features.length > 0 ? (
                <table
                    style={{
                        width: "70%",
                        borderCollapse: "collapse",
                        margin: "20px auto",
                        fontSize: "16px",
                        fontFamily: "monospace",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                            <th
                                style={{
                                    padding: "12px 15px",
                                    textAlign: "left",
                                    borderBottom: "2px solid #dee2e6",
                                    fontWeight: "600",
                                    color: "#495057",
                                }}
                            >
                                ID
                            </th>
                            <th
                                style={{
                                    padding: "12px 15px",
                                    textAlign: "left",
                                    borderBottom: "2px solid #dee2e6",
                                    fontWeight: "600",
                                    color: "#495057",
                                }}
                            >
                                Name
                            </th>
                            <th
                                style={{
                                    padding: "12px 15px",
                                    textAlign: "left",
                                    borderBottom: "2px solid #dee2e6",
                                    fontWeight: "600",
                                    color: "#495057",
                                }}
                            >
                                WKT
                            </th>
                            <th
                                style={{
                                    padding: "12px 15px",
                                    textAlign: "center",
                                    borderBottom: "2px solid #dee2e6",
                                    fontWeight: "600",
                                    color: "#495057",
                                    width: "80px",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, index) => (
                            <tr
                                key={feature.id}
                                style={{
                                    backgroundColor:
                                        index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                                    transition: "background-color 0.2s",
                                }}
                            >
                                <td
                                    style={{
                                        padding: "12px 15px",
                                        borderBottom: "1px solid #dee2e6",
                                    }}
                                >
                                    {feature.id}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 15px",
                                        borderBottom: "1px solid #dee2e6",
                                    }}
                                >
                                    {feature.name}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 15px",
                                        borderBottom: "1px solid #dee2e6",
                                        fontSize: "12px",
                                    }}
                                >
                                    {feature.wkt}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 15px",
                                        borderBottom: "1px solid #dee2e6",
                                        textAlign: "center",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                feature.id ? feature.id : 0
                                            )
                                        }
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                            color: "#dc3545",
                                            padding: "5px",
                                            borderRadius: "4px",
                                            transition: "background-color 0.2s",
                                        }}
                                        onMouseEnter={(e) =>
                                            ((
                                                e.target as HTMLElement
                                            ).style.backgroundColor = "#f8d7da")
                                        }
                                        onMouseLeave={(e) =>
                                            ((
                                                e.target as HTMLElement
                                            ).style.backgroundColor =
                                                "transparent")
                                        }
                                        title="Delete feature"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No features available.</p>
            )}
        </div>
    );
}
