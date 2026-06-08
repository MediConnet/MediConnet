import { useState, useEffect, useCallback, useRef } from "react";
import { Comment, UpdateStatusData, RespondCommentData } from "../../domain/comment.entity";
import {
  getCommentsAPI,
  getCommentByIdAPI,
  updateCommentStatusAPI,
  respondToCommentAPI,
  deleteCommentAPI,
} from "../../infrastructure/comments.api";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchText]);

  const loadComments = useCallback(
    async (p: number, ps: number, search: string, status: string, dateFrom: string, dateTo: string) => {
      setLoading(true);
      setError(null);
      try {
        const params: any = { page: p, limit: ps };
        if (search) params.search = search;
        if (status) params.status = status;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        const result = await getCommentsAPI(params);
        setComments(result.data);
        setTotal(result.pagination.total);
      } catch (err: any) {
        setError(err?.message || "Error loading comments");
        setComments([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadComments(page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo);
  }, [page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo, loadComments]);

  const updateStatus = async (id: string, data: UpdateStatusData) => {
    await updateCommentStatusAPI(id, data);
    await loadComments(page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo);
  };

  const respondToComment = async (id: string, data: RespondCommentData) => {
    await respondToCommentAPI(id, data);
    await loadComments(page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo);
  };

  const deleteComment = async (id: string) => {
    await deleteCommentAPI(id);
    await loadComments(page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo);
  };

  return {
    comments,
    loading,
    error,
    total,
    page,
    pageSize,
    searchText,
    statusFilter,
    dateFrom,
    dateTo,
    setPage,
    setPageSize,
    setSearchText,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    updateStatus,
    respondToComment,
    deleteComment,
    reload: () => loadComments(page, pageSize, debouncedSearch, statusFilter, dateFrom, dateTo),
  };
};
