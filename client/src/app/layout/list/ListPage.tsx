import { useState, useEffect, useCallback } from "react";
import {
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MapPin,
} from "lucide-react";
import type { WktFeature } from "../../../types";
import { getAllFeatures, getFeatureCount } from "../../../lib/api/features/get";

import "./style/list.css";
import { deleteFeature } from "../../../lib/api/features/delete";
import { useNavigate } from "react-router";

export default function ListPage() {
    const [features, setFeatures] = useState<WktFeature[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    const fetchTotalCount = useCallback(async () => {
        const count = await getFeatureCount(searchQuery);
        setTotalCount(count);
    }, [searchQuery]);

    const loadPagedData = useCallback(async () => {
        await getAllFeatures(
            setFeatures,
            itemsPerPage,
            currentPage,
            searchQuery,
            sortBy,
            sortOrder
        );
    }, [itemsPerPage, currentPage, searchQuery, sortBy, sortOrder]);

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

    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return <ArrowUpDown size={14} />;
        return sortOrder === "asc" ? (
            <ArrowUp size={14} />
        ) : (
            <ArrowDown size={14} />
        );
    };

    const handleGotoFeature = (id: number) => {
        navigate(`/map?gotoId=${id}`);
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
                    <div className="sort-container">
                        <label>
                            Sort by:
                            <select
                                value={sortBy}
                                name="sort-select"
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="sort-select"
                            >
                                <option value="Id">ID</option>
                                <option value="Name">Name</option>
                            </select>
                        </label>
                        <button
                            className={`btn btn-sort ${sortOrder}`}
                            onClick={() => {
                                setSortOrder(
                                    sortOrder === "asc" ? "desc" : "asc"
                                );
                                setCurrentPage(1);
                            }}
                            title={`Sort ${
                                sortOrder === "asc" ? "Descending" : "Ascending"
                            }`}
                        >
                            {sortOrder === "asc" ? (
                                <ArrowUp size={16} />
                            ) : (
                                <ArrowDown size={16} />
                            )}
                        </button>
                    </div>
                    <label>
                        Items per page:
                        <select
                            value={itemsPerPage}
                            name="items-per-page-select"
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
                            <th>
                                <button
                                    className="sort-header"
                                    onClick={() => handleSortChange("Id")}
                                >
                                    ID {getSortIcon("Id")}
                                </button>
                            </th>
                            <th>
                                <button
                                    className="sort-header"
                                    onClick={() => handleSortChange("Name")}
                                >
                                    Name {getSortIcon("Name")}
                                </button>
                            </th>
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
                                        <button
                                            className="btn btn-edit"
                                            title="GoTo"
                                            onClick={() => {
                                                handleGotoFeature(feature.id!);
                                            }}
                                        >
                                            <MapPin size={16} />
                                        </button>
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
