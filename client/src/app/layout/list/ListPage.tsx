import { useState, useEffect, useCallback } from "react";
import { Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { WktFeature } from "../../../types";
import {
    getAllFeatures,
    getFeatureCount,
} from "../../../lib/api/features/get";

import "./style/list.css";
import { deleteFeature } from "../../../lib/api/features/delete";

export default function ListPage() {
    const [features, setFeatures] = useState<WktFeature[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTotalCount = useCallback(async () => {
        const count = await getFeatureCount(searchQuery);
        setTotalCount(count);
    }, [searchQuery]);

    const loadPagedData = useCallback(async () => {
        await getAllFeatures(setFeatures, itemsPerPage, currentPage, searchQuery);
    }, [itemsPerPage, currentPage, searchQuery]);

    useEffect(() => {
        fetchTotalCount();
        loadPagedData();
    }, [fetchTotalCount, loadPagedData]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleDeleteFeature = async (id: number) => {
        await deleteFeature(id);
        await loadPagedData();
        await fetchTotalCount();
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h1>Features</h1>
                <div className="list-controls">
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search features..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <label>
                        Items per page:
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                handleItemsPerPageChange(Number(e.target.value))
                            }
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="table-container">
                <table className="features-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>WKT</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature) => (
                            <tr key={feature.id}>
                                <td>{feature.id}</td>
                                <td>{feature.name || "-"}</td>
                                <td className="geometry-cell">{feature.wkt}</td>
                                <td>
                                    <div className="action-buttons">
                                        {/* <button
                                            className="btn btn-edit"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button> */}
                                        <button
                                            className="btn btn-delete"
                                            title="Delete"
                                            onClick={() =>
                                                handleDeleteFeature(feature.id!)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {features.length === 0 && (
                    <div className="empty-state">
                        <p>No features found</p>
                    </div>
                )}
            </div>

            <div className="pagination">
                <div className="pagination-info">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                    {totalCount} entries
                </div>
                <div className="pagination-controls">
                    <button
                        className="btn btn-pagination"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (page) =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 2
                            )
                            .map((page, index, array) => (
                                <span key={page}>
                                    {index > 0 &&
                                        array[index - 1] !== page - 1 && (
                                            <span className="ellipsis">
                                                ...
                                            </span>
                                        )}
                                    <button
                                        className={`btn btn-page ${
                                            currentPage === page ? "active" : ""
                                        }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </span>
                            ))}
                    </div>

                    <button
                        className="btn btn-pagination"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
