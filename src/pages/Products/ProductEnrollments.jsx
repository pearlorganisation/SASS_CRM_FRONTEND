import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnrollmentsByLevelOrId } from "../../features/actions/product";
import { productEnrollmentsColumn } from "../../utils/columnData";
import DataTable from "../../components/Table/DataTable";
import { useSearchParams } from "react-router-dom";

const ProductEnrollments = () => {
  const tableHeader = "Enrollments";
  const dispatch = useDispatch();
  const { isLoading, pagination, enrollmentsData } = useSelector(
    (state) => state.product
  );
  const { totalPages = 1 } = pagination || {};
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  useEffect(() => {
    console.log(searchParams, searchParams.get("level"));
    const level = parseInt(searchParams.get("level"));
    const productId = searchParams.get("productId");
    console.log(level, productId);
    dispatch(
      getEnrollmentsByLevelOrId({
        productLevel: Number.isNaN(level) ? undefined : level,
        productId: productId || undefined,
        page
      })
    );
  }, [searchParams, page, LIMIT]);
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="productTable"
        tableData={{
          columns: productEnrollmentsColumn,
          rows: enrollmentsData,
        }}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductEnrollments;
